#!/usr/bin/env node
/**
 * SEO Spider & Deep Content Auditor
 * Crawls all rendered HTML pages in public/ like a search engine bot.
 * Checks for:
 * 1. Broken internal links (404s) - both relative (../, ./) and root-relative
 * 2. Missing base path prefix (/ai-certification-preparation/) on links and assets
 * 3. Broken anchor fragments (#heading-id that does not exist in target page)
 * 4. Broken image and media assets
 * 5. Content defects: missing H1s, empty titles, raw unrendered markdown syntax
 * 6. Markdown file links (.md) that were not mapped to Hugo URLs
 */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const BASE_PREFIX = '/ai-certification-preparation';

if (!fs.existsSync(publicDir)) {
  console.error('[ERROR] public/ does not exist. Run hugo build first.');
  process.exit(1);
}

// 1. Discover all HTML pages and assets
const htmlFiles = new Map(); // routePath -> { filePath, html, ids: Set<string> }
const allAssetFiles = new Set(); // relative path from public/

function crawlDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const relFromPublic = path.relative(publicDir, full);
    if (entry.isDirectory()) {
      crawlDir(full);
    } else if (entry.name.endsWith('.html')) {
      let route = '/' + relFromPublic.replace(/index\.html$/, '');
      if (route.endsWith('/') && route !== '/') route = route.slice(0, -1);
      
      const html = fs.readFileSync(full, 'utf8');
      
      // Extract all element IDs for fragment verification
      const ids = new Set();
      const idMatches = html.matchAll(/\bid=["']([^"']+)["']/gi);
      for (const m of idMatches) {
        ids.add(m[1]);
      }

      htmlFiles.set(route, { filePath: full, relFromPublic, html, ids });
      allAssetFiles.add(relFromPublic);
    } else {
      allAssetFiles.add(relFromPublic);
    }
  }
}

crawlDir(publicDir);

console.log(`=============================================================`);
console.log(`🕷️  SEO SPIDER CRAWL REPORT`);
console.log(`Indexed ${htmlFiles.size} pages and ${allAssetFiles.size} total files.`);
console.log(`=============================================================\n`);

const brokenLinks = [];
const missingPrefixLinks = [];
const unmappedMdLinks = [];
const brokenFragments = [];
const brokenAssets = [];
const contentIssues = [];

