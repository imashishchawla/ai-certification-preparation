#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { reportingWeek } from './weekly-report.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerFile = path.join(root, 'data', 'weekly-ledger.json');
const outputDir = process.env.WEEKLY_REPORT_OUTPUT_DIR || path.join(os.tmpdir(), 'cert-prep-weekly-report');
const failureStage = process.argv.includes('--failure') ? process.env.WEEKLY_FAILED_STAGE || 'unknown stage' : '';
const ledger = JSON.parse(fs.readFileSync(ledgerFile, 'utf8'));
const weekId = reportingWeek(new Date(), process.env.WEEKLY_REPORT_WEEK_DATE || '').week_id;
const key = failureStage ? 'failure:' + weekId : weekId;
const delivery = ledger.deliveries?.[key];
const repo = process.env.GITHUB_REPOSITORY || 'imashishchawla/ai-certification-preparation';
const runUrl = process.env.GITHUB_RUN_ID ? 'https://github.com/' + repo + '/actions/runs/' + process.env.GITHUB_RUN_ID : '';
const apiKey = process.env.RESEND_API_KEY;
const sender = process.env.REPORT_EMAIL_FROM;
const recipients = (process.env.REPORT_EMAIL_TO || '').split(',').map(item => item.trim()).filter(Boolean);

function save(state) {
  ledger.deliveries ||= {};
  ledger.deliveries[key] = { ...ledger.deliveries[key], ...state };
  fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2) + '\n');
}

function failureMessage() {
  const latest = ledger.weeks.at(-1);
  const totals = latest?.metrics;
  const text = [
    'Weekly reporting needs attention · ' + weekId,
    'Failed stage: ' + failureStage,
    latest ? 'Last verified snapshot: ' + latest.week_id : 'No verified weekly snapshot yet.',
    totals ? 'Last known totals: ' + totals.questions + ' questions · ' + totals.markdown_documents + ' Markdown documents · ' + totals.rendered_pages + ' pages · ' + totals.documents + ' downloadable files' : '',
    'No new live totals are being claimed.',
    runUrl ? 'Workflow: ' + runUrl : '',
  ].filter(Boolean).join('\n');
  return {
    subject: 'Weekly reporting needs attention · ' + weekId + ' · ' + failureStage,
    text,
    html: '<!doctype html><html><body style="font:14px Arial,sans-serif;color:#222"><pre style="white-space:pre-wrap;font:14px Arial,sans-serif">' +
      text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') + '</pre></body></html>',
  };
}

async function main() {
  if (delivery?.status === 'sent') {
    console.log('[weekly-email] Already sent for ' + key + '; skipping.');
    return;
  }
  if (delivery?.status === 'uncertain') throw new Error('Prior send outcome is uncertain. Reconcile with the email provider before retrying.');
  if (delivery?.status === 'pending' && Date.now() - new Date(delivery.created_at).getTime() > 23 * 60 * 60 * 1000) {
    throw new Error('Pending send is older than provider idempotency window. Reconcile delivery before retrying.');
  }
  if (!apiKey || !sender || !recipients.length) {
    save({ status: 'failed', error: 'Missing RESEND_API_KEY, REPORT_EMAIL_FROM, or REPORT_EMAIL_TO', updated_at: new Date().toISOString() });
    throw new Error('Email configuration is incomplete');
  }
  let message;
  if (failureStage) {
    message = failureMessage();
    if (!delivery) save({ status: 'pending', created_at: new Date().toISOString() });
  } else {
    const entry = ledger.weeks.find(item => item.week_id === weekId);
    if (!entry) throw new Error('No frozen report for ' + weekId);
    if (entry.status.deployment !== 'verified' || entry.status.build !== 'passed') throw new Error('Cannot send a success email for an unverified deployment');
    const report = JSON.parse(fs.readFileSync(path.join(outputDir, 'report.json'), 'utf8'));
    if (report.week_id !== weekId || report.source_sha !== entry.source_sha || report.measured_at !== entry.measured_at) {
      throw new Error('Email output does not match the frozen weekly snapshot');
    }
    message = JSON.parse(fs.readFileSync(path.join(outputDir, 'email.json'), 'utf8'));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'cert-prep/' + key,
      },
      body: JSON.stringify({ from: sender, to: recipients, subject: message.subject, text: message.text, html: message.html }),
    });
  } catch (error) {
    save({ status: 'uncertain', error: error.message, updated_at: new Date().toISOString() });
    throw new Error('Email request outcome is uncertain: ' + error.message);
  } finally {
    clearTimeout(timer);
  }
  const result = await response.json().catch(() => ({}));
  if (response.ok && !result.id) {
    save({ status: 'uncertain', error: 'Resend accepted request but returned no message ID', updated_at: new Date().toISOString() });
    throw new Error('Email provider response is uncertain; reconcile before retrying');
  }
  if (!response.ok) {
    save({ status: 'failed', error: 'Resend HTTP ' + response.status + ': ' + (result.message || result.name || 'unknown error'), updated_at: new Date().toISOString() });
    throw new Error('Email provider rejected the request: HTTP ' + response.status);
  }
  save({ status: 'sent', provider_id: result.id, sent_at: new Date().toISOString(), error: undefined });
  console.log('[weekly-email] Sent ' + key + ' (provider id ' + result.id + ')');
}

main().catch(error => { console.error('[weekly-email] ' + error.message); process.exitCode = 1; });
