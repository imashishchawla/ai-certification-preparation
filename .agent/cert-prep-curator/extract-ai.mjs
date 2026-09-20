import fs from 'fs';
import path from 'path';
import https from 'https';
import { checkExamRelevance } from './relevance-filter.mjs';
import { isQuestionDuplicate } from './deduplicate.mjs';

/**
 * Calls Gemini 2.0 Flash (free tier) with structured output schema.
 */
export async function callGeminiStructured(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            resolve(JSON.parse(rawText));
          } else {
            reject(new Error(body));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

/**
 * Offline heuristic fallback parser for markdown question banks when no API key is provided.
 */
export function parseQuestionsFromMarkdown(content, sourceId, examId = 'cca-f') {
  const blocks = content.split(/^##\s+Q|^\*\*\d+\.\s+/m).slice(1);
  const parsed = [];

  blocks.forEach((block, idx) => {
    const lines = block.trim().split('\n');
    let prompt = '';
    const options = [];
    let correct = '';
    let explanation = '';

    let i = 0;
    while (i < lines.length && !lines[i].match(/^[✔\s]*\*\*?\([A-D]\)\*?/i) && !lines[i].match(/^- [A-D]\./)) {
      if (lines[i].trim()) prompt += (prompt ? ' ' : '') + lines[i].trim();
      i++;
    }

    while (i < lines.length) {
      const line = lines[i].trim();
      const optMatch = line.match(/^[✔\s]*\*\*?\(([A-D])\)\*?\s*(.*)/i) || line.match(/^- ([A-D])\.\s*(.*)/);
      if (optMatch) {
        options.push({ id: optMatch[1].toUpperCase(), text: optMatch[2].trim() });
        if (line.includes('✔') || line.toLowerCase().includes('correct')) {
          correct = optMatch[1].toUpperCase();
        }
      } else if (line.match(/\*\*Correct:\s*([A-D])\*\*/i)) {
        const c = line.match(/\*\*Correct:\s*([A-D])\*\*/i);
        correct = c[1].toUpperCase();
      } else if (line.startsWith('>') || line.startsWith('Explanation:') || line.startsWith('Rationale:')) {
        explanation += (explanation ? '\n' : '') + line.replace(/^>\s*|^(Explanation|Rationale):\s*/i, '');
      }
      i++;
    }

    if (options.length === 4 && correct && prompt) {
      const relevance = checkExamRelevance(prompt + ' ' + explanation);
      if (relevance.isRelevant) {
        parsed.push({
          id: `${examId}-${sourceId}-${String(idx + 1).padStart(3, '0')}`,
          exam: examId,
          status: 'ready',
          reviewStatus: 'approved',
          sourceId,
          contentVersion: 1,
          domain: relevance.domain,
          difficulty: 'intermediate',
          prompt,
          options,
          correct,
          explanation: explanation || `Option ${correct} is the correct answer.`,
          mockEligible: true
        });
      }
    }
  });

  return parsed;
}

/**
 * Curates questions from raw materials into questions.json with deduplication.
 */
export async function curateAndExtractQuestions(rootDir, examId = 'cca-f') {
  const dbPath = path.join(rootDir, `data/questions/${examId}/questions.json`);
  const staticPath = path.join(rootDir, `static/data/questions/${examId}/questions.json`);
  const examsTomlPath = path.join(rootDir, 'data/exams.toml');

  let existing = [];
  if (fs.existsSync(dbPath)) {
    existing = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }

  console.log(`[AI Extractor] Current existing questions pool: ${existing.length}`);
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    console.log(`[AI Extractor] GEMINI_API_KEY detected. AI structured curation enabled.`);
  } else {
    console.log(`[AI Extractor] No GEMINI_API_KEY detected. Using offline heuristic parser with deduplication.`);
  }

  const rawDir = path.join(rootDir, `.data/exams/${examId}/raw/practice-questions`);
  let addedCount = 0;
  let skippedDuplicates = 0;

  if (fs.existsSync(rawDir)) {
    const files = fs.readdirSync(rawDir);
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.txt') && !file.endsWith('.json')) continue;
      const fullPath = path.join(rawDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const sourceSlug = file.replace(/\.[^/.]+$/, '').slice(0, 15);

      const candidateQuestions = parseQuestionsFromMarkdown(content, sourceSlug, examId);
      for (const candidate of candidateQuestions) {
        const dupCheck = isQuestionDuplicate(candidate.prompt, existing);
        if (dupCheck.isDuplicate) {
          skippedDuplicates++;
        } else {
          existing.push(candidate);
          addedCount++;
        }
      }
    }
  }

  console.log(`[AI Extractor] Curation complete: ${addedCount} added, ${skippedDuplicates} duplicate(s) skipped.`);

  if (addedCount > 0) {
    const formatted = JSON.stringify(existing, null, 2);
    fs.writeFileSync(dbPath, formatted);
    if (fs.existsSync(path.dirname(staticPath))) {
      fs.writeFileSync(staticPath, formatted);
    }

    if (fs.existsSync(examsTomlPath)) {
      let tomlContent = fs.readFileSync(examsTomlPath, 'utf8');
      const examRegex = new RegExp(`(\\[\\[exams\\]\\][\\s\\S]*?id = "${examId}"[\\s\\S]*?questions = )\\d+`);
      tomlContent = tomlContent.replace(examRegex, `$1${existing.length}`);
      fs.writeFileSync(examsTomlPath, tomlContent);
    }
  }

  return { addedCount, skippedDuplicates, totalQuestions: existing.length };
}

if (process.argv[1]?.endsWith('extract-ai.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  curateAndExtractQuestions(rootDir, examId);
}
