#!/usr/bin/env node
import fs from 'node:fs';

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required');

const isOptional = process.env.WEEKLY_CURATION_OPTIONAL !== 'false';

const response = await fetch('https://api.github.com/repos/' + repo + '/actions/workflows/curate-certifications.yml/runs?branch=main&per_page=20', {
  headers: {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'cert-prep-weekly-report',
  },
});
if (!response.ok) {
  if (isOptional) {
    console.warn('[weekly-curation] Cannot inspect curation workflow (HTTP ' + response.status + '); skipping curation check.');
    setOutput('status', 'unverified');
    process.exit(0);
  }
  throw new Error('Cannot inspect curation workflow: HTTP ' + response.status);
}
const payload = await response.json();
const latest = payload.workflow_runs?.[0];

if (!latest) {
  console.log('[weekly-curation] No scheduled curation runs found; curation is inactive or not yet dispatched. Skipping curation check.');
  setOutput('status', 'skipped');
  process.exit(0);
}

const age = Date.now() - new Date(latest.created_at).getTime();
if (age < 0 || age > 36 * 60 * 60 * 1000 || latest.status !== 'completed' || latest.conclusion !== 'success') {
  if (isOptional) {
    console.warn('[weekly-curation] Latest scheduled curation has not succeeded in the last 36 hours; skipping check as curation is optional.');
    setOutput('status', 'unverified');
    process.exit(0);
  }
  throw new Error('Latest scheduled curation has not succeeded in the last 36 hours');
}

setOutput('status', 'verified');
console.log('[weekly-curation] Recent curation passed: ' + latest.html_url);

