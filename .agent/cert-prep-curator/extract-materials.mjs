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

function cleanHtml(text) {
  if (!text) return '';
  let t = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&nbsp;/g, ' ');
  t = t.replace(/<br\s*\/?>/gi, '\n');
  t = t.replace(/<\/?p[^>]*>/gi, '\n');
  t = t.replace(/<[^>]+>/g, ' ');
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/\n\s*\n+/g, '\n\n');
  return t.trim();
}

/**
 * Parses CertyIQ REST API JSON output.
 */
function parseCertyIQ(filePath, examId = 'cca-f') {
  if (!fs.existsSync(filePath)) return [];
  const rawList = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const questions = [];

  rawList.forEach((q, idx) => {
    const rawHtml = q.examQue || '';
    const ans = (q.examAns || '').trim().toUpperCase();
    const explanation = cleanHtml(q.examAnsDesc || '');

    const items = rawHtml.match(/<li[^>]*class="[^"]*multi-choice-item[^"]*"[^>]*>[\s\S]*?<\/li>/gi) || [];
    const promptMatch = rawHtml.match(/([\s\S]*?)(?:<ul|<li)/i);
    let prompt = promptMatch ? cleanHtml(promptMatch[1]) : cleanHtml(rawHtml);
    prompt = prompt.replace(/^[\s\u3000]+/, '').trim();

    const options = [];
    for (const item of items) {
      const letterMatch = item.match(/data-choice-letter="([A-D])"/i) || item.match(/>\s*([A-D])\.\s*</i);
      if (letterMatch) {
        const letter = letterMatch[1].toUpperCase();
        let optText = cleanHtml(item);
        optText = optText.replace(/^[A-D]\.\s*/i, '').trim();
        if (optText) {
          options.push({ id: letter, text: optText });
        }
      }
    }

    if (options.length === 4 && ['A', 'B', 'C', 'D'].includes(ans) && prompt) {
      const relevance = checkExamRelevance(prompt + ' ' + explanation);
      if (relevance.isRelevant || q._sourcePaper === 'claude-certified-architect') {
        const itemNumber = String(idx + 1).padStart(3, '0');
        const trackTag = q._sourcePaper && q._sourcePaper !== 'claude-certified-architect' ? `-${q._sourcePaper}` : '';
        questions.push({
          id: `${examId}-certyiq${trackTag}-${itemNumber}`,
          exam: examId,
          status: 'ready',
          reviewStatus: 'approved',
          sourceId: 'certyiq',
          contentVersion: 1,
          domain: relevance.domain || 'D1 Agentic Architecture & Orchestration',
          difficulty: 'intermediate',
          prompt,
          options,
          correct: ans,
          explanation: explanation || `Option ${ans} is correct.`,
          mockEligible: true
        });
      }
    }
  });

  return questions;
}

/**
 * Parses Szymon Paluch 60-question practice exam.
 */
function parseSzymonPaluch(filePath, examId = 'cca-f') {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const m = content.match(/window\.CCA_EXAM_DATA\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (!m) return [];

  const data = JSON.parse(m[1]);
  const questions = [];
  const domainMap = {
    1: 'D1 Agentic Architecture & Orchestration',
    2: 'D2 Tool Design & MCP Integration',
    3: 'D3 Claude Code Configuration & Workflows',
    4: 'D4 Prompt Engineering & Structured Output',
    5: 'D5 Context Management & Reliability'
  };

  (data.questions || []).forEach((q, idx) => {
    const letters = ['A', 'B', 'C', 'D'];
    if (!q.stem || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.answer !== 'number') return;
    const options = q.options.map((opt, oIdx) => ({
      id: letters[oIdx],
      text: opt.trim()
    }));
    const correct = letters[q.answer];
    const itemNumber = String(idx + 1).padStart(3, '0');

    questions.push({
      id: `${examId}-szymon-${itemNumber}`,
      exam: examId,
      status: 'ready',
      reviewStatus: 'approved',
      sourceId: 'szymon-paluch',
      contentVersion: 1,
      domain: domainMap[q.domain] || 'D1 Agentic Architecture & Orchestration',
      difficulty: 'hard',
      prompt: q.stem.trim(),
      options,
      correct,
      explanation: q.explanation || `Option ${correct} is correct.`,
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
  const rawMockDir = path.join(rootDir, `.data/exams/${examId}/raw/mock-exams-questions`);
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

  const certyiqAllPath = path.join(rawMockDir, 'certyiq/certyiq-all-tracks-api.json');
  const certyiqCorePath = path.join(rawMockDir, 'certyiq/certyiq-cca-f-api.json');
  const certyiqActivePath = fs.existsSync(certyiqAllPath) ? certyiqAllPath : certyiqCorePath;

  const candidateBanks = [
    { name: 'Walter 257 Bank', questions: parseWalterBank(path.join(rawPracticeDir, 'claudecertificationguide-257-question-bank.md'), examId) },
    { name: 'CCA 400 Bank', questions: parseCCABank(path.join(rawPracticeDir, 'claudecertifiedarchitects-400-question-bank.md'), examId) },
    { name: 'Amey Thakur JSON', questions: parseAmeyJsonBank(path.join(rawPracticeDir, 'amey-thakur-question-bank.json'), examId) },
    { name: 'Paul Larionov Bank', questions: parseLarionovBank(path.join(rawPracticeDir, 'paullarionov-guide-questions.md'), examId) },
    { name: 'Szymon Paluch 60 Exam', questions: parseSzymonPaluch(path.join(rawMockDir, 'szymon-paluch/szymonpaluch_com_claude-certified-architect-practice-exam.txt'), examId) },
    { name: 'CertyIQ API Bank', questions: parseCertyIQ(certyiqActivePath, examId) }
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
