/**
 * HMAC-SHA256 request verifier for the Cloudflare Worker control-plane.
 *
 * Each inbound request from GitHub Actions must carry:
 *   X-Curator-Timestamp   — Unix ms as string
 *   X-Curator-Signature   — HMAC-SHA256 hex of "<METHOD>\n<pathname>\n<timestamp_ms>"
 *
 * Requests with a timestamp older than MAX_AGE_MS are rejected to prevent replay attacks.
 */

const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Verify an incoming request's HMAC signature.
 * @param {Request} request
 * @param {string} secret - raw STATUS_HMAC_SECRET
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function verifyHmac(request, secret) {
  const timestamp = request.headers.get('X-Curator-Timestamp');
  const signature = request.headers.get('X-Curator-Signature');

  if (!timestamp || !signature) {
    return { ok: false, reason: 'missing HMAC headers' };
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_AGE_MS) {
    return { ok: false, reason: 'timestamp out of window' };
  }

  const url = new URL(request.url);
  const message = `${request.method.toUpperCase()}\n${url.pathname}\n${timestamp}`;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBytes = await crypto.subtle.sign('HMAC', keyMaterial, new TextEncoder().encode(message));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (expected !== signature) {
    return { ok: false, reason: 'signature mismatch' };
  }

  return { ok: true };
}
