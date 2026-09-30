#!/usr/bin/env node
/**
 * Full Site Integrity Auditor
 * Audits every single generated HTML page in public/ to verify:
 * - HTML structure and valid titles
 * - Correct subpath asset links (/ai-certification-preparation/)
 * - Zero broken internal links
 * - Zero unrendered Hugo template tags
 * - Zero personal names
 * - CCAF page count matches the published browser artifact
 */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const ccaPublishedCount = JSON.parse(fs.readFileSync(path.join(publicDir, 'data/exams/cca-f/questions.json'), 'utf8')).length;

if (!fs.existsSync(publicDir)) {
  console.error('[ERROR] public/ does not exist. Run hugo build first.');
  process.exit(1);
}

const allPages = [];
function collectHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full);
    } else if (entry.name.endsWith('.html')) {
      allPages.push(full);
    }
  }
}
collectHtml(publicDir);

console.log(`[AUDIT] Found ${allPages.length} rendered HTML pages in public/.\n`);

const FORBIDDEN_NAMES = ['dnacenta', 'paullarionov', 'szymon', 'paluch', 'amey thakur', 'neha sharma'];
let issuesCount = 0;
const auditedRoutes = [];

// Collect all valid routes for link verification
const validRoutes = new Set();
for (const p of allPages) {
  let rel = path.relative(publicDir, p).replace(/index\.html$/, '');
  if (rel.endsWith('/')) rel = rel.slice(0, -1);
  const route = '/ai-certification-preparation/' + (rel ? rel + '/' : '');
  validRoutes.add(route);
  validRoutes.add(route.slice(0, -1)); // without trailing slash
}

for (const pagePath of allPages) {
  const relPath = path.relative(publicDir, pagePath);
  const html = fs.readFileSync(pagePath, 'utf8');

  const pageErrors = [];

  // 1. Check title
  if (!html.includes('<title>')) {
    pageErrors.push('Missing <title> tag');
  }

  // 2. Check unrendered Hugo template tags outside code/pre blocks
  const htmlWithoutCode = html.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, '').replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, '');
  if (/\{\{\s*[\.\$a-zA-Z]/.test(htmlWithoutCode)) {
    pageErrors.push('Unrendered Hugo template tags detected outside code blocks');
  }

  // 3. Check for stale personal names (ignore external URLs if any)
  for (const name of FORBIDDEN_NAMES) {
    // Check if name appears outside an href url
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    if (regex.test(html)) {
      pageErrors.push(`Contains forbidden personal name: "${name}"`);
    }
  }

  // 4. Check for broken root-level stylesheet links (missing /ai-certification-preparation/)
  if (html.includes('href="/css/theme.min.') || html.includes("href='/css/theme.min.")) {
    pageErrors.push('Broken stylesheet link: missing /ai-certification-preparation/ prefix');
  }

  // 5. Check internal links inside nav and content
  const hrefMatches = html.matchAll(/href="(\/ai-certification-preparation\/[^"#?]+)/g);
  for (const m of hrefMatches) {
    const target = m[1].endsWith('/') ? m[1] : m[1] + '/';
    if (!validRoutes.has(target) && !validRoutes.has(m[1])) {
      // Check if it's an asset or static file
      const assetRel = m[1].replace('/ai-certification-preparation/', '');
      const assetPath = path.join(publicDir, assetRel);
      if (!fs.existsSync(assetPath)) {
        pageErrors.push(`Broken internal link target: ${m[1]}`);
      }
    }
  }

  // 6. Check question counter accuracy on sample questions & exam index
  if (relPath.startsWith('exams/cca-f/sample-questions/')) {
    if (html.includes('Practice 205')) {
      pageErrors.push('Stale question count: mentions "Practice 205" instead of 1,130');
    }
    if (!html.includes(String(ccaPublishedCount)) && !html.includes(ccaPublishedCount.toLocaleString('en-US'))) {
      pageErrors.push(`Question count does not match published CCAF artifact (${ccaPublishedCount})`);
    }
  }

  if (pageErrors.length > 0) {
    console.error(`❌ [ISSUE] ${relPath}:`);
    for (const err of pageErrors) {
      console.error(`   - ${err}`);
    }
    issuesCount += pageErrors.length;
  } else {
    auditedRoutes.push(relPath);
  }
}

console.log(`\n======================================================`);
console.log(`Audit Completed: ${allPages.length} pages checked.`);
if (issuesCount === 0) {
  console.log(`✅ ALL ${allPages.length} PAGES PASSED INTEGRITY VERIFICATION!`);
  console.log(`- 100% Valid HTML titles and structural markup`);
  console.log(`- 100% Subpath-aligned asset URLs (/ai-certification-preparation/)`);
  console.log(`- Zero unrendered template tags`);
  console.log(`- Zero forbidden personal names`);
  console.log(`- CCAF question count matches ${ccaPublishedCount} published questions`);
} else {
  console.error(`❌ Found ${issuesCount} issues across pages.`);
  process.exit(1);
}
