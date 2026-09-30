import test from 'node:test';
import assert from 'node:assert/strict';
import { schedulerWeek } from './r2-proxy.mjs';

test('scheduler groups Sunday curation in the ending India week', () => {
  assert.equal(schedulerWeek(new Date('2026-09-27T12:00:00Z')), '2026-W39');
  assert.equal(schedulerWeek(new Date('2026-09-27T18:29:59Z')), '2026-W39');
  assert.equal(schedulerWeek(new Date('2026-09-27T18:30:00Z')), '2026-W40');
});

test('scheduler uses ISO week year at calendar year boundaries', () => {
  assert.equal(schedulerWeek(new Date('2025-12-31T12:00:00Z')), '2026-W01');
});
