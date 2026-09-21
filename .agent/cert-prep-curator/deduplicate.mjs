import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Normalizes text for lexical & token comparison.
 */
export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[`*_~#>[\]()]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates an alphanumeric word token set.
 */
export function computeTokenSet(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter(w => w.length > 2);
  return new Set(words);
}

/**
 * Computes Jaccard similarity between two token sets.
 * J(A, B) = |A ∩ B| / |A ∪ B|
 */
export function calculateSimilarity(tokensA, tokensB) {
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }
  const unionCount = tokensA.size + tokensB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Checks if a candidate question is duplicate against an existing question pool.
 */
export function isQuestionDuplicate(candidatePrompt, existingQuestions, threshold = 0.85) {
  const candidateTokens = computeTokenSet(candidatePrompt);
  if (candidateTokens.size === 0) return { isDuplicate: false };

  for (const q of existingQuestions) {
    const existingTokens = computeTokenSet(q.prompt || q.question || '');
    const sim = calculateSimilarity(candidateTokens, existingTokens);
    if (sim >= threshold) {
      return {
        isDuplicate: true,
        matchedId: q.id,
        similarity: sim
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Checks if a document or file is duplicate via SHA-256 or slug match.
 */
export function isDocumentDuplicate(content, slug, manifest = {}) {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  if (manifest[slug] && manifest[slug].hash === hash) {
    return { isDuplicate: true, reason: 'identical-hash', hash };
  }
  return { isDuplicate: false, hash };
}

/**
 * Sweeps and deduplicates an existing question database.
 */
export function deduplicateExistingDatabase(rootDir, examId = 'cca-f') {
  const dbPath = path.join(rootDir, `data/questions/${examId}/questions.json`);
  const staticPath = path.join(rootDir, `static/data/questions/${examId}/questions.json`);
  const examsTomlPath = path.join(rootDir, 'data/exams.toml');

  if (!fs.existsSync(dbPath)) {
    console.log(`[Dedup Engine] Database not found at ${dbPath}`);
    return { beforeCount: 0, afterCount: 0, duplicatesRemoved: 0 };
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  const questions = JSON.parse(raw);
  const beforeCount = questions.length;
  console.log(`[Dedup Engine] Scanning ${beforeCount} questions in ${examId}...`);

  const uniqueQuestions = [];
  const removed = [];

  for (let i = 0; i < questions.length; i++) {
    const candidate = questions[i];
    const candidateTokens = computeTokenSet(candidate.prompt || '');
    let isDup = false;
    let dupWithIndex = -1;

    for (let j = 0; j < uniqueQuestions.length; j++) {
      const existingTokens = computeTokenSet(uniqueQuestions[j].prompt || '');
      const sim = calculateSimilarity(candidateTokens, existingTokens);

      if (sim >= 0.85) {
        isDup = true;
        dupWithIndex = j;
        break;
      }
    }

    if (!isDup) {
      uniqueQuestions.push(candidate);
    } else {
      // Conflict resolution: Keep whichever item has the richer explanation
      const existing = uniqueQuestions[dupWithIndex];
      const existingExpLen = (existing.explanation || '').length;
      const candidateExpLen = (candidate.explanation || '').length;

      if (candidateExpLen > existingExpLen) {
        // Replace with richer explanation, preserving initial ID
        const preservedId = existing.id;
        uniqueQuestions[dupWithIndex] = { ...candidate, id: preservedId };
      }
      removed.push({ duplicateId: candidate.id, retainedId: existing.id });
    }
  }

  const afterCount = uniqueQuestions.length;
  const duplicatesRemoved = beforeCount - afterCount;

  if (duplicatesRemoved > 0) {
    const formatted = JSON.stringify(uniqueQuestions, null, 2);
    fs.writeFileSync(dbPath, formatted);
    if (fs.existsSync(path.dirname(staticPath))) {
      fs.writeFileSync(staticPath, formatted);
    }
    console.log(`[Dedup Engine] Removed ${duplicatesRemoved} duplicate(s). Saved ${afterCount} clean questions.`);

    // Update exams.toml question count
    if (fs.existsSync(examsTomlPath)) {
      let tomlContent = fs.readFileSync(examsTomlPath, 'utf8');
      const examRegex = new RegExp(`(\\[\\[exams\\]\\][\\s\\S]*?id = "${examId}"[\\s\\S]*?questions = )\\d+`);
      tomlContent = tomlContent.replace(examRegex, `$1${afterCount}`);
      fs.writeFileSync(examsTomlPath, tomlContent);
    }
  } else {
    console.log(`[Dedup Engine] Zero duplicates found. Database is 100% clean (${afterCount} items).`);
  }

  return { beforeCount, afterCount, duplicatesRemoved, removed };
}

if (process.argv[1]?.endsWith('deduplicate.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  deduplicateExistingDatabase(rootDir, examId);
}
