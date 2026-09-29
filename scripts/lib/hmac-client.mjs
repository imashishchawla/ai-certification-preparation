/**
 * HMAC-SHA256 signing helper for GitHub Actions → Cloudflare Worker proxy calls.
 *
 * The Worker validates every inbound request using a shared STATUS_HMAC_SECRET.
 * This client produces the same signature so Actions can call the R2 proxy endpoints
 * without exposing R2 credentials to GitHub.
 *
 * Usage:
 *   import { signedFetch } from './lib/hmac-client.mjs';
 *   const res = await signedFetch(workerUrl + '/r2/release-gate', {
 *     method: 'PUT',
 *     body: JSON.stringify(payload),
 *     hmacSecret: process.env.STATUS_HMAC_SECRET,
 *   });
 */

import crypto from 'crypto';

/**
 * Compute an HMAC-SHA256 hex digest.
 * @param {string} secret - raw hex or UTF-8 secret
 * @param {string} message - string to sign
 * @returns {string} hex digest
 */
export function hmacHex(secret, message) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

/**
 * Build the canonical signing string for a request.
 * Format: "<METHOD>\n<pathname>\n<timestamp_ms>"
 */
function canonical(method, url, timestampMs) {
  const pathname = new URL(url).pathname;
  return `${method.toUpperCase()}\n${pathname}\n${timestampMs}`;
}

/**
 * Fetch wrapper that injects HMAC auth headers.
 *
 * @param {string} url
 * @param {{ method?: string, body?: string, hmacSecret: string, headers?: Record<string,string> }} opts
 * @returns {Promise<Response>}
 */
export async function signedFetch(url, opts = {}) {
  const { hmacSecret, method = 'GET', body, headers = {} } = opts;
  if (!hmacSecret) throw new Error('signedFetch: hmacSecret is required');

  const timestampMs = String(Date.now());
  const sig = hmacHex(hmacSecret, canonical(method, url, timestampMs));

  const reqHeaders = {
    'Content-Type': 'application/json',
    'X-Curator-Timestamp': timestampMs,
    'X-Curator-Signature': sig,
    ...headers
  };

  return fetch(url, { method, headers: reqHeaders, body });
}
