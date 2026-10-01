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
const isJson = process.argv.includes('--json');
const log = (...args) => { if (!isJson) console.log(...args); };

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
const changes = [];
const unexpected = [];
const unmatched = { numbered: [], guide: [], scenario: [] };

const cleanedQuestions = questions.map(q => {
  const originalPrompt = q.prompt || '';
  let updated = { ...q };
  const hasNumbered = numberedRegex.test(originalPrompt);
  const hasGuide = guideRegex.test(originalPrompt);
  const hasScenario = scenarioRegex.test(originalPrompt);
  const expectedSource = hasNumbered ? 'cca-prep-170-qu' : hasGuide ? 'claude-architect-guide-257' : hasScenario ? 'situational-scenarios-88' : null;
  if (expectedSource && q.sourceId !== expectedSource) {
    unexpected.push({ id: q.id, sourceId: q.sourceId, expectedSource });
    return updated;
  }
  const group = { 'cca-prep-170-qu': 'numbered', 'claude-architect-guide-257': 'guide', 'situational-scenarios-88': 'scenario' }[q.sourceId];
  if (group && !expectedSource && unmatched[group].length < 2) unmatched[group].push(q.id);

  // Pattern 1: Numbered (cca-prep-170-qu)
  if (hasNumbered) {
    matchNumbered++;
    const match = originalPrompt.match(numberedRegex);
    const cleanPrompt = originalPrompt.replace(numberedRegex, '').trim();

    updated.prompt = cleanPrompt;
    changes.push({ id: q.id, sourceId: q.sourceId, before: originalPrompt, after: cleanPrompt });

    if (samples.numbered.length < 2) {
      samples.numbered.push({ id: q.id, before: originalPrompt, after: cleanPrompt });
    }
    return updated;
  }

  // Pattern 2: Guide (claude-architect-guide-257)
  if (hasGuide) {
    matchGuide++;
    const match = originalPrompt.match(guideRegex);
    const sectionNum = match[1];
    const sectionName = match[2].trim();
    const topicName = match[3].trim();
    const scenarioTag = match[5].trim();
    
    // Clean prompt removes header and prefixes "Scenario: " to form natural question prompt
    const stripped = originalPrompt.replace(guideRegex, '').trim();
    const cleanPrompt = stripped.startsWith('Scenario:') ? stripped : `Scenario: ${stripped}`;

    updated.prompt = cleanPrompt;
    updated.section = `${sectionNum} ${sectionName}`;
    updated.topic = topicName;
    updated.scenarioTag = scenarioTag;
    changes.push({ id: q.id, sourceId: q.sourceId, before: originalPrompt, after: cleanPrompt, section: updated.section, topic: updated.topic, scenarioTag });

    if (samples.guide.length < 2) {
      samples.guide.push({ id: q.id, before: originalPrompt, after: cleanPrompt, section: updated.section, topic: updated.topic });
    }
    return updated;
  }

  // Pattern 3: Scenario (situational-scenarios-88)
  if (hasScenario) {
    matchScenario++;
    const match = originalPrompt.match(scenarioRegex);
    const scenarioName = match[1].trim();
    const stripped = originalPrompt.replace(scenarioRegex, '').trim();
    const cleanPrompt = `Scenario: ${scenarioName}. Situation: ${stripped}`;

    updated.prompt = cleanPrompt;
    updated.scenarioTag = scenarioName;
    changes.push({ id: q.id, sourceId: q.sourceId, before: originalPrompt, after: cleanPrompt, scenarioTag: scenarioName });

    if (samples.scenario.length < 2) {
      samples.scenario.push({ id: q.id, before: originalPrompt, after: cleanPrompt, tag: scenarioName });
    }
    return updated;
  }

  return updated;
});

const totalMatched = matchNumbered + matchGuide + matchScenario;
const counts = { numbered: matchNumbered, guide: matchGuide, scenario: matchScenario, total: totalMatched };
const expected = { numbered: EXPECTED_NUMBERED, guide: EXPECTED_GUIDE, scenario: EXPECTED_SCENARIO, total: EXPECTED_TOTAL };
const alreadyClean = totalMatched === 0;
const expectedMatch = Object.keys(expected).every(key => counts[key] === expected[key]);
const manifest = { questionCount: questions.length, counts, expected, alreadyClean, unexpected, unmatchedExamples: unmatched, changes };

log('=== QUESTION PROMPT CLEANUP AUDIT ===');
log(`Total questions in database: ${questions.length}`);
log(`Matched Numbered (cca-prep-170-qu):     ${matchNumbered} (expected: ${EXPECTED_NUMBERED})`);
log(`Matched Guide (claude-architect-guide):  ${matchGuide} (expected: ${EXPECTED_GUIDE})`);
log(`Matched Scenario (situational-scenarios): ${matchScenario} (expected: ${EXPECTED_SCENARIO})`);
log(`Total Prompts to Clean:                 ${totalMatched} (expected: ${EXPECTED_TOTAL})`);
log(`Unexpected source matches: ${unexpected.length}`);
log(`Unmatched examples: ${JSON.stringify(unmatched)}`);
log('');

log('--- Sample Before / After Transformations ---');
if (samples.numbered[0]) {
  log(`[Numbered #${samples.numbered[0].id}]`);
  log(`  BEFORE: ${samples.numbered[0].before.slice(0, 110)}...`);
  log(`  AFTER:  ${samples.numbered[0].after.slice(0, 110)}...`);
}
if (samples.guide[0]) {
  log(`[Guide #${samples.guide[0].id}]`);
  log(`  BEFORE: ${samples.guide[0].before.slice(0, 110)}...`);
  log(`  AFTER:  ${samples.guide[0].after.slice(0, 110)}...`);
  log(`  META:   section="${samples.guide[0].section}" topic="${samples.guide[0].topic}"`);
}
if (samples.scenario[0]) {
  log(`[Scenario #${samples.scenario[0].id}]`);
  log(`  BEFORE: ${samples.scenario[0].before.slice(0, 110)}...`);
  log(`  AFTER:  ${samples.scenario[0].after.slice(0, 110)}...`);
}
log('');
if (isJson) console.log(JSON.stringify(manifest, null, 2));

if (isWrite) {
  if (unexpected.length || (!expectedMatch && !alreadyClean)) {
    console.error('FATAL: Source counts or source IDs differ from the reviewed baseline. Aborting write.');
    process.exit(1);
  }

  if (totalMatched === 0) {
    log('NOTICE: Zero contaminated prompts found. Database is already clean. No changes written.');
    process.exit(0);
  }

  log(`Applying changes to ${questionsFilePath}...`);
  fs.writeFileSync(questionsFilePath, JSON.stringify(cleanedQuestions, null, 2));

  if (fs.existsSync(staticFilePath)) {
    log(`Applying changes to ${staticFilePath}...`);
    fs.writeFileSync(staticFilePath, JSON.stringify(cleanedQuestions, null, 2));
  }

  log('Successfully cleaned and saved all 385 question prompts.');
} else {
  log('DRY RUN COMPLETE: No files modified. Run with --write to apply changes.');
}
