#!/usr/bin/env node
/**
 * verify-live-release.mjs
 *
 * Calls the Cloudflare Worker R2 proxy to confirm a release-gate record exists
 * for the given exam before the deploy workflow proceeds to publish GitHub Pages.
 *
 * Called by: .github/workflows/deploy.yml (prepare job)
 * Env vars required:
 *   CURATOR_WORKER_URL   — e.g. https://cert-prep-curator-worker.<account>.workers.dev
 *   EXAM_ID              — e.g. cca-f (optional; defaults to all active exams)
 *
 * NOTE: GET /r2/release-gate is a PUBLIC endpoint on the Worker — no HMAC needed.
 *       Only write paths (PUT) require authentication.
 *
 * Exit 0 = gate passed (or exam is onboarding — gate skipped)
 * Exit 1 = gate failed (deploy should be blocked)
 */

const WORKER_URL = process.env.CURATOR_WORKER_URL;
const EXAM_ID = process.env.EXAM_ID || null;

if (!WORKER_URL) {
  console.error('[verify-live-release] CURATOR_WORKER_URL is not set — cannot verify release gate');
  process.exit(1);
}

async function checkGate(examId) {
  const url = `${WORKER_URL}/r2/release-gate/${examId}`;
  let res;
  try {
    // Public endpoint — no HMAC auth needed for GET release-gate
    res = await fetch(url, {
      headers: { 'User-Agent': 'cert-prep-verify/2.0' }
    });
  } catch (err) {
    console.error(`[verify-live-release] Network error for ${examId}: ${err.message}`);
    return false;
  }

  if (res.status === 404) {
    // No release-gate record yet — onboarding exams are allowed through
    const body = await res.json().catch(() => ({}));
    if (body.status === 'onboarding') {
      console.log(`[verify-live-release] ${examId}: onboarding — gate skipped ✓`);
      return true;
    }
    console.error(`[verify-live-release] ${examId}: release-gate record not found (404)`);
    return false;
  }

  if (!res.ok) {
    console.error(`[verify-live-release] ${examId}: Worker returned HTTP ${res.status}`);
    return false;
  }

  const gate = await res.json();
  if (gate.passed !== true) {
    console.error(`[verify-live-release] ${examId}: release gate NOT passed — ${gate.reason || 'no reason given'}`);
    return false;
  }

  console.log(`[verify-live-release] ${examId}: release gate PASSED ✓ (${gate.releasedQuestions} questions)`);
  return true;
}

async function main() {
  if (EXAM_ID) {
    const ok = await checkGate(EXAM_ID);
    process.exit(ok ? 0 : 1);
  }

  // No specific exam — call the Worker's /r2/release-gate endpoint which returns all exams
  const url = `${WORKER_URL}/r2/release-gate`;
  let res;
  try {
    // Public endpoint — no HMAC auth needed for GET release-gate
    res = await fetch(url, {
      headers: { 'User-Agent': 'cert-prep-verify/2.0' }
    });
  } catch (err) {
    console.error(`[verify-live-release] Network error: ${err.message}`);
    process.exit(1);
  }

  if (!res.ok) {
    console.error(`[verify-live-release] Worker returned HTTP ${res.status}`);
    process.exit(1);
  }

  const data = await res.json();
  const exams = data.exams || [];
  let allPassed = true;
  for (const exam of exams) {
    if (exam.status === 'onboarding') {
      console.log(`[verify-live-release] ${exam.id}: onboarding — gate skipped ✓`);
      continue;
    }
    if (!exam.passed) {
      console.error(`[verify-live-release] ${exam.id}: release gate NOT passed`);
      allPassed = false;
    } else {
      console.log(`[verify-live-release] ${exam.id}: gate PASSED ✓`);
    }
  }
  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error('[verify-live-release] Fatal:', err);
  process.exit(1);
});
