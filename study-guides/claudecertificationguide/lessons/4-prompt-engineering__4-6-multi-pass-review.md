# 4.6 — Multi-Instance and Multi-Pass Review | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/4-prompt-engineering/4-6-multi-pass-review

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
02
Tool Design & MCP Integration
03
Claude Code Configuration & Workflows
04
Prompt Engineering & Structured Output
4.1
System Prompts with Explicit Criteria
4.2
Few-Shot Prompting
4.3
Structured Output with Tool Use
4.4
Validation, Retry, and Feedback Loops
4.5
Batch Processing Strategies
4.6
Multi-Instance and Multi-Pass Review
05
Context Management & Reliability

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
LEARN
/
PROMPT ENGINEERING & STRUCTURED OUTPUT
/
4.6
DOMAIN 4
TASK 4.6
Mark Complete
Multi-Instance and Multi-Pass Review
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

When Claude reviews its own output, it starts at a disadvantage: it still carries the reasoning it used to generate that output. The model remembers why it made each decision and is less likely to question it. That's not a bug. It's just how self-review works inside a single session. The job is to design around it.

The Self-Review Limitation

A model reviewing its own output in the same conversation session retains its original reasoning chain. It already "knows" why it chose each approach, classified each finding at a particular severity, or selected certain values. When asked to review, it tends to confirm rather than challenge those decisions.

An independent instance — a separate Claude invocation without the prior reasoning context — approaches the output fresh. It judges the code, findings, or extraction on what it sees alone, without the bias of "I chose this because..." That's what makes independent review so much better at catching subtle issues.

The exam tests this directly. When presented with options for improving review quality, the correct answer involves using a separate model instance, not adding "please review carefully" instructions to the same session or relying on extended thinking within the generating session.

TYPESCRIPT
Copy
// Anti-pattern: self-review in the same session
const generation = await client.messages.create({
  messages: [
    { role: "user", content: "Write a function to process orders" },
    { role: "assistant", content: generatedCode },
    { role: "user", content: "Now review your code for bugs" }
    // Model retains its reasoning — less likely to find its own mistakes
  ]
});

// Correct: independent review instance
const review = await client.messages.create({
  messages: [
    {
      role: "user",
      content: `Review this code for bugs, security issues, and edge cases:\n\n${generatedCode}`
    }
    // Fresh instance — no prior reasoning context
  ]
});

Multi-Pass Review Architecture

Large reviews (multi-file PRs, complex extraction pipelines, broad code audits) suffer from attention dilution when processed in a single pass. The symptoms are specific and recognisable:

Detailed feedback on some files, superficial comments on others
Obvious bugs missed in the middle of the review
Contradictory findings — flagging a pattern as problematic in one file while approving identical code elsewhere

The fix is to split the review into focused passes:

Pass 1: Per-file local analysis. Analyse each file individually with a focused review prompt. This ensures consistent depth across all files. Each invocation examines only one file, so the model gives it full attention.

Pass 2: Cross-file integration. After all per-file analyses are complete, run a separate pass that receives all per-file findings and checks for cross-file issues: data flow between modules, consistent API usage across services, dependency conflicts, and contradictions in the per-file findings themselves.

TYPESCRIPT
Copy
// Pass 1: Per-file analysis
const perFileFindings = await Promise.all(
  files.map(file =>
    client.messages.create({
      messages: [{
        role: "user",
        content: `Review this file for local issues (bugs, security, logic errors):\n\n${file.content}`
      }]
    })
  )
);

// Pass 2: Cross-file integration
const integrationReview = await client.messages.create({
  messages: [{
    role: "user",
    content: `Given these per-file findings, identify cross-file issues:\n` +
      `- Data flow inconsistencies between modules\n` +
      `- Contradictory patterns flagged in different files\n` +
      `- API contract violations across service boundaries\n\n` +
      `Findings:\n${JSON.stringify(perFileFindings)}`
  }]
});


This architecture directly addresses the three symptoms of attention dilution. Per-file passes ensure consistent depth. The integration pass catches cross-file issues that no single-file review would identify. And the separation prevents contradictory findings from appearing in the same output.

Why Larger Context Windows Do Not Fix This

The exam includes a specific distractor: "switch to a higher-tier model with a larger context window." This sounds reasonable — if the model can't handle 14 files at once, give it more capacity. But the problem isn't context size. It's attention quality. A bigger context window won't stop the model from spreading its attention unevenly across files. Only focused, per-file passes ensure consistent depth.

Confidence-Based Routing

For findings that are uncertain, the model can self-report confidence alongside each finding. This enables a routing strategy:

High confidence findings: Report directly to developers
Low confidence findings: Route to human review for validation
Threshold calibration: Use labelled validation sets to calibrate what confidence score correlates with actual accuracy
JSON
Copy
{
  "finding": "Potential race condition in order processing",
  "severity": "major",
  "confidence": 0.65,
  "reasoning": "The lock acquisition pattern appears correct but the unlock timing depends on an async callback whose ordering I cannot fully verify.",
  "route": "human_review"
}


The confidence score isn't self-reported accuracy. It's the model's read on its own certainty. Calibrate it by running labelled examples (where you already know the answer) through the system and measuring how reported confidence tracks actual accuracy. Then adjust routing thresholds from that data.

The exam distinguishes between raw confidence scores (uncalibrated, unreliable for automated decisions) and calibrated confidence thresholds (validated against labelled sets, suitable for routing). Using uncalibrated confidence for automated decisions is an anti-pattern.

KEY CONCEPT

