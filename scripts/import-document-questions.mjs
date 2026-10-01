#!/usr/bin/env node
// Import answer-backed questions from locally cached documents. Dry run by default.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { computeTokenSet, calculateSimilarity } from '../.agent/cert-prep-curator/deduplicate.mjs';
import { validateQuestionBank } from './question-validation.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apply = process.argv.includes('--apply');
const ccaPath = path.join(root, 'data/questions/cca-f/questions.json');
const terraformPath = path.join(root, 'data/questions/terraform-associate/questions.json');
const cca = JSON.parse(fs.readFileSync(ccaPath, 'utf8'));
const terraform = JSON.parse(fs.readFileSync(terraformPath, 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, '.agent/cert-prep-curator/sources.json'), 'utf8'));
const sourceIds = new Set(Object.values(registry.exams).flatMap(exam => exam.sources.map(source => source.id)));
const domains = {
  d1: 'D1 Agentic Architecture & Orchestration',
  d2: 'D2 Tool Design & MCP Integration',
  d3: 'D3 Claude Code Configuration & Workflows',
  d4: 'D4 Prompt Engineering & Structured Output',
  d5: 'D5 Context Management & Reliability',
};

function sourceInfo(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), 'utf8');
  return {
    contents,
    hash: 'sha256:' + crypto.createHash('sha256').update(contents).digest('hex'),
    path: relativePath,
  };
}

function text(value) {
  return value.replace(/\*\*/g, '').replace(/\s*✔\s*$/, '').trim();
}

