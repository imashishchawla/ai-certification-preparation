import test from 'node:test';
import assert from 'node:assert/strict';
import { makeEntry, render, replaceReadme, reportingWeek } from './weekly-report.mjs';

const measured = new Date('2026-10-19T03:00:00Z');
const inventory = (sources = {}) => ({ questions: {}, documents: {}, pages: {}, downloads: {}, sources });
const metrics = count => ({
  questions: count, markdown_documents: count, rendered_pages: count, documents: count, pdfs: count, other_documents: 0,
  site_bytes: count * 1048576, document_bytes: count * 1000, questions_by_exam: { 'cca-f': count },
});
const snapshot = (date, count, previous, sources = {}) => makeEntry(
  reportingWeek(measured, date), measured, 'abc123', { metrics: metrics(count), inventory: inventory(sources) }, previous,
  { curation: 'verified', build: 'passed', deployment: 'verified' },
);

test('reporting calendar uses the prior completed Asia/Kolkata week and ISO year', () => {
  assert.equal(reportingWeek(new Date('2026-01-04T20:00:00Z')).week_id, '2026-W01');
  assert.deepEqual(reportingWeek(measured, '2025-12-31'), {
    week_id: '2026-W01', start: '2025-12-29', end: '2026-01-04',
  });
  assert.throws(() => reportingWeek(measured, '2026-02-30'), /Invalid --week-date/);
});

test('first snapshot is a baseline, not an invented batch of new sources', () => {
  const first = snapshot('2026-10-04', 10, undefined, { 'cca-f/source': { name: 'Existing', exam: 'cca-f', url: 'https://example.org', active: true } });
  assert.equal(first.baseline, true);
  assert.deepEqual(first.changes.sources.added, []);
  const output = render({ weeks: [first] }, first);
  assert.match(output.summary, /Baseline snapshot; no previous inventory/);
  assert.match(output.readme, /New sources:\*\* None/);
});

test('third reporting week adds dates, limits history, and lists only newly registered sources', () => {
  const weeks = [];
  let previous;
  for (const date of ['2026-10-04', '2026-10-11', '2026-10-18']) {
    const source = date === '2026-10-18' ? { 'cca-f/new': { name: 'Official guide', exam: 'cca-f', url: 'https://example.org/guide', active: true } } : {};
    const entry = snapshot(date, weeks.length + 10, previous, source);
    weeks.push(entry);
    previous = entry;
  }
  const result = render({ weeks }, weeks.at(-1));
  assert.match(result.summary, /2026-W42 · 12 Oct–18 Oct/);
  assert.match(result.summary, /New sources: Official guide/);
  assert.match(result.summary, /\+1/);
  assert.doesNotMatch(result.readme, /2026-W40/);
  assert.match(result.readme, /2026-W41/);
  assert.match(result.readme, /2026-W42/);
});

test('full report shows at most five weeks and a missing immediate week has no delta', () => {
  const weeks = [];
  let previous;
  for (const date of ['2026-09-13', '2026-09-20', '2026-09-27', '2026-10-04', '2026-10-11', '2026-10-18']) {
    const entry = snapshot(date, weeks.length + 1, previous);
    weeks.push(entry);
    previous = entry;
  }
  const latest = weeks.at(-1);
  const output = render({ weeks }, latest);
  assert.doesNotMatch(output.summary, /2026-W37/);
  assert.match(output.summary, /2026-W38/);
  const missing = render({ weeks: [weeks[0], latest] }, latest);
  assert.match(missing.summary, /No snapshot/);
  assert.match(missing.summary, /Baseline unavailable/);
});

test('README markers are required exactly once and manual text is preserved', () => {
  const source = 'intro\n<!-- WEEKLY-METRICS:START -->\nold\n<!-- WEEKLY-METRICS:END -->\noutro';
  assert.equal(replaceReadme(source, 'new'), 'intro\n<!-- WEEKLY-METRICS:START -->\nnew\n<!-- WEEKLY-METRICS:END -->\noutro');
  assert.throws(() => replaceReadme('intro', 'new'), /exactly one/);
});
