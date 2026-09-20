import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { computeTokenSet, calculateSimilarity } from './deduplicate.mjs';

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function analyzeRawContent(rootDir, examId = 'cca-f') {
  console.log(`[Raw Analyzer] Analyzing raw data files for ${examId}...`);
  const rawDir = path.join(rootDir, `.data/exams/${examId}/raw`);
  const analysisDir = path.join(rootDir, `.data/exams/${examId}/analysis`);
  const reportPath = path.join(analysisDir, 'content-audit.json');

  if (!fs.existsSync(rawDir)) {
    console.error(`[Raw Analyzer] Directory not found: ${rawDir}`);
    return { totalFiles: 0, exactDuplicates: [], semanticDuplicates: [] };
  }

  fs.mkdirSync(analysisDir, { recursive: true });

  const allFiles = getAllFiles(rawDir);
  console.log(`[Raw Analyzer] Found ${allFiles.length} raw files. Computing hashes...`);

  const hashes = new Map();
  const exactDuplicates = [];
  const textFiles = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    const relativePath = path.relative(rootDir, file);

    if (hashes.has(hash)) {
      exactDuplicates.push({
        hash: hash.slice(0, 10),
        original: hashes.get(hash),
        duplicate: relativePath,
        sizeBytes: content.length
      });
    } else {
      hashes.set(hash, relativePath);
      if (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json')) {
        textFiles.push({
          path: relativePath,
          sizeBytes: content.length,
          snippet: content.toString('utf8', 0, 10000) // Sample up to 10KB for rapid comparison
        });
      }
    }
  }

  console.log(`[Raw Analyzer] Exact SHA-256 duplicate files found: ${exactDuplicates.length}`);

  // Tier 2: Semantic text similarity on text files with similar file sizes (+/- 15%)
  console.log(`[Raw Analyzer] Checking text similarity across ${textFiles.length} unique text documents...`);
  const semanticDuplicates = [];

  for (let i = 0; i < textFiles.length; i++) {
    const fileA = textFiles[i];
    const tokensA = computeTokenSet(fileA.snippet);
    if (tokensA.size < 15) continue;

    for (let j = i + 1; j < textFiles.length; j++) {
      const fileB = textFiles[j];
      // Size filter optimization: only compare files of roughly comparable size
      const ratio = fileA.sizeBytes / (fileB.sizeBytes || 1);
      if (ratio < 0.7 || ratio > 1.4) continue;

      const tokensB = computeTokenSet(fileB.snippet);
      if (tokensB.size < 15) continue;

      const sim = calculateSimilarity(tokensA, tokensB);
      if (sim >= 0.88) {
        semanticDuplicates.push({
          fileA: fileA.path,
          fileB: fileB.path,
          similarity: Math.round(sim * 100) / 100
        });
      }
    }
  }

  console.log(`[Raw Analyzer] Near-duplicate text documents found (>88% similarity): ${semanticDuplicates.length}`);

  const report = {
    examId,
    timestamp: new Date().toISOString(),
    totalRawFiles: allFiles.length,
    uniqueFiles: hashes.size,
    exactDuplicatesCount: exactDuplicates.length,
    exactDuplicates,
    semanticDuplicatesCount: semanticDuplicates.length,
    semanticDuplicates
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`[Raw Analyzer] Saved full audit report to: ${path.relative(rootDir, reportPath)}`);

  return report;
}

if (process.argv[1]?.endsWith('analyze-raw.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  analyzeRawContent(rootDir, examId);
}
