#!/usr/bin/env node
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required');

const response = await fetch('https://api.github.com/repos/' + repo + '/actions/workflows/curate-certifications.yml/runs?branch=main&event=repository_dispatch&per_page=20', {
  headers: {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'cert-prep-weekly-report',
  },
});
if (!response.ok) throw new Error('Cannot inspect curation workflow: HTTP ' + response.status);
const payload = await response.json();
const latest = payload.workflow_runs?.[0];
const age = latest ? Date.now() - new Date(latest.created_at).getTime() : Infinity;
if (!latest || age < 0 || age > 36 * 60 * 60 * 1000 || latest.status !== 'completed' || latest.conclusion !== 'success') {
  throw new Error('Latest scheduled curation has not succeeded in the last 36 hours');
}
console.log('[weekly-curation] Recent curation passed: ' + latest.html_url);