A model reviewing its own output in the same session retains reasoning context and is less likely to question its decisions. Use independent instances for review. Split large reviews into per-file local passes plus a cross-file integration pass to prevent attention dilution. Calibrate confidence thresholds using labelled validation sets before using them for routing.

Putting It All Together

A production review architecture combines all three concepts:

Generation: First instance generates code, extraction, or analysis
Per-file review: Independent instances review each output unit individually
Integration review: Separate instance checks cross-unit consistency
Confidence routing: Low-confidence findings go to human review
Calibration loop: Labelled validation sets continuously calibrate confidence thresholds

This architecture is more expensive than single-pass review. The trade-off is worth it when review quality directly affects production reliability — CI/CD pipelines, financial extraction, compliance analysis, and any system where missed issues have downstream consequences.

Exam Traps
EXAM TRAP

Choosing self-review in the same session as a viable review strategy

The model retains its reasoning context from generation and is less likely to question its own decisions. An independent instance without prior context is significantly more effective at catching subtle issues.

EXAM TRAP

Using a single pass for large multi-file reviews

Single-pass multi-file reviews produce inconsistent depth, miss bugs, and generate contradictory findings due to attention dilution. Split into per-file local passes plus a cross-file integration pass.

EXAM TRAP

Switching to a larger context window model to fix attention dilution

Larger context windows do not solve attention quality issues. The model can hold more text but still gives uneven attention across files. Focused per-file passes are the correct fix.

EXAM TRAP

Using uncalibrated confidence scores for automated review routing

Raw self-reported confidence is poorly calibrated. Calibrate thresholds using labelled validation sets before relying on confidence for routing decisions.

Practice Scenario

A pull request modifying 14 files receives inconsistent review: detailed feedback on some files, superficial comments on others, obvious bugs missed, and contradictory findings — the same pattern is flagged as problematic in one file but approved in another. How should you restructure the review?

OPTION A
Switch to a higher-tier model with a much larger context window so that all 14 files receive adequate attention within a single review pass
OPTION B
Split into per-file local analysis passes for consistent depth, then run a separate cross-file integration pass for data flow issues
OPTION C
Run three independent review passes over the full PR and only flag those issues that at least two of the three separate runs agree on
OPTION D
Require developers to split large pull requests into smaller submissions of 3-4 files before the automated review runs
Check Answer
Build Exercise
BUILD EXERCISE
Build a Multi-Pass Code Review System
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

Understand why self-review in the same session retains reasoning context and is less effective than independent review
Design multi-pass review architectures with per-file local analysis and cross-file integration passes
Identify and mitigate attention dilution in large multi-file reviews
Implement confidence-based routing with calibrated thresholds from labelled validation sets
Distinguish uncalibrated raw confidence from calibrated thresholds suitable for automated routing
Create a single-pass review prompt and run it against a 10-file mock PR — document instances of inconsistent depth, missed issues, and contradictory findings

WHY: Establishing the single-pass baseline demonstrates the three symptoms of attention dilution: inconsistent depth across files, missed bugs in the middle of the review, and contradictory findings flagging the same pattern differently in different files.

YOU SHOULD SEE: Detailed feedback on some files (typically first and last) but superficial comments on others, at least one obvious bug missed in a middle file, and at least one contradictory finding where the same code pattern is flagged as problematic in one file but approved in another.

Stuck? Get a nudge
Implement per-file local analysis: iterate over each file with a focused review prompt that examines only that file for bugs, security issues, and logic errors

WHY: Per-file analysis ensures every file receives consistent, focused attention. Each invocation examines only one file, eliminating the attention dilution that causes inconsistent depth and missed bugs in single-pass reviews.

YOU SHOULD SEE: Consistent review depth across all 10 files. Bugs that were missed in the single-pass review should now be caught, especially those in the middle files. Each review should be focused and thorough.

Stuck? Get a nudge
Implement a cross-file integration pass: feed all per-file findings into a separate prompt that checks for data flow inconsistencies, contradictory findings across files, and API contract violations

WHY: Per-file analysis catches local issues but misses cross-file concerns: data flow between modules, consistent API usage, and contradictions in per-file findings. The integration pass is a separate invocation that receives all findings and checks for systemic issues.

YOU SHOULD SEE: A synthesis output identifying cross-file issues that no single-file review could catch: data passed between modules in incompatible formats, contradictory findings from per-file reviews, and API contracts violated across service boundaries.

Stuck? Get a nudge
Add confidence scoring to each finding (0.0-1.0) and implement routing: high confidence findings go directly to the developer, low confidence findings go to a human review queue

WHY: Confidence-based routing directs limited human reviewer attention to the findings that need it most. The exam distinguishes raw uncalibrated confidence from calibrated thresholds validated against labelled sets.

YOU SHOULD SEE: Each finding annotated with a confidence score, reasoning for the score, and a routing decision (direct_report or human_review). The routing threshold should separate clear-cut findings from uncertain ones.

Stuck? Get a nudge
Use a separate Claude instance (fresh session, no prior context) to review a subset of the generated findings and compare its assessment to the original confidence scores for calibration

WHY: Independent review instances approach output fresh without the bias of I chose this because reasoning. This step calibrates confidence thresholds by comparing self-reported confidence against independent assessment, the method the exam identifies as the correct approach.

YOU SHOULD SEE: A calibration dataset showing the relationship between reported confidence scores and independent verification results. Some high-confidence findings may be overturned, revealing calibration gaps that adjust your routing thresholds.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Task Statement 4.6 — Anthropic
Prompt Engineering Overview — Anthropic
Building with Claude API (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Batch Processing Strategies
NEXT LESSON
Context Window Management