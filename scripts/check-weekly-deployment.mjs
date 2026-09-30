#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required');

const response = await fetch('https://api.github.com/repos/' + repo + '/actions/workflows/deploy.yml/runs?branch=main&per_page=20', {
  headers: {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'cert-prep-weekly-report',
  },
});
if (!response.ok) throw new Error('Cannot inspect deployment workflow: HTTP ' + response.status);
const payload = await response.json();
const latest = payload.workflow_runs?.[0];
if (!latest || latest.status !== 'completed' || latest.conclusion !== 'success') {
  throw new Error('Latest deployment run has not succeeded');
}
const deployedSha = latest.head_sha;
try {
  execFileSync('git', ['merge-base', '--is-ancestor', deployedSha, 'HEAD']);
  execFileSync('git', [
    'diff', '--quiet', deployedSha, 'HEAD', '--',
    'content/', 'static/', 'themes/', 'assets/', 'data/questions/', 'data/exams.toml',
    'hugo.toml', 'scripts/build-browser-artifacts.mjs', 'scripts/write-analytics-config.mjs',
  ]);
} catch {
  throw new Error('Current site content differs from the latest successful deployment (' + deployedSha + ')');
}
console.log('[weekly-deployment] Latest deployment passed for compatible source ' + deployedSha);
