#!/usr/bin/env node
/**
 * scripts/clean-question-prompts.mjs
 *
 * Idempotent, audited migration that removes parser metadata from 385 published CCA-F
 * question prompts and extracts section, topic, and scenarioTag into structured attributes.
 *
 * Usage:
 *   node scripts/clean-question-prompts.mjs             # Dry run (default)
 *   node scripts/clean-question-prompts.mjs --write     # Apply changes to data/questions/cca-f/questions.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const questionsFilePath = path.join(rootDir, 'data/questions/cca-f/questions.json');
const staticFilePath = path.join(rootDir, 'static/data/questions/cca-f/questions.json');

const isWrite = process.argv.includes('--write');

if (!fs.existsSync(questionsFilePath)) {
  console.error(`ERROR: File not found at ${questionsFilePath}`);
  process.exit(1);
}

const questions = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));

// Exact reviewed anchors
const numberedRegex = /^\s*\d+\s*·\s*(D[1-5])\s+([^·]+?)\s*·\s*\[(basic|intermediate|advanced|exam)\]\s*/;
const guideRegex = /^\s*(\d+\.\d+)\s+([^/]+?)\s*\/\s*([^·]+?)\s*·\s*\*\*Difficulty:\*\*\s*([^·]+?)\s*·\s*scenario:\s*(\w+)\s*/;
const scenarioRegex = /^\(Scenario:\s*([^)]+)\)\s*Situation:\*\*\s*/;

const EXPECTED_NUMBERED = 51;
const EXPECTED_GUIDE = 246;
const EXPECTED_SCENARIO = 88;
const EXPECTED_TOTAL = 385;

let matchNumbered = 0;
let matchGuide = 0;
let matchScenario = 0;
const samples = { numbered: [], guide: [], scenario: [] };

const cleanedQuestions = questions.map((q, idx) => {
  const originalPrompt = q.prompt || '';
  let updated = { ...q };

  // Pattern 1: Numbered (cca-prep-170-qu)
  if (numberedRegex.test(originalPrompt)) {
    matchNumbered++;
    const match = originalPrompt.match(numberedRegex);
    const domainCode = match[1];
    const difficultyLevel = match[3] === 'exam' ? 'intermediate' : match[3];
    const cleanPrompt = originalPrompt.replace(numberedRegex, '').trim();

    updated.prompt = cleanPrompt;
    updated.difficulty = difficultyLevel;

    if (samples.numbered.length < 2) {
      samples.numbered.push({ id: q.id, before: originalPrompt, after: cleanPrompt, diff: difficultyLevel });
    }
    return updated;
  }

  // Pattern 2: Guide (claude-architect-guide-257)
  if (guideRegex.test(originalPrompt)) {
    matchGuide++;
    const match = originalPrompt.match(guideRegex);
    const sectionNum = match[1];
    const sectionName = match[2].trim();
    const topicName = match[3].trim();
    const rawDiff = match[4].trim();
    const scenarioTag = match[5].trim();
    
    // Clean prompt removes header and prefixes "Scenario: " to form natural question prompt
    const stripped = originalPrompt.replace(guideRegex, '').trim();
    const cleanPrompt = stripped.startsWith('Scenario:') ? stripped : `Scenario: ${stripped}`;

    updated.prompt = cleanPrompt;
    updated.section = `${sectionNum} ${sectionName}`;
    updated.topic = topicName;
    updated.scenarioTag = scenarioTag;

    if (samples.guide.length < 2) {
      samples.guide.push({ id: q.id, before: originalPrompt, after: cleanPrompt, section: updated.section, topic: updated.topic });
    }
    return updated;
  }

  // Pattern 3: Scenario (situational-scenarios-88)
  if (scenarioRegex.test(originalPrompt)) {
    matchScenario++;
    const match = originalPrompt.match(scenarioRegex);
    const scenarioName = match[1].trim();
    const stripped = originalPrompt.replace(scenarioRegex, '').trim();
    const cleanPrompt = `Scenario: ${scenarioName}. Situation: ${stripped}`;

    updated.prompt = cleanPrompt;
    updated.scenarioTag = scenarioName;

    if (samples.scenario.length < 2) {
      samples.scenario.push({ id: q.id, before: originalPrompt, after: cleanPrompt, tag: scenarioName });
    }
    return updated;
  }

  return updated;
});

const totalMatched = matchNumbered + matchGuide + matchScenario;

console.log('=== QUESTION PROMPT CLEANUP AUDIT ===');
console.log(`Total questions in database: ${questions.length}`);
console.log(`Matched Numbered (cca-prep-170-qu):     ${matchNumbered} (expected: ${EXPECTED_NUMBERED})`);
console.log(`Matched Guide (claude-architect-guide):  ${matchGuide} (expected: ${EXPECTED_GUIDE})`);
console.log(`Matched Scenario (situational-scenarios): ${matchScenario} (expected: ${EXPECTED_SCENARIO})`);
console.log(`Total Prompts to Clean:                 ${totalMatched} (expected: ${EXPECTED_TOTAL})`);
console.log('');

console.log('--- Sample Before / After Transformations ---');
if (samples.numbered[0]) {
  console.log(`[Numbered #${samples.numbered[0].id}]`);
  console.log(`  BEFORE: ${samples.numbered[0].before.slice(0, 110)}...`);
  console.log(`  AFTER:  ${samples.numbered[0].after.slice(0, 110)}...`);
}
if (samples.guide[0]) {
  console.log(`[Guide #${samples.guide[0].id}]`);
  console.log(`  BEFORE: ${samples.guide[0].before.slice(0, 110)}...`);
  console.log(`  AFTER:  ${samples.guide[0].after.slice(0, 110)}...`);
  console.log(`  META:   section="${samples.guide[0].section}" topic="${samples.guide[0].topic}"`);
}
if (samples.scenario[0]) {
  console.log(`[Scenario #${samples.scenario[0].id}]`);
  console.log(`  BEFORE: ${samples.scenario[0].before.slice(0, 110)}...`);
  console.log(`  AFTER:  ${samples.scenario[0].after.slice(0, 110)}...`);
}
console.log('');

if (isWrite) {
  if (totalMatched !== EXPECTED_TOTAL && totalMatched !== 0) {
    console.error(`FATAL: Matched count (${totalMatched}) does not match expected baseline (${EXPECTED_TOTAL}). Aborting write.`);
    process.exit(1);
  }

  if (totalMatched === 0) {
    console.log('NOTICE: Zero contaminated prompts found. Database is already clean. No changes written.');
    process.exit(0);
  }

  console.log(`Applying changes to ${questionsFilePath}...`);
  fs.writeFileSync(questionsFilePath, JSON.stringify(cleanedQuestions, null, 2));

  if (fs.existsSync(staticFilePath)) {
    console.log(`Applying changes to ${staticFilePath}...`);
    fs.writeFileSync(staticFilePath, JSON.stringify(cleanedQuestions, null, 2));
  }

  console.log('✅ Successfully cleaned and saved all 385 question prompts.');
} else {
  console.log('DRY RUN COMPLETE: No files modified. Run with --write to apply changes.');
}
