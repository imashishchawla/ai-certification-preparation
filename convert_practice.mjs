import fs from 'fs';
import path from 'path';

const SRC = "practice-questions";
const DST = "content/practice";

const files = [
  { file: "claudecertificationguide-257-question-bank.md", title: "claudecertificationguide — 257 Questions", count: "257 Q", meta: "Free CCAR-F course · extracted from Next.js RSC payload" },
  { file: "claudecertifiedarchitects-400-question-bank.md", title: "claudecertifiedarchitects — 400 Questions", count: "400 Q", meta: "Mined from public JS bundle (app.js)" },
  { file: "cca-prep-170-question-bank.md", title: "cca-prep — 170 Questions", count: "170 Q", meta: "4 difficulty tiers · why-wrong explanations · doc links" },
  { file: "amey-thakur-arch-foundations-80q.md", title: "Amey-Thakur — Foundations 80 Questions", count: "80 Q", meta: "From 320-Q JSON bank · 3 timed mocks" },
  { file: "paullarionov-guide-questions.md", title: "Paullarionov — 88 Scenario Questions", count: "88 Q", meta: "Grouped by exam scenario · Anki deck available" },
  { file: "amey-thakur-practice-questions.md", title: "Amey-Thakur — 35 Practice Questions", count: "35 Q", meta: "35 original questions in 6 scenarios" },
  { file: "amey-thakur-mock-exam-1.md", title: "Amey-Thakur — Mock Exam 1", count: "15 Q", meta: "Timed mock · 15 Q / 30 min · answer key" },
  { file: "amey-thakur-mock-exam-2.md", title: "Amey-Thakur — Mock Exam 2", count: "15 Q", meta: "Timed mock · 15 Q / 30 min · answer key" },
  { file: "amey-thakur-mock-exam-3.md", title: "Amey-Thakur — Mock Exam 3", count: "15 Q", meta: "Timed mock · 15 Q / 30 min · answer key" },
  { file: "claudecertifiedarchitects-5-sample-questions.md", title: "claudecertifiedarchitects — 5 Sample Questions", count: "5 Q", meta: "5 worked samples + study plans" },
  { file: "claudearchitectcertification-20-antipatterns.md", title: "20 Canonical Anti-patterns", meta: "20 canonical wrong-answer patterns" },
  { file: "cca-prep-antipatterns.md", title: "17 Anti-patterns with Exam Tips", meta: "17 anti-patterns with exam tips" },
  { file: "cca-prep-flashcards.md", title: "45 Flashcards", meta: "45 flip cards" },
  { file: "flashcards.md", title: "110 Flashcards (All 4 Certs)", meta: "110 flashcards (Amey-Thakur, all 4 certs)" },
];

for (const f of files) {
  const content = fs.readFileSync(path.join(SRC, f.file), 'utf8');
  const fm = [
    "---",
    `title: "${f.title}"`,
    f.count ? `count: "${f.count}"` : "",
    f.meta ? `meta: "${f.meta}"` : "",
    'tags: ["practice", "questions"]',
    "---",
    "",
    content
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join(DST, f.file), fm);
}
console.log("Converted practice files");
