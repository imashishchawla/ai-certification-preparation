#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const START = '<!-- WEEKLY-METRICS:START -->';
const END = '<!-- WEEKLY-METRICS:END -->';
const DOWNLOAD = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|epub)$/i;
const METRICS = [
  ['questions', 'Questions'],
  ['markdown_documents', 'Markdown documents'],
  ['rendered_pages', 'Rendered Pages'],
  ['documents', 'PDF & Other documents'],
];
const fmt = n => Number(n).toLocaleString('en-US');
const mib = n => (n / 1048576).toFixed(2) + ' MiB';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const md = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const html = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const isoDate = d => d.toISOString().slice(0, 10);

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    const full = path.join(dir, item.name);
    return item.isDirectory() ? files(full) : item.isFile() ? [full] : [];
  }).sort();
}

function localDay(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return new Date(Date.UTC(+value.year, +value.month - 1, +value.day));
}

function weekOf(day) {
  const monday = new Date(day);
  monday.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
  const thursday = new Date(monday);
  thursday.setUTCDate(monday.getUTCDate() + 3);
  const year = thursday.getUTCFullYear();
  const first = new Date(Date.UTC(year, 0, 4));
  first.setUTCDate(first.getUTCDate() - (first.getUTCDay() + 6) % 7);
  const week = Math.round((monday - first) / 604800000) + 1;
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { week_id: year + '-W' + String(week).padStart(2, '0'), start: isoDate(monday), end: isoDate(sunday) };
}

export function reportingWeek(now = new Date(), overrideDate = '') {
  if (overrideDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(overrideDate)) throw new Error('Invalid --week-date');
    const day = new Date(overrideDate + 'T00:00:00Z');
    if (Number.isNaN(day.valueOf()) || isoDate(day) !== overrideDate) throw new Error('Invalid --week-date');
    return weekOf(day);
  }
  const day = localDay(now);
  const monday = weekOf(day).start;
  const previous = new Date(monday + 'T00:00:00Z');
  previous.setUTCDate(previous.getUTCDate() - 7);
  return weekOf(previous);
}

function contentTitle(value, fallback) {
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const title = match?.[1].match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1];
  return title || fallback;
}

export function collect(root = ROOT) {
  const rel = file => path.relative(root, file).split(path.sep).join('/');
  const documents = {};
  for (const file of files(path.join(root, 'content')).filter(f => f.endsWith('.md'))) {
    const raw = fs.readFileSync(file);
    documents[rel(file)] = { title: contentTitle(raw.toString(), path.basename(file, '.md')), hash: hash(raw) };
  }
  const downloads = {};
  let documentBytes = 0;
  let pdfs = 0;
  for (const file of files(path.join(root, 'static', 'assets')).filter(f => DOWNLOAD.test(f))) {
    const raw = fs.readFileSync(file);
    downloads[rel(file)] = { hash: hash(raw), bytes: raw.length };
    documentBytes += raw.length;
    if (/\.pdf$/i.test(file)) pdfs++;
  }
  const pages = {};
  let siteBytes = 0;
  const built = files(path.join(root, 'public'));
  if (!built.length) throw new Error('public/ is empty; build and audit the site first');
  for (const file of built) {
    const relative = path.relative(path.join(root, 'public'), file).split(path.sep).join('/');
    siteBytes += fs.statSync(file).size;
    if (file.endsWith('.html')) pages[relative] = true;
  }
  const questions = {};
  const questionsByExam = {};
  const artifactRoot = path.join(root, 'public', 'data', 'exams');
  for (const file of files(artifactRoot).filter(f => f.endsWith('/questions.json'))) {
    const exam = path.basename(path.dirname(file));
    const records = readJson(file);
    if (!Array.isArray(records)) throw new Error('Invalid published question artifact: ' + file);
    questionsByExam[exam] = records.length;
    for (const record of records) {
      if (!record.id) throw new Error('Published question lacks an ID: ' + exam);
      const key = exam + '/' + record.id;
      if (questions[key]) throw new Error('Duplicate published question ID: ' + key);
      questions[key] = { hash: hash(JSON.stringify(record)), exam };
    }
  }
  if (!Object.keys(questionsByExam).length) throw new Error('No published question artifacts found; run build-browser-artifacts.mjs');
  const sources = {};
  const registry = readJson(path.join(root, '.agent', 'cert-prep-curator', 'sources.json'));
  for (const [exam, group] of Object.entries(registry.exams || {})) {
    for (const source of group.sources || []) {
      const key = exam + '/' + source.id;
      sources[key] = { name: source.name, exam, url: source.url, active: source.active === true, hash: hash(JSON.stringify(source)) };
    }
  }
  return {
    metrics: {
      questions: Object.keys(questions).length,
      markdown_documents: Object.keys(documents).length,
      rendered_pages: Object.keys(pages).length,
      documents: Object.keys(downloads).length,
      pdfs,
      other_documents: Object.keys(downloads).length - pdfs,
      site_bytes: siteBytes,
      document_bytes: documentBytes,
      questions_by_exam: questionsByExam,
    },
    inventory: { questions, documents, pages, downloads, sources },
  };
}

