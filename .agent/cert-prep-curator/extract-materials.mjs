import fs from 'fs';
import path from 'path';
import { checkExamRelevance } from './relevance-filter.mjs';
import { isQuestionDuplicate, computeTokenSet, calculateSimilarity } from './deduplicate.mjs';

/**
 * Parses Walter claudecertificationguide 257 question bank.
 */
function parseWalterBank(filePath, examId = 'cca-f') {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split(/^###\s+Q\d+/m).slice(1);
  const questions = [];

  blocks.forEach((block, idx) => {
    if (block.includes('multiple-response')) return; // Filter to preserve 4-option single-choice standard

    const lines = block.trim().split('\n');
    let prompt = '';
    const options = [];
    let correct = '';
    let explanation = '';

    let i = 1;
    while (i < lines.length && !lines[i].includes('**A.**')) {
      const line = lines[i].replace(/^\*\*Task statement:.*?\*\*/, '').trim();
      if (line) prompt += (prompt ? ' ' : '') + line.replace(/^\*\*|\*\*$/g, '');
      i++;
    }

    while (i < lines.length) {
      const line = lines[i].replace(/^[\s\u3000]+/, '').trim();
      const optMatch = line.match(/\*\*([A-D])\.\*\*\s*(.*)/i);
      if (optMatch) {
        const isCorr = line.includes('✅') || line.includes('[CORRECT]') || line.includes('CORRECT');
        const key = optMatch[1].toUpperCase();
        const text = optMatch[2].trim();
        options.push({ id: key, text });
        if (isCorr) correct = key;
      } else if (line.startsWith('<details><summary><b>Answer</b>:')) {
        const m = line.match(/<b>Answer<\/b>:\s*([A-D])/i);
        if (m) correct = m[1].toUpperCase();
      } else if (line.startsWith('**Rationale:**') || line.startsWith('- **A**') || line.startsWith('- **B**')) {
        explanation += (explanation ? '\n' : '') + line;
      }
      i++;
    }

    if (options.length === 4 && correct && prompt) {
      const relevance = checkExamRelevance(prompt + ' ' + explanation);
      questions.push({
        id: `${examId}-walter-${String(idx + 1).padStart(3, '0')}`,
        exam: examId,
        status: 'ready',
        reviewStatus: 'approved',
        sourceId: 'walter-257',
        contentVersion: 1,
        domain: relevance.domain || 'D1 Agentic Architecture & Orchestration',
        difficulty: 'intermediate',
        prompt,
        options,
        correct,
        explanation: explanation || `Option ${correct} is correct per architectural guidelines.`,
        mockEligible: true
      });
    }
  });

  return questions;
}

/**
 * Parses claudecertifiedarchitects 400 question bank.
 */
function parseCCABank(filePath, examId = 'cca-f') {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split(/^###\s+Q\d+/m).slice(1);
  const questions = [];

  blocks.forEach((block, idx) => {
    if (block.includes('Multiple response')) return;

    const lines = block.trim().split('\n');
    let prompt = '';
    const options = [];
    let correct = '';
    let explanation = '';

    let i = 0;
    while (i < lines.length && !lines[i].includes('**A.**') && !lines[i].includes('**B.**')) {
      const line = lines[i].trim();
      if (line && !line.startsWith('###')) prompt += (prompt ? ' ' : '') + line.replace(/^\*\*|\*\*$/g, '');
      i++;
    }

    while (i < lines.length) {
      const line = lines[i].replace(/^[\s\u3000]+/, '').trim();
      const optMatch = line.match(/^([✅\s]*)\*\*([A-D])\.\*\*\s*(.*)/i);
      if (optMatch) {
        const isCorr = line.includes('✅');
        const key = optMatch[2].toUpperCase();
        const text = optMatch[3].trim();
        options.push({ id: key, text });
        if (isCorr) correct = key;
      } else if (line.startsWith('<details><summary><b>Answer</b>:')) {
        const m = line.match(/<b>Answer<\/b>:\s*([A-D])/i);
        if (m) correct = m[1].toUpperCase();
      } else if (!line.startsWith('<') && !line.startsWith('---') && line.length > 5) {
        explanation += (explanation ? ' ' : '') + line;
      }
      i++;
    }

    if (options.length === 4 && correct && prompt) {
      const relevance = checkExamRelevance(prompt + ' ' + explanation);
      questions.push({
        id: `${examId}-cca-${String(idx + 1).padStart(3, '0')}`,
        exam: examId,
        status: 'ready',
        reviewStatus: 'approved',
        sourceId: 'cca-400',
        contentVersion: 1,
        domain: relevance.domain || 'D1 Agentic Architecture & Orchestration',
        difficulty: 'intermediate',
        prompt,
        options,
        correct,
        explanation: explanation || `Option ${correct} is the correct architectural solution.`,
        mockEligible: true
      });
    }
  });

  return questions;
}

/**
 * Parses Paul Larionov situation question bank.
 */
function parseLarionovBank(filePath, examId = 'cca-f') {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split(/^##\s+Question\s+\d+/m).slice(1);
  const questions = [];

  blocks.forEach((block, idx) => {
    const lines = block.trim().split('\n');
    let prompt = '';
    const options = [];
    let correct = '';
    let explanation = '';

    let i = 0;
    while (i < lines.length && !lines[i].trim().startsWith('- A)')) {
      const line = lines[i].trim();
      if (line) prompt += (prompt ? ' ' : '') + line.replace(/^\*\*|\*\*$/g, '');
      i++;
    }

    while (i < lines.length) {
      const line = lines[i].trim();
      const optMatch = line.match(/^- ([A-D])\)\s*(.*)/i);
      if (optMatch) {
        const key = optMatch[1].toUpperCase();
        let text = optMatch[2].trim();
        const isCorr = text.includes('[CORRECT]');
        text = text.replace(/\[CORRECT\]/g, '').trim();
        options.push({ id: key, text });
        if (isCorr) correct = key;
      } else if (line.startsWith('**Why ') || line.startsWith('Why ')) {
        explanation += (explanation ? '\n' : '') + line;
      }
      i++;
    }

    if (options.length === 4 && correct && prompt) {
      const relevance = checkExamRelevance(prompt + ' ' + explanation);
      questions.push({
        id: `${examId}-larionov-${String(idx + 1).padStart(3, '0')}`,
        exam: examId,
        status: 'ready',
        reviewStatus: 'approved',
        sourceId: 'larionov-88',
        contentVersion: 1,
        domain: relevance.domain || 'D1 Agentic Architecture & Orchestration',
        difficulty: 'intermediate',
        prompt,
        options,
        correct,
        explanation: explanation || `Option ${correct} is correct.`,
        mockEligible: true
      });
    }
  });

  return questions;
}

/**
 * Parses Amey Thakur JSON question bank.
 */
function parseAmeyJsonBank(filePath, examId = 'cca-f') {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const questions = [];

  (data.questions || []).forEach((q, idx) => {
    if (q.exam !== 'architect-foundations') return;
    if (!q.options || !q.answer) return;

    const optKeys = Object.keys(q.options);
    if (optKeys.length !== 4) return;

    const options = [
      { id: 'A', text: q.options.A || '' },
      { id: 'B', text: q.options.B || '' },
      { id: 'C', text: q.options.C || '' },
      { id: 'D', text: q.options.D || '' }
    ];

    const relevance = checkExamRelevance(q.question + ' ' + (q.rationale || ''));
    questions.push({
      id: `${examId}-ameyjson-${String(idx + 1).padStart(3, '0')}`,
      exam: examId,
      status: 'ready',
      reviewStatus: 'approved',
      sourceId: 'amey-thakur-json',
      contentVersion: 1,
      domain: relevance.domain || 'D1 Agentic Architecture & Orchestration',
      difficulty: 'intermediate',
      prompt: q.question,
      options,
      correct: q.answer.toUpperCase(),
      explanation: q.rationale || `Option ${q.answer} is correct.`,
      mockEligible: true
    });
  });

  return questions;
}

/**
 * Executes full multi-source extraction, deduplication, and staging.
 */
export function extractAndMergeAllMaterials(rootDir, examId = 'cca-f') {
  console.log(`[Materials Extractor] Starting comprehensive multi-source extraction for ${examId}...`);
  const rawPracticeDir = path.join(rootDir, `.data/exams/${examId}/raw/practice-questions`);
  const dbPath = path.join(rootDir, `data/questions/${examId}/questions.json`);
  const staticPath = path.join(rootDir, `static/data/questions/${examId}/questions.json`);
  const examsTomlPath = path.join(rootDir, 'data/exams.toml');
  const wranglerPath = path.join(rootDir, 'cloudflare/cert-prep-curator-worker/wrangler.toml');

  // Start with clean pool
  let pool = [];
  if (fs.existsSync(dbPath)) {
    pool = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  const initialCount = pool.length;
  console.log(`[Materials Extractor] Initial unique questions in database: ${initialCount}`);

  const candidateBanks = [
    { name: 'Walter 257 Bank', questions: parseWalterBank(path.join(rawPracticeDir, 'claudecertificationguide-257-question-bank.md'), examId) },
    { name: 'CCA 400 Bank', questions: parseCCABank(path.join(rawPracticeDir, 'claudecertifiedarchitects-400-question-bank.md'), examId) },
    { name: 'Amey Thakur JSON', questions: parseAmeyJsonBank(path.join(rawPracticeDir, 'amey-thakur-question-bank.json'), examId) },
    { name: 'Paul Larionov Bank', questions: parseLarionovBank(path.join(rawPracticeDir, 'paullarionov-guide-questions.md'), examId) }
  ];

  let totalCandidates = 0;
  let addedCount = 0;
  let duplicatesSkipped = 0;
  let enrichedCount = 0;

  for (const bank of candidateBanks) {
    console.log(`[Materials Extractor] Processing ${bank.name}: ${bank.questions.length} candidates...`);
    totalCandidates += bank.questions.length;

    for (const candidate of bank.questions) {
      const candidateTokens = computeTokenSet(candidate.prompt);
      let isDup = false;
      let dupIndex = -1;

      for (let j = 0; j < pool.length; j++) {
        const existingTokens = computeTokenSet(pool[j].prompt);
        const sim = calculateSimilarity(candidateTokens, existingTokens);

        if (sim >= 0.85) {
          isDup = true;
          dupIndex = j;
          break;
        }
      }

      if (!isDup) {
        pool.push(candidate);
        addedCount++;
      } else {
        duplicatesSkipped++;
        const existing = pool[dupIndex];
        if ((candidate.explanation || '').length > (existing.explanation || '').length) {
          existing.explanation = candidate.explanation;
          enrichedCount++;
        }
      }
    }
  }

  console.log(`\n--- Extraction & Deduplication Summary ---`);
  console.log(`Total Candidates Analyzed: ${totalCandidates}`);
  console.log(`Unique Questions Added:    ${addedCount}`);
  console.log(`Duplicates Skipped:        ${duplicatesSkipped}`);
  console.log(`Explanations Enriched:     ${enrichedCount}`);
  console.log(`Final Database Total:      ${pool.length}`);

  // Save to database
  const formatted = JSON.stringify(pool, null, 2);
  fs.writeFileSync(dbPath, formatted);
  if (fs.existsSync(path.dirname(staticPath))) {
    fs.writeFileSync(staticPath, formatted);
  }

  // Update exams.toml question count
  if (fs.existsSync(examsTomlPath)) {
    let tomlContent = fs.readFileSync(examsTomlPath, 'utf8');
    const examRegex = new RegExp(`(\\[\\[exams\\]\\][\\s\\S]*?id = "${examId}"[\\s\\S]*?questions = )\\d+`);
    tomlContent = tomlContent.replace(examRegex, `$1${pool.length}`);
    fs.writeFileSync(examsTomlPath, tomlContent);
  }

  // Update wrangler.toml question count
  if (fs.existsSync(wranglerPath)) {
    let wContent = fs.readFileSync(wranglerPath, 'utf8');
    wContent = wContent.replace(/TOTAL_QUESTIONS = \d+/, `TOTAL_QUESTIONS = ${pool.length}`);
    fs.writeFileSync(wranglerPath, wContent);
  }

  return { initialCount, addedCount, duplicatesSkipped, enrichedCount, finalCount: pool.length };
}

if (process.argv[1]?.endsWith('extract-materials.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  extractAndMergeAllMaterials(rootDir, examId);
}
