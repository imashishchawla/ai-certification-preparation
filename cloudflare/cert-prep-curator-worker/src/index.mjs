/**
 * Cloudflare Worker — Cert Prep Curator Control Plane (v2)
 *
 * Responsibilities:
 *  1. Scheduled cron (Sun/Mon 18:30 UTC = Mon/Tue 00:00 IST)
 *     — dispatches a `certification-curation` repository_dispatch event to GitHub
 *     — includes a { category } payload so the Actions workflow can pick the right exams
 *     — idempotency guard via R2 prevents duplicate runs from the twin cron entries
 *
 *  2. HMAC-authenticated R2 proxy (GitHub Actions → Worker → R2)
 *     — all write paths require X-Curator-Timestamp + X-Curator-Signature headers
 *     — read paths for release-gate are unauthenticated (public status)
 *     — no CORS headers: this is a server-to-server control-plane Worker only
 *
 *  3. Health endpoint (unauthenticated, exam-agnostic)
 *
 * Secrets required (set via wrangler secret put):
 *   GITHUB_DISPATCH_TOKEN    fine-grained PAT, scope: Actions Read & Write
 *   STATUS_HMAC_SECRET       shared hex secret (also set as GitHub repo secret)
 */

import { verifyHmac } from './hmac.mjs';
import {
  getReleaseGate, putReleaseGate,
  getAuditSummary, putAuditSummary,
  shouldTriggerRun, markRunTriggered
} from './r2-proxy.mjs';

const jsonResp = (data, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

// ── Route table ──────────────────────────────────────────────────────────────

export default {
  // ── Scheduled cron handler ────────────────────────────────────────────────
  async scheduled(event, env, ctx) {
    console.log('[Worker] Scheduled cron fired:', event.cron);

    if (!env.GITHUB_DISPATCH_TOKEN || !env.GITHUB_REPO) {
      console.error('[Worker] Missing GITHUB_DISPATCH_TOKEN or GITHUB_REPO — cannot dispatch');
      return;
    }

    // Idempotency guard — skip if this reporting week already triggered a run.
    if (env.CERT_PREP_STATE) {
      const proceed = await shouldTriggerRun(env.CERT_PREP_STATE);
      if (!proceed) {
        console.log('[Worker] Idempotency guard: run already triggered this week — skipping');
        return;
      }
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
            'User-Agent': 'Cloudflare-Worker-Cert-Prep-Curator/2.0',
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'certification-curation',
            client_payload: { category: 'all', source: 'scheduled-cron' }
          })
        }
      );

      if (!res.ok) {
        const body = await res.text();
        console.error(`[Worker] GitHub dispatch failed: HTTP ${res.status} — ${body}`);
        return;
      }

      console.log('[Worker] GitHub dispatch succeeded — certification-curation event fired');

      if (env.CERT_PREP_STATE) {
        await markRunTriggered(env.CERT_PREP_STATE);
      }
    } catch (err) {
      console.error('[Worker] GitHub dispatch threw:', err.message);
    }
  },

  // ── HTTP handler ──────────────────────────────────────────────────────────
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;
    const method = request.method;

    // ── Health (public, no auth) ─────────────────────────────────────────────
    if ((p === '/' || p === '/health') && method === 'GET') {
      return jsonResp({
        agent: env.AGENT_NAME || 'cert-prep-curator',
        version: env.AGENT_VERSION || '2.0.0',
        status: 'healthy',
        repository: env.GITHUB_REPO || 'unknown',
        timestamp: new Date().toISOString()
      });
    }

    // ── Public release-gate reads ────────────────────────────────────────────
    // GET /r2/release-gate           — list all exam gate records
    // GET /r2/release-gate/:examId   — get one exam's gate record
    if (method === 'GET' && p.startsWith('/r2/release-gate')) {
      if (!env.CERT_PREP_STATE) {
        return jsonResp({ error: 'R2 binding not configured' }, 503);
      }
      const parts = p.split('/');          // ['', 'r2', 'release-gate', examId?]
      const examId = parts[3] || null;
      return getReleaseGate(env.CERT_PREP_STATE, examId);
    }

    // ── All write + audit read paths require HMAC auth ───────────────────────
    if (!env.STATUS_HMAC_SECRET) {
      return jsonResp({ error: 'Worker not configured: STATUS_HMAC_SECRET missing' }, 503);
    }

    const hmacResult = await verifyHmac(request, env.STATUS_HMAC_SECRET);
    if (!hmacResult.ok) {
      return jsonResp({ error: `Unauthorized: ${hmacResult.reason}` }, 401);
    }

    if (!env.CERT_PREP_STATE) {
      return jsonResp({ error: 'R2 binding not configured' }, 503);
    }

    // PUT /r2/release-gate/:examId
    if (method === 'PUT' && p.startsWith('/r2/release-gate/')) {
      const examId = p.split('/')[3];
      let body;
      try { body = await request.json(); } catch { body = {}; }
      return putReleaseGate(env.CERT_PREP_STATE, examId, body);
    }

    // GET /r2/audit/:examId
    if (method === 'GET' && p.startsWith('/r2/audit/')) {
      const examId = p.split('/')[3];
      return getAuditSummary(env.CERT_PREP_STATE, examId);
    }

    // PUT /r2/audit/:examId
    if (method === 'PUT' && p.startsWith('/r2/audit/')) {
      const examId = p.split('/')[3];
      let body;
      try { body = await request.json(); } catch { body = {}; }
      return putAuditSummary(env.CERT_PREP_STATE, examId, body);
    }

    // Manual curation trigger (HMAC-authenticated)
    if (method === 'POST' && p === '/api/v1/curate') {
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const category = body.category || 'all';

      if (!env.GITHUB_DISPATCH_TOKEN || !env.GITHUB_REPO) {
        return jsonResp({ error: 'GITHUB_DISPATCH_TOKEN or GITHUB_REPO not configured' }, 503);
      }

      const res = await fetch(
        `https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
            'User-Agent': 'Cloudflare-Worker-Cert-Prep-Curator/2.0',
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'certification-curation',
            client_payload: { category, source: 'manual-trigger', ...body }
          })
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        return jsonResp({ error: `GitHub dispatch failed: ${errText}` }, 502);
      }

      return jsonResp({
        ok: true,
        action: 'certification-curation dispatched',
        category,
        timestamp: new Date().toISOString()
      });
    }

    return jsonResp({ error: 'Endpoint not found', path: p }, 404);
  }
};
