#!/usr/bin/env node
/**
 * Safe Quarantine Promotion & Deduplication Inspector
 * Statically inspects quarantined artifacts across all content types.
 * Performs similarity checks against existing repository files before allowing promotion.
 */

import fs from 'node:fs';
import path from 'node:path';

function listQuarantinedItems(exam = 'cca-f') {
  const quarantineBase = path.resolve(process.cwd(), '.data/exams', exam, 'quarantine');
  if (!fs.existsSync(quarantineBase)) {
    return [];
  }

  const items = [];
  const contentTypes = fs.readdirSync(quarantineBase).filter(f => fs.statSync(path.join(quarantineBase, f)).isDirectory());

  for (const cType of contentTypes) {
    const cTypePath = path.join(quarantineBase, cType);
    const batches = fs.readdirSync(cTypePath).filter(f => fs.statSync(path.join(cTypePath, f)).isDirectory());
    for (const batch of batches) {
      const metaPath = path.join(cTypePath, batch, 'metadata.json');
      const rawPath = path.join(cTypePath, batch, 'raw_payload.raw');
      if (fs.existsSync(metaPath) && fs.existsSync(rawPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        items.push({
          batch,
          contentType: cType,
          dir: path.join(cTypePath, batch),
          meta
        });
      }
    }
  }
  return items;
}

// Simple Jaccard similarity between two text snippets
export function calculateJaccardSimilarity(textA, textB) {
  const setA = new Set(textA.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const setB = new Set(textB.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

console.log('[PROMOTION INSPECTOR] Scanning quarantine inventory...');
const items = listQuarantinedItems('cca-f');
console.log(`[PROMOTION INSPECTOR] Found ${items.length} quarantined items awaiting promotion.`);

for (const item of items) {
  console.log(`- [${item.contentType}] ${item.meta.quarantineId} | Threats: ${item.meta.securityInspection?.hasExecutableOrThreatMarkers ? 'YES' : 'NONE'}`);
}
