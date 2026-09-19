import fs from 'fs';
import path from 'path';

// Copy sources.md to content/sources
const content = fs.readFileSync("sources.md", 'utf8');
const fm = `---
title: "Sources & Provenance"
meta: "Complete source catalog with HTTP status verification"
tags: ["sources", "provenance"]
---
`;
fs.writeFileSync("content/sources/_index.md", fm + '\n' + content);

// Create pdfs index
const pdfs = [
  { file: "official-exam-guide-nehasharma.pdf", title: "Official Foundations Exam Guide (nehasharma mirror)", desc: "Anthropic's official 40-page v1.0 exam guide" },
  { file: "official-exam-guide-39page-webb.archive.pdf", title: "Official Foundations Exam Guide (Wayback)", desc: "Recovered from Wayback Machine (identical)" },
  { file: "official-exam-guide-ccar-professional.pdf", title: "Official Professional Exam Guide (CCAR-P)", desc: "11-page sibling guide" },
  { file: "exam-guide-amey-thakur.pdf", title: "Exam Guide v1.0 (Amey-Thakur)", desc: "39pp printout: $125 fee, validity, task statements" },
  { file: "dnacenta-guide_en.pdf", title: "dnacenta Community Study Guide", desc: "83 pages" },
  { file: "cca-f-exam-guide-claudearchitectcert.pdf", title: "12-Page CCA-F Guide", desc: "Concept checklist, two-week plan, test-day checklist" },
  { file: "guide_en-github.pdf", title: "Paullarionov Community Guide PDF", desc: "Full guide also available as markdown" },
  { file: "claude-certifications-companion.pdf", title: "All Four Certs Companion", desc: "2.1 MB printable companion" },
];

let pdfContent = `# PDFs\n\nDirect downloads:\n\n`;
for (const p of pdfs) {
  pdfContent += `- [${p.title}](pdfs/${p.file}) — ${p.desc}\n`;
}

const fm2 = `---
title: "PDFs"
meta: "9 PDFs including official exam guides and community companions"
tags: ["pdfs", "downloads"]
---
`;
fs.writeFileSync("content/pdfs/_index.md", fm2 + '\n' + pdfContent);

console.log("Created sources and pdfs");