function difference(before = {}, after = {}) {
  const added = Object.keys(after).filter(key => !(key in before)).sort();
  const removed = Object.keys(before).filter(key => !(key in after)).sort();
  const revised = Object.keys(after).filter(key => key in before && after[key].hash && after[key].hash !== before[key].hash).sort();
  return { added, removed, revised };
}

export function makeEntry(week, measured, sourceSha, current, previous, statuses = {}) {
  const changes = {};
  for (const key of ['questions', 'documents', 'pages', 'downloads', 'sources']) {
    changes[key] = previous
      ? difference(previous.inventory?.[key], current.inventory[key])
      : { added: [], removed: [], revised: [] };
  }
  return {
    ...week,
    measured_at: measured.toISOString(),
    source_sha: sourceSha,
    baseline: !previous,
    status: {
      curation: statuses.curation || 'unknown',
      build: statuses.build || 'passed',
      deployment: statuses.deployment || 'unknown',
    },
    metrics: current.metrics,
    inventory: current.inventory,
    changes,
  };
}

function weekLabel(entry, dated) {
  if (!entry) return 'No snapshot';
  if (!dated) return entry.week_id;
  const start = new Date(entry.start + 'T00:00:00Z');
  const end = new Date(entry.end + 'T00:00:00Z');
  const day = date => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(date);
  return entry.week_id + ' · ' + day(start) + '–' + day(end);
}

function nearestWeeks(ledger, current, max) {
  const byId = new Map(ledger.weeks.map(entry => [entry.week_id, entry]));
  const result = [];
  const day = new Date(current.start + 'T00:00:00Z');
  const earliest = ledger.weeks.filter(entry => entry.start <= current.start).map(entry => entry.start).sort()[0] || current.start;
  for (let i = max - 1; i >= 0; i--) {
    const date = new Date(day);
    date.setUTCDate(day.getUTCDate() - 7 * i);
    const week = weekOf(date);
    const entry = byId.get(week.week_id);
    if (week.start >= earliest) result.push(entry || { ...week, missing: true });
  }
  return result;
}

function prior(ledger, current) {
  const date = new Date(current.start + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() - 7);
  const id = weekOf(date).week_id;
  return ledger.weeks.find(entry => entry.week_id === id);
}

function delta(current, before, key, size = false) {
  if (!before) return 'Baseline unavailable';
  const value = current.metrics[key] - before.metrics[key];
  return (value > 0 ? '+' : '') + (size ? mib(value) : fmt(value));
}

function metricTable(ledger, current, max) {
  const columns = nearestWeeks(ledger, current, max);
  const dated = ledger.weeks.length >= 3;
  const before = prior(ledger, current);
  const header = ['Metric', ...columns.map(entry => weekLabel(entry, dated)), 'This week'];
  const rows = METRICS.map(([key, label]) => [label, ...columns.map(entry => entry.missing ? 'No snapshot' : fmt(entry.metrics[key])), delta(current, before, key)]);
  return [header, ...rows];
}

