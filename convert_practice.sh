#!/bin/bash
SRC="practice-questions"
DST="content/practice"

# Map filenames to titles and metadata
declare -A titles=(
  ["claudecertificationguide-257-question-bank.md"]="claudecertificationguide — 257 Questions"
  ["claudecertifiedarchitects-400-question-bank.md"]="claudecertifiedarchitects — 400 Questions"
  ["cca-prep-170-question-bank.md"]="cca-prep — 170 Questions"
  ["amey-thakur-arch-foundations-80q.md"]="Amey-Thakur — Foundations 80 Questions"
  ["paullarionov-guide-questions.md"]="Paullarionov — 88 Scenario Questions"
  ["amey-thakur-practice-questions.md"]="Amey-Thakur — 35 Practice Questions"
  ["amey-thakur-mock-exam-1.md"]="Amey-Thakur — Mock Exam 1"
  ["amey-thakur-mock-exam-2.md"]="Amey-Thakur — Mock Exam 2"
  ["amey-thakur-mock-exam-3.md"]="Amey-Thakur — Mock Exam 3"
  ["claudecertifiedarchitects-5-sample-questions.md"]="claudecertifiedarchitects — 5 Sample Questions"
  ["claudearchitectcertification-20-antipatterns.md"]="20 Canonical Anti-patterns"
  ["cca-prep-antipatterns.md"]="17 Anti-patterns with Exam Tips"
  ["cca-prep-flashcards.md"]="45 Flashcards"
  ["flashcards.md"]="110 Flashcards (All 4 Certs)"
  ["paullarionov-guide-questions.md"]="Paullarionov — 88 Scenario Questions"
)

declare -A counts=(
  ["claudecertificationguide-257-question-bank.md"]="257 Q"
  ["claudecertifiedarchitects-400-question-bank.md"]="400 Q"
  ["cca-prep-170-question-bank.md"]="170 Q"
  ["amey-thakur-arch-foundations-80q.md"]="80 Q"
  ["paullarionov-guide-questions.md"]="88 Q"
  ["amey-thakur-practice-questions.md"]="35 Q"
  ["amey-thakur-mock-exam-1.md"]="15 Q"
  ["amey-thakur-mock-exam-2.md"]="15 Q"
  ["amey-thakur-mock-exam-3.md"]="15 Q"
  ["claudecertifiedarchitects-5-sample-questions.md"]="5 Q"
)

declare -A metas=(
  ["claudecertificationguide-257-question-bank.md"]="Free CCAR-F course · extracted from Next.js RSC payload"
  ["claudecertifiedarchitects-400-question-bank.md"]="Mined from public JS bundle (app.js)"
  ["cca-prep-170-question-bank.md"]="4 difficulty tiers · why-wrong explanations · doc links"
  ["amey-thakur-arch-foundations-80q.md"]="From 320-Q JSON bank · 3 timed mocks"
  ["paullarionov-guide-questions.md"]="Grouped by exam scenario · Anki deck available"
  ["amey-thakur-practice-questions.md"]="35 original questions in 6 scenarios"
  ["amey-thakur-mock-exam-1.md"]="Timed mock · 15 Q / 30 min · answer key"
  ["amey-thakur-mock-exam-2.md"]="Timed mock · 15 Q / 30 min · answer key"
  ["amey-thakur-mock-exam-3.md"]="Timed mock · 15 Q / 30 min · answer key"
  ["claudecertifiedarchitects-5-sample-questions.md"]="5 worked samples + study plans"
  ["claudearchitectcertification-20-antipatterns.md"]="20 canonical wrong-answer patterns"
  ["cca-prep-antipatterns.md"]="17 anti-patterns with exam tips"
  ["cca-prep-flashcards.md"]="45 flip cards"
  ["flashcards.md"]="110 flashcards (Amey-Thakur, all 4 certs)"
)

for f in "$SRC"/*.md; do
  base=$(basename "$f")
  title="${titles[$base]}"
  count="${counts[$base]:-}"
  meta="${metas[$base]:-}"
  
  # Read the content (skip first line if it's a title)
  content=$(cat "$f")
  
  # Create front matter
  {
    echo "---"
    echo "title: \"$title\""
    [ -n "$count" ] && echo "count: \"$count\""
    [ -n "$meta" ] && echo "meta: \"$meta\""
    echo "tags: [\"practice\", \"questions\"]"
    echo "---"
    echo ""
    echo "$content"
  } > "$DST/$base"
done
echo "Converted practice files"
