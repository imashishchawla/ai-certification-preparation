#!/usr/bin/env node
import fs from 'node:fs';

const output = process.argv[2];
if (!output) {
  console.error('Usage: node scripts/write-analytics-config.mjs <output.toml>');
  process.exit(1);
}

const ga = (process.env.GA_MEASUREMENT_ID || '').trim();
const cfInput = (process.env.CF_ANALYTICS_TOKEN || '').trim();
const cfMatch = cfInput.match(/(?:"token"\s*:\s*")([a-f0-9]{32})(?:")/i);
const cf = cfMatch ? cfMatch[1] : cfInput;

if (ga && !/^G-[A-Z0-9]+$/.test(ga)) {
  console.error('GA_MEASUREMENT_ID must be a GA4 measurement ID.');
  process.exit(1);
}
if (cf && !/^[a-f0-9]{32}$/i.test(cf)) {
  console.error('CF_ANALYTICS_TOKEN must be a token or Cloudflare beacon snippet.');
  process.exit(1);
}

fs.writeFileSync(output, `[params]\nga_measurement_id = "${ga}"\ncf_analytics_token = "${cf}"\n`);
console.log('Analytics configuration prepared.');
