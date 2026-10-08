import fs from 'node:fs';
import path from 'node:path';

// This page contains references only. The paid questionnaire text is never
// copied into the public site by this generator.
const root = path.resolve(import.meta.dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/questions/cca-f/questions.json'), 'utf8'));
const byId = new Map(bank.map(question => [question.id, question]));
const prefix = '/ai-certification-preparation/exams/cca-f/sample-questions/';
const directLink = id => `${prefix}?question=${encodeURIComponent(id)}`;
const numbered = Array.from({ length: 40 }, (_, index) => index + 1).filter(number => number !== 21);
const overlapPairs = [
  [76, 10, 'same scenario; options reordered'],
  [81, 9, 'substantial stem overlap'],
  [117, 30, 'substantial stem overlap'],
  [131, 4, 'substantial stem overlap'],
  [133, 7, 'substantial stem overlap'],
  [159, 5, 'substantial stem overlap'],
  [165, 3, 'substantial stem overlap'],
  [173, 36, 'substantial stem overlap']
];
const pdfInternalPairs = [
  [4, 131], [10, 76], [30, 117], [36, 173], [47, 96],
  [51, 67], [63, 146], [79, 158], [123, 149],
  [125, 140], [170, 171]
];

function idFor(number) {
  return `cca-f-certyiq-${String(number).padStart(3, '0')}`;
}

function row(pdfNumber, bankNumber, relationship) {
  const id = idFor(bankNumber);
  const item = byId.get(id);
  if (!item) throw new Error(`Overlap target is absent: ${id}`);
  const linkedId = item.status === 'quarantined' ? `\`${id}\`` : `[\`${id}\`](${directLink(id)})`;
  const state = item.status === 'quarantined' ? 'Quarantined: malformed source' : 'Published';
  return `| ${pdfNumber} | ${linkedId} | ${item.section || item.domain} | ${relationship} | ${state} |`;
}

const text = `---
title: "Paid questionnaire overlap review"
description: "Question-number crosswalk for an independently supplied 175-item CCAR-F questionnaire."
date: 2026-10-08
noindex: true
sitemap:
  disable: true
---

This crosswalk compares the supplied 175-question PDF with our existing CCAR-F bank. It lists identifiers and review decisions only. It does not reproduce the PDF. The PDF is third-party practice material; its title does not establish that Anthropic authored or endorsed it.

**Access:** This page is unlisted from site navigation and marked noindex, but anyone with the URL can open and share it. It is not password protected.

## Already in the bank

PDF questions 1–40 correspond to a previously imported source set, except PDF question 21, for which this bank has no numbered copy. The PDF extraction is visibly damaged for some items, so a matching number is a source cross-reference, not proof that the PDF rendition is complete. The three malformed bank items below have been quarantined.

| PDF question | Existing bank question | Official guide task | Relationship | Bank status |
| ---: | --- | --- | --- | --- |
${numbered.map(number => row(number, number, 'same numbered source item')).join('\n')}

**PDF question 21:** no same-numbered bank record. Hold for source and answer review before import.

## Repeated or closely overlapping later items

These later PDF questions repeat or substantially overlap an earlier bank item. They should be reviewed as duplicates before any import. “Substantial overlap” is an editorial screening result, not a claim that every option is identical.

| PDF question | Existing bank question | Official guide task | Relationship | Bank status |
| ---: | --- | --- | --- | --- |
${overlapPairs.map(([pdf, bankNumber, relationship]) => row(pdf, bankNumber, relationship)).join('\n')}

## Overlaps within the PDF

These pairs have strongly similar stems. PDF questions 170 and 171 are identical in the extracted text. For the other pairs, option wording and answer order may differ, so review the full items before deciding whether to retain one or rewrite both.

| PDF question | Overlapping PDF question | Review finding |
| ---: | ---: | --- |
${pdfInternalPairs.map(([first, second]) => `| ${first} | ${second} | ${first === 170 ? 'Identical extracted stem and options' : 'Strong stem overlap; compare full options and key'} |`).join('\n')}

## Import decision

No new PDF question has been published from this review. The source has 175 answer labels but only 174 visible question-number headings in text extraction; question 11's heading is missing. Question 5's stem is blank in the PDF extraction, and several options or lines are truncated. The paid source's public redistribution terms remain unverified. New items need complete text, a checked answer, an official D1–D5 task mapping, and confirmed reuse rights before publication.

[Browse the current reviewed question bank](${prefix})
`;

const output = path.join(root, 'content/exams/cca-f/pdf-overlap-review/index.md');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, text);
console.log(`Wrote overlap crosswalk with ${numbered.length + overlapPairs.length} bank references: ${output}`);
