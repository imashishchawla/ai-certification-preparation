import fs from 'fs';
import path from 'path';

const files = [
  { file: "spectrumailab-all-4-exams-explained-2026.md", title: "Spectrum AI Labs — All 4 Exams Explained (2026)", meta: "Official facts, verified July 2026", source: "https://spectrumailab.com/blog/claude-certification-exams-2026" },
  { file: "claudearchitectguide-certifications-and-cost.md", title: "Claude Architect Guide — Certifications & Cost", meta: "Cost breakdown and certification overview", source: "https://claudearchitectguide.com/certifications" },
  { file: "termidy-claudeprep-home.md", title: "Termidy ClaudePrep — Home Page", meta: "Moodle LMS with 1,068 questions (login-gated)", source: "https://claude.termidy.com/" },
];

for (const f of files) {
  const content = fs.readFileSync(path.join("study-guides/articles", f.file), 'utf8');
  const fm = [
    "---",
    `title: "${f.title}"`,
    f.meta ? `meta: "${f.meta}"` : "",
    f.source ? `source_url: "${f.source}"` : "",
    'tags: ["article", "external"]',
    "---",
    "",
    content
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join("content/articles", f.file), fm);
}

console.log("Converted articles");
