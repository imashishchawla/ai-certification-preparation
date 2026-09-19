import fs from 'fs';
import path from 'path';

const files = [
  { file: "paullarionov-guide_en.md", title: "Paullarionov — Full Theory Guide", meta: "3400 lines · API, Agent SDK, MCP, Claude Code, hooks, sessions" },
  { file: "cca-prep-exam-scenarios.md", title: "Exam Scenarios", meta: "Six published exam scenarios" },
  { file: "cca-prep-cheatsheet.md", title: "Cheat Sheet", meta: "29-entry printable cheat sheet with code" },
  { file: "amey-thakur-architect-foundations-README.md", title: "Amey-Thakur — Domain Task Statements", meta: "Condensed from official guide (1.1-5.6)" },
  { file: "amey-thakur-cheat-sheet.md", title: "Amey-Thakur — One-Page Cheat Sheet", meta: "Condensed reference" },
  { file: "amey-thakur-notes.md", title: "Amey-Thakur — Maintainer Notes", meta: "Study notes" },
];

// Also copy the cca-prep-docs folder
const docsSrc = "study-guides/cca-prep-docs";
const docsDst = "content/study/cca-prep-docs";
if (fs.existsSync(docsSrc)) {
  fs.cpSync(docsSrc, docsDst, { recursive: true });
  // Add front matter to each doc
  for (const f of fs.readdirSync(docsDst)) {
    if (f.endsWith('.md')) {
      const content = fs.readFileSync(path.join(docsDst, f), 'utf8');
      const title = f.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const fm = `---
title: "${title}"
meta: "cca-prep deep dive"
tags: ["study", "cca-prep"]
---
`;
      fs.writeFileSync(path.join(docsDst, f), fm + '\n' + content);
    }
  }
}

// Also copy claudecertificationguide lessons
const ccgSrc = "study-guides/claudecertificationguide";
const ccgDst = "content/study/claudecertificationguide";
if (fs.existsSync(ccgSrc)) {
  fs.cpSync(ccgSrc, ccgDst, { recursive: true });
  // Add front matter to each file
  function processDir(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        processDir(full);
      } else if (f.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf8');
        const title = f.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const fm = `---
title: "${title}"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---
`;
        fs.writeFileSync(full, fm + '\n' + content);
      }
    }
  }
  processDir(ccgDst);
}

// Also copy dnacenta
const dnaSrc = "study-guides/dnacenta-claude-certified-architect";
const dnaDst = "content/study/dnacenta-claude-certified-architect";
if (fs.existsSync(dnaSrc)) {
  fs.cpSync(dnaSrc, dnaDst, { recursive: true });
  function processDir(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        processDir(full);
      } else if (f.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf8');
        const title = f.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const fm = `---
title: "${title}"
meta: "dnacenta community guide"
tags: ["study", "dnacenta"]
---
`;
        fs.writeFileSync(full, fm + '\n' + content);
      }
    }
  }
  processDir(dnaDst);
}

// Also copy official-docs
const odSrc = "study-guides/official-docs";
const odDst = "content/study/official-docs";
if (fs.existsSync(odSrc)) {
  fs.cpSync(odSrc, odDst, { recursive: true });
  function processDir(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        processDir(full);
      } else if (f.endsWith('.md') || f.endsWith('.txt')) {
        const content = fs.readFileSync(full, 'utf8');
        const title = f.replace(/\.(md|txt)$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const fm = `---
title: "${title}"
meta: "Official Anthropic docs"
tags: ["study", "official-docs"]
---
`;
        fs.writeFileSync(full, fm + '\n' + content);
      }
    }
  }
  processDir(odDst);
}

// Main study guide files
for (const f of files) {
  const content = fs.readFileSync(path.join("study-guides", f.file), 'utf8');
  const fm = [
    "---",
    `title: "${f.title}"`,
    f.meta ? `meta: "${f.meta}"` : "",
    'tags: ["study", "guide"]',
    "---",
    "",
    content
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join("content/study", f.file), fm);
}

console.log("Converted study files");
