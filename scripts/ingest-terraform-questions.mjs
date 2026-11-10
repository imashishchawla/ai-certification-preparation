#!/usr/bin/env node
/**
 * Ingest Terraform Associate (004) questions from approved GitHub source:
 * https://github.com/chojuninengu/terraform-associate-practice-exam
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const scratchDir = path.join(process.env.HOME, '.gemini/antigravity-cli/brain/4fd484bc-dd55-4302-8d90-5b102c28bc7e/scratch');
const targetFile = path.join(rootDir, 'data/questions/terraform-associate/questions.json');

function sha256(content) {
  return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');
}

function mapDomain(rawDomain, prompt) {
  const p = prompt.toLowerCase();
  if (rawDomain.includes('Objective 1')) return 'D1 Infrastructure as Code (IaC) with Terraform';
  if (rawDomain.includes('Objective 2')) {
    if (p.includes('provider') || p.includes('state')) return 'D2 Terraform fundamentals';
    return 'D1 Infrastructure as Code (IaC) with Terraform';
  }
  if (rawDomain.includes('Objective 3')) {
    if (p.includes('provider') || p.includes('lock file') || p.includes('version')) return 'D2 Terraform fundamentals';
    if (p.includes('init') || p.includes('validate') || p.includes('plan') || p.includes('apply') || p.includes('fmt')) return 'D3 Core Terraform workflow';
    return 'D2 Terraform fundamentals';
  }
  if (rawDomain.includes('Objective 4')) {
    if (p.includes('import') || p.includes('state') || p.includes('log') || p.includes('tf_log')) return 'D7 Maintain infrastructure with Terraform';
    return 'D3 Core Terraform workflow';
  }
  if (rawDomain.includes('Objective 5')) return 'D5 Terraform modules';
  if (rawDomain.includes('Objective 6')) return 'D3 Core Terraform workflow';
  if (rawDomain.includes('Objective 7')) return 'D6 Terraform state management';
  if (rawDomain.includes('Objective 8')) return 'D4 Terraform configuration';
  if (rawDomain.includes('Objective 9')) return 'D8 HCP Terraform';
  return 'D3 Core Terraform workflow';
}

function formatPointwiseExplanation(correctLetter, perOptionLines, detailedText, referenceUrl) {
  const points = [];

  points.push(`**Key Concept & Correct Answer**:`);
  const correctOptionText = perOptionLines.find(l => l.startsWith(`**${correctLetter})`));
  if (correctOptionText) {
    const cleanText = correctOptionText.replace(/\s*✅\s*/, '').replace(/^\*\*[A-Z]\)\s*[^*]+\*\*\s*/, '').trim();
    points.push(`- **Option ${correctLetter} is correct**: ${cleanText || 'This matches standard Terraform architecture and official CLI behavior.'}`);
  } else {
    points.push(`- **Option ${correctLetter} is correct**.`);
  }

  // Distractor analysis
  const distractorPoints = [];
  for (const optLine of perOptionLines) {
    const match = optLine.match(/^\*\*([A-Z])\)\s*([^*]+)\*\*\s*(.*)/s);
    if (match) {
      const letter = match[1];
      const title = match[2].trim();
      const explanation = match[3].replace(/\s*✅\s*/, '').trim();
      if (letter !== correctLetter) {
        distractorPoints.push(`- **Option ${letter} is incorrect**: ${explanation}`);
      }
    }
  }

  if (distractorPoints.length > 0) {
    points.push(`\n**Analysis of Distractors**:`);
    points.push(...distractorPoints);
  }

  if (detailedText && detailedText.trim().length > 10) {
    points.push(`\n**Deep Dive & Exam Context**:`);
    points.push(detailedText.trim());
  }

  if (referenceUrl && referenceUrl.trim().length > 5) {
    points.push(`\n**Official Documentation Citation**: ${referenceUrl.trim()}`);
  }

  return points.join('\n');
}