function ccaSampleQuestions() {
  const source = sourceInfo('.data/exams/cca-f/raw/practice-questions/claudecertifiedarchitects-5-sample-questions.md');
  const headers = [...source.contents.matchAll(/^### Q(\d+)\s+([^\n]+)$/gm)];
  if (headers.length !== 5) throw new Error('CCA sample source no longer has five question headers');
  return headers.map((header, index) => {
    const block = source.contents.slice(header.index + header[0].length, headers[index + 1]?.index ?? source.contents.indexOf('## Suggested timelines'));
    const firstOption = block.search(/^- A\.\s+/m);
    const prompt = block.slice(0, firstOption).trim();
    const options = [...block.matchAll(/^- ([A-D])\.\s+([^\n]+)$/gm)].map(match => ({ id: match[1], text: text(match[2]) }));
    const marked = [...block.matchAll(/^- ([A-D])\.\s+[^\n]*✔/gm)].map(match => match[1]);
    const why = block.match(/^\*\*Why ([A-D]):\*\*\s+([^\n]+)/m);
    if (firstOption < 0 || options.length !== 4 || marked.length !== 1 || !why || why[1] !== marked[0]) {
      throw new Error(`CCA sample Q${header[1]} has an incomplete or conflicting answer`);
    }
    const domainName = header[2].toLowerCase();
    const domain = domainName.includes('agentic') ? domains.d1 : domainName.includes('tool') ? domains.d2 : domainName.includes('code') ? domains.d3 : domainName.includes('prompt') ? domains.d4 : domains.d5;
    return {
      id: `cca-f-sample5-${String(header[1]).padStart(3, '0')}`,
      exam: 'cca-f', domain, prompt, options, correct: marked[0],
      explanation: why[2].trim(), sourceId: 'claudecertifiedarchitects',
      sourceLocator: `${source.path}#Q${header[1]}`, sourceHash: source.hash,
      status: 'pending-review', reviewStatus: 'needs-review', mockEligible: false,
    };
  });
}

function communityQuestions() {
  const base = '.data/exams/cca-f/raw/study-guides/claude-architect-community-guide/domains';
  const found = [];
  for (const file of fs.readdirSync(path.join(root, base)).filter(name => /^d[1-5]-.*\.md$/.test(name))) {
    const source = sourceInfo(`${base}/${file}`);
    const domainCode = file.slice(0, 2);
    const headers = [...source.contents.matchAll(/^\*\*Q(\d+):\*\*\s*([^\n]+)$/gm)];
    for (let index = 0; index < headers.length; index++) {
      const header = headers[index];
      const block = source.contents.slice(header.index + header[0].length, headers[index + 1]?.index ?? source.contents.length).split(/^##\s/m)[0];
      const options = [...block.matchAll(/^- ([A-D])\)\s+([^\n]+)$/gm)].map(match => ({ id: match[1], text: text(match[2]) }));
      const answer = block.match(/^\*\*Answer:\s*([A-D])\*\*\s*[—–-]\s*([^\n]+)/m);
      if (options.length !== 4 || !answer) throw new Error(`Incomplete community guide question ${file} Q${header[1]}`);
      found.push({
        id: `cca-f-community-${domainCode}-${String(header[1]).padStart(3, '0')}`,
        exam: 'cca-f', domain: domains[domainCode], prompt: header[2].trim(),
        options, correct: answer[1], explanation: answer[2].trim(),
        sourceId: 'community-architecture-guide', sourceLocator: `${source.path}#Q${header[1]}`,
        sourceHash: source.hash, status: 'pending-review', reviewStatus: 'needs-review', mockEligible: false,
      });
    }
  }
  if (found.length !== 22) throw new Error(`Expected 22 community guide questions; found ${found.length}`);
  return found;
}

function htmlLines(raw) {
  return raw
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/?(?:h[1-6]|p|li|div|pre|tr|br)\b[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, entity => ({ '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity])
    .split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function terraformSamples() {
  const source = sourceInfo('.data/exams/terraform-associate/raw/question-source/hashicorp-official-sample-questions/developer_hashicorp_com_terraform_tutorials_certification-004_associate-questions-004.txt');
  const lines = htmlLines(source.contents);
  const begin = lines.indexOf('True or false questions');
  const end = lines.indexOf('Continue studying', begin);
  if (begin < 0 || end < 0) throw new Error('HashiCorp sample article could not be isolated');
  const article = lines.slice(begin, end);
  const domainCodes = ['D4', 'D4', 'D4', 'D6', 'D3'];
  const domainNames = ['Terraform configuration', 'Terraform configuration', 'Terraform configuration', 'Terraform state management', 'Core Terraform workflow'];
  const found = [];
  let segmentStart = 0;
  for (let i = 0; i < article.length; i++) {
    if (!article[i].startsWith('⬜ ')) continue;
    const optionTexts = [];
    while (article[i]?.startsWith('⬜ ')) optionTexts.push(article[i++].slice(2).trim());
    if (article[i] !== 'Answer') throw new Error('HashiCorp sample has no answer block');
    i++;
    const correctTexts = [];
    while (/^[✅❌] (?:Correct|Incorrect): /.test(article[i] || '')) {
      if (article[i].startsWith('✅ Correct: ')) correctTexts.push(article[i].slice('✅ Correct: '.length));
      i++;
    }
    const promptLines = article.slice(segmentStart, i - optionTexts.length - 1 - optionTexts.length);
    const lastExample = promptLines.findLastIndex(line => line === 'Example' || line === 'Examples');
    const cleanedLines = (lastExample >= 0 ? promptLines.slice(lastExample + 1) : promptLines)
      .filter(line => !['Multiple choice questions', 'Multiple answer', 'True or false questions'].includes(line));
    const prompt = cleanedLines.join('\n').replace(/\s+([,.!?;:])/g, '$1').trim();
    const options = optionTexts.map((optionText, index) => ({ id: String.fromCharCode(65 + index), text: optionText }));
    const correct = correctTexts.map(answer => options.find(option => option.text === answer)?.id);
    if (!prompt || optionTexts.length < 2 || correct.some(value => !value) || correct.length < 1) {
      throw new Error(`HashiCorp sample ${found.length + 1} is incomplete`);
    }
    const number = found.length + 1;
    const questionType = number === 1 ? 'true_false' : correct.length > 1 ? 'multiple_choice' : 'single_choice';
    found.push({
      id: `terraform-associate-official-004-${String(number).padStart(3, '0')}`,
      exam: 'terraform-associate', examVersion: '004',
      domain: `${domainCodes[number - 1]} ${domainNames[number - 1]}`,
      prompt, options, correct: correct.length === 1 ? correct[0] : correct,
      questionType, sourceId: 'hashicorp-official-sample-questions',
      sourceLocator: `${source.path}#sample-${number}`, sourceHash: source.hash,
      status: 'ready', reviewStatus: 'approved', mockEligible: false,
    });
    segmentStart = i;
    i--;
  }
  if (found.length !== 5) throw new Error(`Expected five HashiCorp sample questions; found ${found.length}`);
  return found;
}

function merge(bank, candidates) {
  const added = [];
  const skipped = [];
  for (const candidate of candidates) {
    if (!sourceIds.has(candidate.sourceId)) throw new Error(`Unregistered source: ${candidate.sourceId}`);
    if (candidate.options.some(option => option.text.trim().toUpperCase() === option.id) ||
        new Set(candidate.options.map(option => option.text.toLowerCase().trim())).size !== candidate.options.length) {
      throw new Error(`Question ${candidate.id} has placeholder or repeated answer choices`);
    }
    const tokens = computeTokenSet(candidate.prompt);
    const match = bank.map(question => ({ id: question.id, similarity: calculateSimilarity(tokens, computeTokenSet(question.prompt)) }))
      .sort((a, b) => b.similarity - a.similarity)[0];
    // The short plan-mode question is the same item with slightly different wording.
    const knownParaphrase = candidate.id === 'cca-f-community-d3-002';
    if (bank.some(question => question.id === candidate.id) || match?.similarity >= 0.85 || knownParaphrase) {
      skipped.push({ id: candidate.id, match: match?.id, similarity: match?.similarity.toFixed(2), reason: knownParaphrase ? 'paraphrase' : 'duplicate' });
      continue;
    }
    bank.push(candidate);
    added.push(candidate);
  }
  return { added, skipped };
}

const ccaCandidates = [...ccaSampleQuestions(), ...communityQuestions()];
const terraformCandidates = terraformSamples();
const ccaResult = merge(cca, ccaCandidates);
const terraformResult = merge(terraform, terraformCandidates);
const errors = [...validateQuestionBank(cca, 'cca-f'), ...validateQuestionBank(terraform, 'terraform-associate')];
if (errors.length) throw new Error(`Merged bank failed validation:\n${errors.slice(0, 12).join('\n')}`);
console.log(JSON.stringify({
  mode: apply ? 'apply' : 'dry-run',
  cca_f: { candidates: ccaCandidates.length, added: ccaResult.added.length, duplicates: ccaResult.skipped, total: cca.length },
  terraform_associate: { candidates: terraformCandidates.length, added: terraformResult.added.length, duplicates: terraformResult.skipped, total: terraform.length },
}, null, 2));
if (process.argv.includes('--inspect')) {
  for (const question of [...ccaResult.added, ...terraformResult.added]) {
    console.log(`${question.id} | ${question.status} | ${question.correct} | ${question.options.length} options | ${question.prompt.replace(/\n/g, ' ').slice(0, 150)}`);
  }
}

if (apply) {
  fs.writeFileSync(ccaPath, JSON.stringify(cca, null, 2));
  fs.writeFileSync(path.join(root, 'static/data/questions/cca-f/questions.json'), JSON.stringify(cca, null, 2));
  fs.writeFileSync(terraformPath, JSON.stringify(terraform, null, 2));
  const examPath = path.join(root, 'data/exams.toml');
  const exams = fs.readFileSync(examPath, 'utf8');
  const publishedCca = cca.filter(question => question.status === 'ready' || question.status === 'released').length;
  fs.writeFileSync(examPath, exams.replace(/(id = "cca-f"[\s\S]*?questions = )\d+/, `$1${publishedCca}`));
}