function markdownTable(rows) {
  return [rows[0].map(md).join(' | '), rows[0].map(() => '---').join(' | '), ...rows.slice(1).map(row => row.map(md).join(' | '))].map(line => '| ' + line + ' |').join('\n');
}

function htmlTable(rows) {
  return '<table style="border-collapse:collapse;width:100%;font:14px Arial,sans-serif"><thead><tr>' +
    rows[0].map(cell => '<th style="border-bottom:2px solid #333;padding:8px;text-align:left">' + html(cell) + '</th>').join('') +
    '</tr></thead><tbody>' + rows.slice(1).map(row => '<tr>' + row.map(cell => '<td style="border-bottom:1px solid #ddd;padding:8px">' + html(cell) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
}

function links() {
  const repo = process.env.GITHUB_REPOSITORY || 'imashishchawla/ai-certification-preparation';
  return {
    readme: 'https://github.com/' + repo + '#readme',
    ledger: 'https://github.com/' + repo + '/blob/main/data/weekly-ledger.json',
    run: process.env.GITHUB_RUN_ID ? 'https://github.com/' + repo + '/actions/runs/' + process.env.GITHUB_RUN_ID : '',
  };
}

function changeLines(entry, detailed = false) {
  const c = entry.changes;
  const line = (label, change) => label + ': +' + change.added.length + ' added, -' + change.removed.length + ' removed, ' + change.revised.length + ' revised';
  const result = [line('Questions', c.questions), line('Markdown documents', c.documents), line('Rendered Pages', c.pages), line('PDF & Other documents', c.downloads)];
  const sources = c.sources.added.map(key => entry.inventory.sources[key]);
  result.push('New sources: ' + (sources.length ? sources.map(s => s.name + ' · ' + s.exam + ' · ' + s.url + (s.active ? '' : ' (inactive)')).join('; ') : 'None'));
  result.push('Updated sources: ' + (c.sources.revised.length || 0));
  if (detailed) {
    if (c.sources.revised.length) {
      result.push('Updated source details: ' + c.sources.revised.map(key => {
        const source = entry.inventory.sources[key];
        return source ? source.name + ' · ' + source.exam + ' · ' + source.url : key;
      }).join('; '));
    }
    for (const [label, category] of [['Questions', 'questions'], ['Documents', 'documents'], ['Pages', 'pages'], ['Downloads', 'downloads']]) {
      for (const action of ['added', 'removed', 'revised']) {
        const names = c[category][action].slice(0, 20).map(key => category === 'documents' ? (entry.inventory.documents[key] || {}).title || key : key);
        if (names.length) result.push(label + ' ' + action + ': ' + names.join(', ') + (c[category][action].length > 20 ? ' (+' + (c[category][action].length - 20) + ' more)' : ''));
      }
    }
  }
  return result;
}

export function render(ledger, entry) {
  const before = prior(ledger, entry);
  const fullTable = metricTable(ledger, entry, 5);
  const readmeTable = metricTable(ledger, entry, 2);
  const latestLabel = weekLabel(entry, ledger.weeks.length >= 3);
  const siteDelta = delta(entry, before, 'site_bytes', true);
  const downloadsDelta = delta(entry, before, 'document_bytes', true);
  const byExam = Object.entries(entry.metrics.questions_by_exam).sort().map(([exam, count]) => exam + ': ' + fmt(count)).join(' · ');
  const refs = links();
  const footer = 'Measured ' + entry.measured_at + ' · Source ' + entry.source_sha + (refs.run ? ' · Run ' + refs.run : '');
  const shortChanges = changeLines(entry);
  const longChanges = changeLines(entry, true);
  const summary = [
    '## Weekly platform report · ' + latestLabel,
    '',
    'Status: ' + entry.status.deployment + ' · ' + footer,
    '',
    markdownTable(fullTable), '',
    markdownTable([
      ['Storage', 'Previous week', 'This week', 'Change'],
      ['Published site', before ? mib(before.metrics.site_bytes) : 'Baseline unavailable', mib(entry.metrics.site_bytes), siteDelta],
      ['Included PDF & Other documents', before ? mib(before.metrics.document_bytes) : 'Baseline unavailable', mib(entry.metrics.document_bytes), downloadsDelta],
    ]), '',
    'Questions by exam: ' + byExam, '',
    'Downloads: ' + fmt(entry.metrics.pdfs) + ' PDF · ' + fmt(entry.metrics.other_documents) + ' other', '',
    '### What changed', '',
    ...(entry.baseline ? ['Baseline snapshot; no previous inventory exists for a change comparison.', ''] : []),
    ...longChanges.map(line => '- ' + md(line)), '',
    'Complete manifest: ' + refs.ledger, '',
    'Checks: Curation ' + entry.status.curation + ' · Build/audit ' + entry.status.build + ' · Deployment ' + entry.status.deployment,
  ].join('\n');
  const readme = [
    '### Weekly platform update · ' + latestLabel, '',
    markdownTable(readmeTable), '',
    'Site size: ' + mib(entry.metrics.site_bytes) + ' (' + siteDelta + '); includes ' + mib(entry.metrics.document_bytes) + ' of downloadable files (' + fmt(entry.metrics.pdfs) + ' PDF, ' + fmt(entry.metrics.other_documents) + ' other).', '',
    '**What changed:** ' + (entry.baseline ? 'Baseline snapshot; no prior change comparison' : shortChanges.slice(0, 4).map(md).join('; ')) + '.  ',
    '**New sources:** ' + md(shortChanges[4].replace(/^New sources: /, '')) + '.  ',
    '**Status:** ' + entry.status.deployment + ' · ' + footer + '.',
  ].join('\n');
  const subject = 'Weekly update · ' + latestLabel + ' · ' + delta(entry, before, 'questions') + ' questions, ' + delta(entry, before, 'markdown_documents') + ' documents';
  const plain = [
    'Weekly update · ' + latestLabel + ' · ' + entry.status.deployment, '',
    fullTable.map(row => row.join(' | ')).join('\n'), '',
    'Published site: ' + mib(entry.metrics.site_bytes) + ' (' + siteDelta + ')',
    'Included downloads: ' + mib(entry.metrics.document_bytes) + ' (' + downloadsDelta + ')',
    'Downloads: ' + fmt(entry.metrics.pdfs) + ' PDF · ' + fmt(entry.metrics.other_documents) + ' other',
    'Questions by exam: ' + byExam, '',
    'What changed', ...(entry.baseline ? ['Baseline snapshot; no prior change comparison.'] : []), ...shortChanges.map(line => '- ' + line), '',
    'Checks: Curation ' + entry.status.curation + ' · Build/audit ' + entry.status.build + ' · Deployment ' + entry.status.deployment,
    footer, 'README: ' + refs.readme,
  ].join('\n');
  const mailHtml = '<!doctype html><html><body style="color:#202020;background:#fff;font:14px Arial,sans-serif;max-width:860px;margin:24px auto">' +
    '<h2>Weekly update · ' + html(latestLabel) + '</h2><p>Status: ' + html(entry.status.deployment) + '</p>' +
    htmlTable(fullTable) + '<p><strong>Published site:</strong> ' + html(mib(entry.metrics.site_bytes)) + ' (' + html(siteDelta) + ')<br>' +
    '<strong>Included downloads:</strong> ' + html(mib(entry.metrics.document_bytes)) + ' (' + html(downloadsDelta) + ')<br>' +
    '<strong>Questions by exam:</strong> ' + html(byExam) + '<br>' +
    '<strong>Downloads:</strong> ' + html(fmt(entry.metrics.pdfs) + ' PDF · ' + fmt(entry.metrics.other_documents) + ' other') + '</p><h3>What changed</h3><ul>' +
    (entry.baseline ? '<li>Baseline snapshot; no prior change comparison.</li>' : '') + shortChanges.map(line => '<li>' + html(line) + '</li>').join('') + '</ul><p>Checks: ' +
    html('Curation ' + entry.status.curation + ' · Build/audit ' + entry.status.build + ' · Deployment ' + entry.status.deployment) +
    '</p><p style="color:#555;font-size:12px">' + html(footer) + '<br><a href="' + html(refs.readme) + '">README</a>' +
    (refs.run ? ' · <a href="' + html(refs.run) + '">Workflow run</a>' : '') + '</p></body></html>';
  return { summary, readme, subject, plain, html: mailHtml };
}

export function replaceReadme(source, rendered) {
  if (source.split(START).length !== 2 || source.split(END).length !== 2 || source.indexOf(START) > source.indexOf(END)) {
    throw new Error('README must contain exactly one ordered weekly metrics marker pair');
  }
  return source.slice(0, source.indexOf(START) + START.length) + '\n' + rendered + '\n' + source.slice(source.indexOf(END));
}

function arg(name) {
  const index = process.argv.indexOf(name);
  return index < 0 ? '' : process.argv[index + 1] || '';
}

async function main() {
  const publish = process.argv.includes('--publish');
  const dryRun = process.argv.includes('--dry-run');
  if (publish === dryRun) throw new Error('Choose exactly one of --publish or --dry-run');
  const root = arg('--root') ? path.resolve(arg('--root')) : ROOT;
  const ledgerPath = path.join(root, 'data', 'weekly-ledger.json');
  const readmePath = path.join(root, 'README.md');
  const ledger = fs.existsSync(ledgerPath) ? readJson(ledgerPath) : { version: 1, weeks: [], reports: {}, deliveries: {} };
  if (ledger.version !== 1 || !Array.isArray(ledger.weeks)) throw new Error('Unsupported weekly ledger');
  const week = reportingWeek(arg('--now') ? new Date(arg('--now')) : new Date(), arg('--week-date'));
  let entry = ledger.weeks.find(item => item.week_id === week.week_id);
  const existing = Boolean(entry);
  if (!entry) {
    const previousDay = new Date(week.start + 'T00:00:00Z');
    previousDay.setUTCDate(previousDay.getUTCDate() - 7);
    const previous = ledger.weeks.find(item => item.week_id === weekOf(previousDay).week_id);
    const sourceSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    entry = makeEntry(week, arg('--now') ? new Date(arg('--now')) : new Date(), sourceSha, collect(root), previous, {
      curation: process.env.WEEKLY_CURATION_STATUS,
      build: process.env.WEEKLY_BUILD_STATUS,
      deployment: process.env.WEEKLY_DEPLOYMENT_STATUS,
    });
    ledger.weeks.push(entry);
    ledger.weeks.sort((a, b) => a.week_id.localeCompare(b.week_id));
  }
  if (!ledger.deliveries) ledger.deliveries = {};
  if (!ledger.deliveries[week.week_id]) ledger.deliveries[week.week_id] = { status: 'pending', created_at: new Date().toISOString() };
  if (existing && !ledger.reports?.[week.week_id]) throw new Error('Frozen report payload is missing for ' + week.week_id);
  const output = existing ? ledger.reports[week.week_id] : render(ledger, entry);
  if (publish) {
    ledger.reports ||= {};
    ledger.reports[week.week_id] ||= output;
  }
  const outDir = path.resolve(arg('--output-dir') || path.join(os.tmpdir(), 'cert-prep-weekly-report'));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(entry, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'summary.md'), output.summary + '\n');
  fs.writeFileSync(path.join(outDir, 'email.json'), JSON.stringify({ subject: output.subject, text: output.plain, html: output.html }, null, 2) + '\n');
  if (publish) {
    fs.writeFileSync(readmePath, replaceReadme(fs.readFileSync(readmePath, 'utf8'), output.readme));
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, output.summary + '\n');
  }
  console.log('[weekly-report] ' + week.week_id + ' · ' + (publish ? 'published files' : 'dry run') + ' · output ' + outDir);
  console.log('[weekly-report] ' + JSON.stringify(entry.metrics));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error('[weekly-report] ' + error.message); process.exitCode = 1; });
}