function parseMarkdownExam(filename, examPrefix) {
  const filePath = path.join(scratchDir, filename);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const fileHash = sha256(rawContent);

  const rawBlocks = rawContent.split(/^## Question \d+/m).slice(1);
  const parsed = [];

  rawBlocks.forEach((block, idx) => {
    const qNum = String(idx + 1).padStart(3, '0');
    const id = `terraform-associate-chojuninengu-${examPrefix}-${qNum}`;

    // Extract Domain
    const domainMatch = block.match(/\*\*Domain:\*\*\s*(.+)/);
    const rawDomain = domainMatch ? domainMatch[1].trim() : 'Objective 3 - Understand Terraform Basics';

    // Extract Question prompt
    const qMatch = block.match(/### Question\s+([\s\S]*?)(?=### Answer Options)/);
    if (!qMatch) return;
    const prompt = qMatch[1].trim();

    // Extract Answer Options
    const optMatch = block.match(/### Answer Options\s+([\s\S]*?)(?=\*\*Correct Answer:)/);
    if (!optMatch) return;
    const rawOptions = optMatch[1].trim();

    const options = [];
    const optionLines = rawOptions.split(/\n(?=[A-E]\)\s*)/);
    optionLines.forEach(line => {
      const lineMatch = line.trim().match(/^([A-E])\)\s*([\s\S]+)/);
      if (lineMatch) {
        options.push({
          id: lineMatch[1],
          text: lineMatch[2].trim()
        });
      }
    });

    if (options.length < 2) return;

    // Extract Correct Answer
    const correctMatch = block.match(/\*\*Correct Answer:\s*([A-E,\s]+)\*\*/);
    if (!correctMatch) return;
    const rawCorrect = correctMatch[1].trim();
    let correct = rawCorrect;
    let questionType = 'single_choice';

    if (options.length === 2 && options.some(o => o.text.toLowerCase() === 'true')) {
      questionType = 'true_false';
    } else if (rawCorrect.includes(',')) {
      correct = rawCorrect.split(',').map(s => s.trim());
      questionType = 'multiple_choice';
    }

    // Extract Explanation
    const explMatch = block.match(/### Explanation\s+([\s\S]*?)(?=### Detailed Explanation|---|$)/);
    const rawExpl = explMatch ? explMatch[1].trim() : '';
    const perOptionLines = rawExpl.split(/\n\n(?=\*\*[A-E]\))/);

    // Extract Detailed Explanation & Reference
    const detMatch = block.match(/### Detailed Explanation\s+([\s\S]*?)(?=\*\*Reference:\*\*|---|$)/);
    let detailedText = detMatch ? detMatch[1].trim() : '';

    const refMatch = block.match(/\*\*Reference:\*\*\s*(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/);
    const referenceUrl = refMatch ? refMatch[1].trim() : '';

    const domain = mapDomain(rawDomain, prompt);
    const explanation = formatPointwiseExplanation(
      Array.isArray(correct) ? correct[0] : correct,
      perOptionLines,
      detailedText,
      referenceUrl
    );

    parsed.push({
      id,
      exam: 'terraform-associate',
      examVersion: '004',
      domain,
      prompt,
      options,
      correct,
      questionType,
      explanation,
      sourceId: 'chojuninengu-practice-exam',
      sourceLocator: `processed-exams/${filename.replace('.md', '')}.md#question-${idx + 1}`,
      sourceHash: fileHash,
      status: 'released',
      reviewStatus: 'approved',
      mockEligible: true,
      difficulty: 'intermediate'
    });
  });

  return parsed;
}

// 1. Read existing official sample questions
const existing = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
// Set existing official questions to released & mockEligible: true
const officialReleased = existing.map(q => ({
  ...q,
  status: 'released',
  mockEligible: true
}));

// 2. Parse Exam 1 and Exam 2
const exam1Questions = parseMarkdownExam('exam-1.md', 'e1');
const exam2Questions = parseMarkdownExam('exam-2.md', 'e2');

console.log(`Parsed ${exam1Questions.length} questions from Exam 1`);
console.log(`Parsed ${exam2Questions.length} questions from Exam 2`);

const combined = [...officialReleased, ...exam1Questions, ...exam2Questions];
console.log(`Total questions for Terraform Associate: ${combined.length}`);

fs.writeFileSync(targetFile, JSON.stringify(combined, null, 2) + '\n');
console.log(`Successfully written to ${targetFile}`);
