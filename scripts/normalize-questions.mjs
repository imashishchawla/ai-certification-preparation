import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const outputFilePath = path.join(rootDir, 'data/questions/cca-f/questions.json');
const staticOutputPath = path.join(rootDir, 'static/data/questions/cca-f/questions.json');

const domainNames = {
  d1: 'D1 Agentic Architecture & Orchestration',
  d2: 'D2 Tool Design & MCP Integration',
  d3: 'D3 Claude Code Configuration & Workflows',
  d4: 'D4 Prompt Engineering & Structured Output',
  d5: 'D5 Context Management & Reliability'
};

function inferDomain(str) {
  const text = str.toLowerCase();
  if (text.includes('d1') || text.includes('agentic') || text.includes('orchestration') || text.includes('subagent') || text.includes('loop')) {
    return domainNames.d1;
  }
  if (text.includes('d2') || text.includes('tool') || text.includes('mcp') || text.includes('schema')) {
    return domainNames.d2;
  }
  if (text.includes('d3') || text.includes('claude code') || text.includes('claude.md') || text.includes('slash') || text.includes('hook') || text.includes('config')) {
    return domainNames.d3;
  }
  if (text.includes('d4') || text.includes('prompt') || text.includes('few-shot') || text.includes('structured output') || text.includes('system prompt')) {
    return domainNames.d4;
  }
  if (text.includes('d5') || text.includes('context') || text.includes('compaction') || text.includes('reliability') || text.includes('escalation')) {
    return domainNames.d5;
  }
  return domainNames.d1;
}

const questions = [];

// 1. Parse cca-prep 170 Question Bank
const ccaPrepPath = path.join(rootDir, '.data/exams/cca-f/raw/practice-questions/cca-prep-170-question-bank.md');
if (fs.existsSync(ccaPrepPath)) {
  const content = fs.readFileSync(ccaPrepPath, 'utf8');
  const blocks = content.split(/^## Q/m).slice(1);

  blocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const headerLine = lines[0] || '';
    const domain = inferDomain(headerLine);
    
    let difficulty = 'intermediate';
    if (headerLine.includes('[basic]')) difficulty = 'basic';
    if (headerLine.includes('[advanced]')) difficulty = 'advanced';
    if (headerLine.includes('[exam]')) difficulty = 'exam';

    let promptText = '';
    const options = [];
    let correct = '';
    let explanation = '';

    let i = 1;
    while (i < lines.length && !lines[i].startsWith('✔') && !lines[i].startsWith('  **(') && !lines[i].startsWith('**Correct:')) {
      if (lines[i].trim()) promptText += (promptText ? ' ' : '') + lines[i].trim();
      i++;
    }

    while (i < lines.length) {
      const line = lines[i].trim();
      const match = line.match(/^(✔\s*)?\*\*\(([A-D])\)\*\*\s*(.*)/);
      if (match) {
        const isCorrect = !!match[1] || line.startsWith('✔');
        const optId = match[2];
        const optText = match[3];
        options.push({ id: optId, text: optText });
        if (isCorrect) correct = optId;
      } else if (line.startsWith('**Correct:')) {
        const cMatch = line.match(/\*\*Correct:\s*([A-D])\*\*/);
        if (cMatch) correct = cMatch[1];
      } else if (line.startsWith('>') || line.startsWith('Refs:')) {
        explanation += (explanation ? '\n' : '') + line.replace(/^>\s*/, '');
      }
      i++;
    }

    if (options.length === 4 && correct) {
      questions.push({
        id: `cca-f-prep-${String(index + 1).padStart(3, '0')}`,
        exam: 'cca-f',
        status: 'ready',
        reviewStatus: 'approved',
        sourceId: 'cca-prep-170',
        contentVersion: 1,
        domain,
        difficulty,
        prompt: promptText || headerLine,
        options,
        correct,
        explanation: explanation || `Option ${correct} is the correct answer.`,
        mockEligible: true
      });
    }
  });
}

// 2. Parse Core 35 Practice Questions
const amey35Path = path.join(rootDir, '.data/exams/cca-f/raw/practice-questions/architect-practice-questions-bank.md');
if (fs.existsSync(amey35Path)) {
  const content = fs.readFileSync(amey35Path, 'utf8');
  const blocks = content.split(/^\*\*\d+\.\s+/m).slice(1);

  blocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const headerLine = lines[0] || '';
    const domain = inferDomain(headerLine);
    
    let promptText = headerLine;
    const options = [];
    let correct = '';
    let explanation = '';

    let i = 1;
    while (i < lines.length && !lines[i].trim().startsWith('- A.') && !lines[i].trim().startsWith('- B.')) {
      if (lines[i].trim()) promptText += (promptText ? ' ' : '') + lines[i].trim();
      i++;
    }

    while (i < lines.length) {
      const line = lines[i].trim();
      const match = line.match(/^- ([A-D])\.\s*(.*)/);
      if (match) {
        options.push({ id: match[1], text: match[2] });
      } else if (line.startsWith('<details>') || line.startsWith('**') || line.startsWith('</details>')) {
        const clean = line.replace(/<\/?details>|<summary>.*?<\/summary>/g, '').trim();
        if (clean.startsWith('**') && clean.length > 3) {
          const letterMatch = clean.match(/^\*\*([A-D])\.\*\*/);
          if (letterMatch) correct = letterMatch[1];
        }
        if (clean && !clean.startsWith('**' + correct)) {
          explanation += (explanation ? ' ' : '') + clean;
        }
      }
      i++;
    }

    if (options.length === 4 && correct) {
      questions.push({
        id: `cca-f-foundation-${String(index + 1).padStart(3, '0')}`,
        exam: 'cca-f',
        status: 'ready',
        reviewStatus: 'approved',
        sourceId: 'foundations-prep-35',
        contentVersion: 1,
        domain,
        difficulty: 'intermediate',
        prompt: promptText,
        options,
        correct,
        explanation: explanation || `Option ${correct} is correct per scenario guidelines.`,
        mockEligible: true
      });
    }
  });
}

// Ensure parent dirs exist
fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
fs.mkdirSync(path.dirname(staticOutputPath), { recursive: true });

const jsonStr = JSON.stringify(questions, null, 2);
fs.writeFileSync(outputFilePath, jsonStr);
fs.writeFileSync(staticOutputPath, jsonStr);

console.log(`Normalized ${questions.length} questions into ${outputFilePath} and ${staticOutputPath}`);