for (const [route, page] of htmlFiles.entries()) {
  const { filePath, relFromPublic, html, ids } = page;
  const pageDirRoute = route === '/' ? '/' : path.posix.dirname(route);

  // --- Content & SEO Checks ---
  // Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    contentIssues.push({ page: route, issue: 'Missing or empty <title> tag' });
  }

  // H1
  const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    contentIssues.push({ page: route, issue: 'Missing or empty <h1> heading' });
  }

  // Check for raw unrendered markdown links: [Text](url)
  const rawMdLinkMatch = html.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (rawMdLinkMatch) {
    contentIssues.push({ page: route, issue: `Raw unrendered Markdown link syntax detected: "${rawMdLinkMatch[0]}"` });
  }

  // --- Link Crawling ---
  // Extract all hrefs (supporting both quoted and unquoted minified HTML attributes)
  const hrefMatches = html.matchAll(/\bhref=(?:["\x27]([^"\x27]+)["\x27]|([^\s>]+))/gi);
  for (const m of hrefMatches) {
    const rawHref = (m[1] || m[2] || '').trim();

    // Skip mailto, tel, javascript, external links
    if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) continue;
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) continue;

    // Check for raw .md links (common in copy-pasted markdown)
    if (rawHref.includes('.md')) {
      unmappedMdLinks.push({ page: route, href: rawHref });
      continue;
    }

    // Check for links missing base prefix (e.g. href="/exams/...")
    if (rawHref.startsWith('/exams/') || rawHref.startsWith('/css/') || rawHref.startsWith('/js/') || rawHref.startsWith('/assets/')) {
      missingPrefixLinks.push({ page: route, href: rawHref });
      continue;
    }

    // Separate URL and hash fragment
    let [pathPart, fragment] = rawHref.split('#');

    let resolvedRoute = '';
    if (pathPart.startsWith(BASE_PREFIX)) {
      // Subpath-prefixed absolute link: /ai-certification-preparation/exams/...
      let stripped = pathPart.slice(BASE_PREFIX.length);
      if (!stripped) stripped = '/';
      resolvedRoute = stripped.endsWith('/') && stripped !== '/' ? stripped.slice(0, -1) : stripped;
    } else if (pathPart.startsWith('/')) {
      // Root relative link without base prefix
      resolvedRoute = pathPart.endsWith('/') && pathPart !== '/' ? pathPart.slice(0, -1) : pathPart;
    } else if (pathPart === '') {
      // Anchor on same page: #section
      resolvedRoute = route;
    } else {
      // Relative link: ../exams or foo/bar
      const currentDir = route.endsWith('/') ? route : route + '/';
      const resolved = path.posix.resolve(pageDirRoute === '/' ? '/' : route, pathPart);
      resolvedRoute = resolved.endsWith('/') && resolved !== '/' ? resolved.slice(0, -1) : resolved;
    }

    // Normalize empty to root
    if (!resolvedRoute) resolvedRoute = '/';

    // Verify target existence
    const targetPage = htmlFiles.get(resolvedRoute);
    const targetAsset = allAssetFiles.has(resolvedRoute.replace(/^\//, '')) || allAssetFiles.has(resolvedRoute.replace(/^\//, '') + '/index.html');

    if (!targetPage && !targetAsset) {
      brokenLinks.push({ page: route, href: rawHref, resolved: resolvedRoute });
    } else if (targetPage && fragment) {
      // Verify fragment anchor ID
      if (!targetPage.ids.has(fragment)) {
        brokenFragments.push({ page: route, href: rawHref, targetPage: resolvedRoute, fragment });
      }
    }
  }

  // --- Asset Crawling ---
  const srcMatches = html.matchAll(/\bsrc=(?:["\x27]([^"\x27]+)["\x27]|([^\s>]+))/gi);
  for (const m of srcMatches) {
    const src = (m[1] || m[2] || '').trim();
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;

    if (src.startsWith('/js/') || src.startsWith('/css/') || src.startsWith('/images/')) {
      missingPrefixLinks.push({ page: route, href: src });
      continue;
    }

    let assetRel = src;
    if (src.startsWith(BASE_PREFIX)) {
      assetRel = src.slice(BASE_PREFIX.length);
    }
    assetRel = assetRel.replace(/^\//, '');

    if (!allAssetFiles.has(assetRel)) {
      brokenAssets.push({ page: route, src });
    }
  }
}

// Print Results
console.log(`--- CRAWL AUDIT FINDINGS ---\n`);

console.log(`1. Broken Internal Links (404 targets): ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  brokenLinks.slice(0, 15).forEach(b => console.log(`   ❌ [404] Page: ${b.page} -> Href: "${b.href}" (Resolved: ${b.resolved})`));
  if (brokenLinks.length > 15) console.log(`   ... and ${brokenLinks.length - 15} more.`);
}

console.log(`\n2. Missing Subpath Prefix (/ai-certification-preparation/): ${missingPrefixLinks.length}`);
if (missingPrefixLinks.length > 0) {
  missingPrefixLinks.slice(0, 15).forEach(m => console.log(`   ⚠️ [Missing Prefix] Page: ${m.page} -> "${m.href}"`));
  if (missingPrefixLinks.length > 15) console.log(`   ... and ${missingPrefixLinks.length - 15} more.`);
}

console.log(`\n3. Unmapped Markdown Links (.md): ${unmappedMdLinks.length}`);
if (unmappedMdLinks.length > 0) {
  unmappedMdLinks.slice(0, 15).forEach(u => console.log(`   ⚠️ [Raw .md Link] Page: ${u.page} -> "${u.href}"`));
  if (unmappedMdLinks.length > 15) console.log(`   ... and ${unmappedMdLinks.length - 15} more.`);
}

console.log(`\n4. Broken Anchor Fragments (#id): ${brokenFragments.length}`);
if (brokenFragments.length > 0) {
  brokenFragments.slice(0, 10).forEach(f => console.log(`   ⚠️ [Broken Fragment] Page: ${f.page} -> Target: ${f.targetPage}#${f.fragment}`));
}

console.log(`\n5. Broken Image / Media Assets: ${brokenAssets.length}`);
if (brokenAssets.length > 0) {
  brokenAssets.slice(0, 10).forEach(a => console.log(`   ❌ [Missing Asset] Page: ${a.page} -> "${a.src}"`));
}

console.log(`\n6. Content / Structural Issues: ${contentIssues.length}`);
if (contentIssues.length > 0) {
  contentIssues.forEach(c => console.log(`   ⚠️ [Content] Page: ${c.page} -> ${c.issue}`));
}

const totalFailures = brokenLinks.length + missingPrefixLinks.length + unmappedMdLinks.length + brokenAssets.length;
console.log(`\n=============================================================`);
console.log(`TOTAL DETECTED DEFECTS: ${totalFailures}`);
console.log(`=============================================================`);

if (totalFailures > 0) {
  process.exit(1);
} else {
  console.log(`🎉 PERFECT SCORE: Zero broken links, zero missing prefixes, zero 404s!`);
}
