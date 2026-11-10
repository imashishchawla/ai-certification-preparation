#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const base = 'https://imashishchawla.github.io/ai-certification-preparation/';
const errors = [];

function read(relative) {
  return fs.readFileSync(path.join(publicDir, relative), 'utf8');
}

function checkPage(relative) {
  const html = read(relative);
  const url = base + (relative === 'index.html' ? '' : relative.replace(/index\.html$/, ''));
  if (!html.includes(`rel=canonical href=${url}`) && !html.includes(`rel="canonical" href="${url}"`)) errors.push(`${relative}: canonical URL missing`);
  if (!html.includes('property="og:title"')) errors.push(`${relative}: Open Graph title missing`);
  if (!html.includes('property="og:image"')) errors.push(`${relative}: Open Graph image missing`);
  if (!html.includes('name=description') && !html.includes('name="description"')) errors.push(`${relative}: description missing`);
  if (/SearchAction|Preparation Certificate|educationalCredentialAwarded/.test(html)) errors.push(`${relative}: unsupported structured-data claim`);
  for (const match of html.matchAll(/<script type=application\/ld\+json>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${relative}: invalid JSON-LD`); }
  }
  return html;
}

const home = checkPage('index.html');
const catalog = checkPage('exams/index.html');
const cca = checkPage('exams/cca-f/index.html');
const terraform = checkPage('exams/terraform-associate/index.html');
const terraformPractice = checkPage('exams/terraform-associate/sample-questions/index.html');
const terraformMock = checkPage('exams/terraform-associate/mock-test/index.html');

const ccaPublished = JSON.parse(read('data/exams/cca-f/questions.json'));
const terraformPublished = JSON.parse(read('data/exams/terraform-associate/questions.json'));
const totalPublished = ccaPublished.length + terraformPublished.length;

if (!home.includes('Certification Prep — Practice Library')) errors.push('Homepage title missing');
if (!home.includes(`${totalPublished}</strong> published practice questions`)) errors.push('Homepage published count does not match browser data');
if (terraformPublished.length < 60) errors.push('Active Terraform question bank under minimum 60-item gate');
if (!terraformPractice.includes('id=questionsContainer') && !terraformPractice.includes('id="questionsContainer"')) errors.push('Active Terraform practice UI is missing');
if (!terraformMock.includes('id=mockTestApp') && !terraformMock.includes('id="mockTestApp"')) errors.push('Active Terraform mock test app is missing');
if (!terraform.includes('$70.50') || /700\s*\/\s*1000|Domains &amp; Weights/.test(terraform)) errors.push('Terraform overview contains an unverified exam claim');
if (!cca.includes('Claude Certified Architect')) errors.push('Active CCAF overview missing');
if (!catalog.includes('In development')) errors.push('Catalog development section missing');

for (const relative of ['exams/ccar-p/index.html', 'exams/ccdv-f/index.html']) {
  const html = checkPage(relative);
  if (!html.includes('noindex, follow')) errors.push(`${relative}: placeholder should be noindex`);
}

if (errors.length) {
  errors.forEach(error => console.error(`[verify-site-build] ${error}`));
  process.exit(1);
}
console.log('[verify-site-build] Metadata, published counts, and onboarding gates passed.');
