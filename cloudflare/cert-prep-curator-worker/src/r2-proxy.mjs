/**
 * R2 proxy handlers for operational state.
 *
 * Keys stored in R2:
 *   exams/<examId>/release-gate.json   — release gate record (set by curator workflow)
 *   exams/<examId>/audit-latest.json   — latest curation run audit summary
 *   scheduler/weeks/<ISO-week>.json     — idempotency guard for scheduled cron
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

// ── Release gate ────────────────────────────────────────────────────────────

/**
 * GET /r2/release-gate           — list all known exam gate records
 * GET /r2/release-gate/:examId   — get one exam's gate record
 */
export async function getReleaseGate(r2, examId) {
  if (examId) {
    const obj = await r2.get(`exams/${examId}/release-gate.json`);
    if (!obj) return json({ status: 'onboarding' }, 404);
    const gate = await obj.json();
    return json(gate);
  }

  // List all exams — walk by prefix
  const listed = await r2.list({ prefix: 'exams/', delimiter: '/' });
  const gates = await Promise.all(
    listed.delimitedPrefixes.map(async prefix => {
      const id = prefix.replace('exams/', '').replace('/', '');
      const obj = await r2.get(`${prefix}release-gate.json`);
      if (!obj) return { id, status: 'onboarding', passed: false };
      return obj.json();
    })
  );
  return json({ exams: gates });
}

/**
 * PUT /r2/release-gate/:examId   — write/update a gate record (curator workflow only)
 */
export async function putReleaseGate(r2, examId, body) {
  if (!examId) return json({ error: 'examId required' }, 400);
  const record = { id: examId, ...body, updatedAt: new Date().toISOString() };
  await r2.put(`exams/${examId}/release-gate.json`, JSON.stringify(record), {
    httpMetadata: { contentType: 'application/json' }
  });
  return json({ ok: true, record });
}

// ── Audit summary ────────────────────────────────────────────────────────────

/**
 * GET /r2/audit/:examId    — get latest audit summary for an exam
 * PUT /r2/audit/:examId    — write audit summary (curator workflow only)
 */
export async function getAuditSummary(r2, examId) {
  if (!examId) return json({ error: 'examId required' }, 400);
  const obj = await r2.get(`exams/${examId}/audit-latest.json`);
  if (!obj) return json({ error: 'no audit found' }, 404);
  return json(await obj.json());
}

export async function putAuditSummary(r2, examId, body) {
  if (!examId) return json({ error: 'examId required' }, 400);
  const record = { examId, ...body, updatedAt: new Date().toISOString() };
  await r2.put(`exams/${examId}/audit-latest.json`, JSON.stringify(record), {
    httpMetadata: { contentType: 'application/json' }
  });
  return json({ ok: true });
}

// ── Scheduler idempotency guard ───────────────────────────────────────────────

export function schedulerWeek(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const date = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const monday = new Date(Date.UTC(+date.year, +date.month - 1, +date.day));
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  const thursday = new Date(monday);
  thursday.setUTCDate(thursday.getUTCDate() + 3);
  const first = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  first.setUTCDate(first.getUTCDate() - (first.getUTCDay() + 6) % 7);
  const week = Math.round((monday - first) / 604800000) + 1;
  return thursday.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function schedulerKey(now = new Date()) {
  return `scheduler/weeks/${schedulerWeek(now)}.json`;
}

/**
 * Check whether a curation run was already triggered in this reporting week.
 * Returns true if a new run should proceed.
 */
export async function shouldTriggerRun(r2) {
  return !(await r2.get(schedulerKey()));
}

export async function markRunTriggered(r2) {
  await r2.put(schedulerKey(), JSON.stringify({ triggeredAt: new Date().toISOString() }), {
    httpMetadata: { contentType: 'application/json' }
  });
}
