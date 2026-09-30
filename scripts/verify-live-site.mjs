#!/usr/bin/env node
const base = 'https://imashishchawla.github.io/ai-certification-preparation/';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function verify() {
  const [home, terraform, sitemap] = await Promise.all([
    fetch(base, { cache: 'no-store' }),
    fetch(base + 'exams/terraform-associate/', { cache: 'no-store' }),
    fetch(base + 'sitemap.xml', { cache: 'no-store' })
  ]);
  if (![home, terraform, sitemap].every(response => response.ok)) return false;
  const [homeHtml, terraformHtml, sitemapXml] = await Promise.all([home.text(), terraform.text(), sitemap.text()]);
  return homeHtml.includes('<title>Certification Prep — Practice Library</title>') &&
    homeHtml.includes('rel=canonical') && homeHtml.includes('property="og:image"') &&
    homeHtml.includes('published practice questions') &&
    terraformHtml.includes('$70.50') && !terraformHtml.includes('700 / 1000') &&
    sitemapXml.includes('/exams/terraform-associate/');
}

for (let attempt = 1; attempt <= 12; attempt++) {
  try {
    if (await verify()) {
      console.log('[verify-live-site] Published site checks passed.');
      process.exit(0);
    }
  } catch (error) {
    console.error(`[verify-live-site] Attempt ${attempt}: ${error.message}`);
  }
  if (attempt < 12) await sleep(10000);
}
console.error('[verify-live-site] Published site did not match the expected build.');
process.exit(1);
