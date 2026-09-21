#!/usr/bin/env node
/**
 * Safe Quarantined Crawler Ingestion Utility
 * Fetches external raw study material and isolates it in .data/exams/<track>/quarantine/
 * Enforces zero-execution security: stores strictly as inert plain text with SHA-256 audit.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export async function ingestToQuarantine({ exam = 'cca-f', sourceUrl, rawContent, topicLabel = 'external-intel' }) {
  if (!rawContent || typeof rawContent !== 'string') {
    throw new Error('rawContent must be a non-empty string');
  }

  const hash = crypto.createHash('sha256').update(rawContent).digest('hex');
  const shortHash = hash.slice(0, 10);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const batchFolder = `${timestamp}_${topicLabel.replace(/[^a-zA-Z0-9_-]/g, '_')}_${shortHash}`;
  const targetDir = path.resolve(process.cwd(), '.data/exams', exam, 'quarantine', batchFolder);

  fs.mkdirSync(targetDir, { recursive: true });

  // Scan for potentially executable patterns (code blocks, script tags, eval, sh/bash)
  const executablePatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /```(?:bash|sh|zsh|python|javascript|js|ts|node)/gi,
    /\b(?:eval|exec|spawn|fork)\s*\(/g,
    /\b(?:curl|wget)\s+https?:\/\//g
  ];

  let detectedExecutableBlocks = false;
  const detectedMarkers = [];

  for (const pattern of executablePatterns) {
    const matches = rawContent.match(pattern);
    if (matches && matches.length > 0) {
      detectedExecutableBlocks = true;
      detectedMarkers.push(`${pattern.source} (${matches.length} matches)`);
    }
  }

  // 1. Write inert raw file (permission 0o600 - read/write only, NO execute)
  const rawFilePath = path.join(targetDir, 'raw_payload.raw');
  fs.writeFileSync(rawFilePath, rawContent, { encoding: 'utf8', mode: 0o600 });

  // 2. Write metadata
  const metadata = {
    quarantineId: `quar-${exam}-${shortHash}`,
    examTrack: exam,
    sourceUrl: sourceUrl || 'local_import',
    fetchedAt: new Date().toISOString(),
    sha256: hash,
    byteSize: Buffer.byteLength(rawContent, 'utf8'),
    containsExecutableBlocks: detectedExecutableBlocks,
    detectedMarkers,
    status: 'quarantined_inert',
    note: 'Inert storage. Raw text must not be executed, eval()ed, or dynamically imported.'
  };

  const metadataPath = path.join(targetDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');

  console.log(`[QUARANTINE] Successfully isolated payload into ${targetDir}`);
  console.log(`[SECURITY] SHA-256: ${hash}`);
  console.log(`[SECURITY] Executable code blocks detected: ${detectedExecutableBlocks ? 'YES (inert quarantined)' : 'NO'}`);

  return { targetDir, metadata };
}

// CLI usage support
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  if (args.length > 0 && args[0] === '--test') {
    const testSample = '# Sample Certification Notes\n```python\nprint("malicious or test script")\n```\nWhat is D1?';
    ingestToQuarantine({ exam: 'cca-f', sourceUrl: 'https://test.local/intel', rawContent: testSample, topicLabel: 'test-crawler' });
  }
}
