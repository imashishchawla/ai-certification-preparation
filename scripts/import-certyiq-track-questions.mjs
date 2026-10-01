#!/usr/bin/env node
// Stage complete CertyIQ questions for separately configured Claude tracks.
// Dry run by default. --apply writes only to the corresponding exam banks.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { computeTokenSet, calculateSimilarity } from '../.agent/cert-prep-curator/deduplicate.mjs';
import { validateQuestionBank } from './question-validation.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apply = process.argv.includes('--apply');
const tracks = ['ccao-f', 'ccar-p', 'ccdv-f'];
const ccaFoundation = JSON.parse(fs.readFileSync(path.join(root, 'data/questions/cca-f/questions.json'), 'utf8'));
const registryPath = path.join(root, '.agent/cert-prep-curator/sources.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const newSources = Object.fromEntries(tracks.map(id => [id, {
  id: `certyiq-${id}`, exam_ids: [id], name: `CertyIQ ${id.toUpperCase()} cached question stream`,
  url: 'https://certyiq.com', allowed_redirect_hosts: ['certyiq.com', 'dev.certyiq.com'],
  trust_tier: 'tier-2-curated', active: false, publication_mode: 'question-source',
  parser_adapter: 'certyiq-api', certyiq_stream: 'anthropic',
  certyiq_papers: [{ name: id.toUpperCase(), id, pages: 1, isCore: false }],
  refresh_frequency: 'weekly', timeout_seconds: 60, destination: `data/questions/${id}/questions.json`,
  domains: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
}]));

function cleanHtml(html) {
  return html.replace(/<(br|\/p|\/div|\/li|\/h[1-6])\b[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

function fromSource(track) {
  const sourcePath = `.data/exams/cca-f/raw/mock-exams-questions/certyiq-cca-f/${track}.json`;
  const rawText = fs.readFileSync(path.join(root, sourcePath), 'utf8');
  const raw = JSON.parse(rawText);
  const items = Array.isArray(raw) ? raw : raw.questions;
  if (!Array.isArray(items) || items.length !== 20) throw new Error(`${track}: expected 20 cached items`);
  const sourceHash = `sha256:${crypto.createHash('sha256').update(rawText).digest('hex')}`;
  return items.map((item, index) => {
    if (!item.isVerified || item.isDoubt || !item.examAns || !item.examQue) throw new Error(`${track} item ${index + 1}: not answer-verified`);
    const choiceMatches = [...item.examQue.matchAll(/<li\b[^>]*>\s*<span[^>]*data-choice-letter="([A-E])"[^>]*>\s*[A-E]\.\s*<\/span>([\s\S]*?)<\/li>/gi)];
    const options = choiceMatches.map(match => ({ id: match[1], text: cleanHtml(match[2]) }));
    const promptHtml = item.examQue.replace(/<ul\b[\s\S]*$/i, '').replace(/<li\b[\s\S]*$/i, '');
    const prompt = cleanHtml(promptHtml).replace(/\n+/g, ' ').trim();
    const answerKeys = [...new Set(item.examAns.toUpperCase().match(/[A-E]/g) || [])];
    const correct = answerKeys.length === 1 ? answerKeys[0] : answerKeys;
    const explanation = cleanHtml(item.examAnsDesc || '').replace(/\n{3,}/g, '\n\n');
    if (options.length < 4 || options.some(option => !option.text || option.text.toUpperCase() === option.id) ||
        new Set(options.map(option => option.id)).size !== options.length || !prompt || prompt.length < 15 ||
        !answerKeys.length || answerKeys.some(key => !options.some(option => option.id === key)) || !explanation) {
      throw new Error(`${track} item ${index + 1}: malformed prompt, choices, answer, or explanation`);
    }
    return {
      id: `${track}-certyiq-${String(item.question ?? index + 1).padStart(3, '0')}`,
      exam: track, domain: 'D0 Pending objective mapping', prompt, options, correct,
      questionType: answerKeys.length > 1 ? 'multiple_choice' : 'single_choice', explanation,
      sourceId: `certyiq-${track}`, sourceLocator: `${sourcePath}#question-${item.question ?? index + 1}`,
      sourceHash, status: 'pending-review', reviewStatus: 'needs-review', mockEligible: false,
    };
  });
}

function merge(bank, candidates, track) {
  const added = [];
  const skipped = [];
  for (const question of candidates) {
    const tokens = computeTokenSet(question.prompt);
    const match = [...bank, ...ccaFoundation].map(existing => ({ id: existing.id, similarity: calculateSimilarity(tokens, computeTokenSet(existing.prompt)) }))
      .sort((a, b) => b.similarity - a.similarity)[0];
    if (bank.some(existing => existing.id === question.id) || match?.similarity >= 0.85) {
      skipped.push({ id: question.id, match: match?.id, similarity: match?.similarity?.toFixed(2) });
    } else {
      bank.push(question);
      added.push(question);
    }
  }
  const errors = validateQuestionBank(bank, track);
  if (errors.length) throw new Error(`${track} bank validation failed:\n${errors.slice(0, 10).join('\n')}`);
  return { bank, added, skipped };
}

const results = {};
for (const track of tracks) {
  const file = path.join(root, `data/questions/${track}/questions.json`);
  const bank = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  results[track] = { file, ...merge(bank, fromSource(track), track) };
}
console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', tracks: Object.fromEntries(Object.entries(results).map(([id, result]) => [id, {
  imported: result.added.length, duplicates: result.skipped, total: result.bank.length,
}])) }, null, 2));

if (apply) {
  for (const [track, result] of Object.entries(results)) {
    fs.mkdirSync(path.dirname(result.file), { recursive: true });
    fs.writeFileSync(result.file, `${JSON.stringify(result.bank, null, 2)}\n`);
    registry.exams[track] ??= { sources: [] };
    registry.exams[track].sources ??= [];
    if (!registry.exams[track].sources.some(source => source.id === newSources[track].id)) registry.exams[track].sources.push(newSources[track]);
  }
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
}
