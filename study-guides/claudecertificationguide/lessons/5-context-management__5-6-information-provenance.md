# 5.6 — Information Provenance & Multi-Source Synthesis | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/5-context-management/5-6-information-provenance

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
05
Context Management & Reliability
5.1
Context Window Management
5.2
Escalation & Ambiguity Resolution
5.3
Error Propagation in Multi-Agent Systems
5.4
Codebase Exploration & Context Degradation
5.5
Human Review & Confidence Calibration
5.6
Information Provenance & Multi-Source Synthesis

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
LEARN
/
CONTEXT MANAGEMENT & RELIABILITY
/
5.6
DOMAIN 5
TASK 5.6
Mark Complete
Information Provenance & Multi-Source Synthesis
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Information provenance — knowing where every claim comes from and how confident you should be in it — is the difference between a research system that produces trustworthy outputs and one that produces plausible-sounding fiction. The exam tests your understanding of how attribution survives (or dies) through multi-agent synthesis pipelines, how to handle conflicting sources, and how temporal context prevents false contradictions.

Structured Claim-Source Mappings

Every finding in a multi-agent research system must carry its provenance. This isn't optional metadata. It's the structural guarantee that the final output can be traced back to specific sources. Each finding must include:

Claim: The specific assertion being made
Source URL: Where the information was found
Document name: The title of the source document
Relevant excerpt: The specific passage that supports the claim
Publication date: When the source was published or data was collected
JSON
Copy
{
  "claim": "Global renewable energy investment reached $495 billion in 2023",
  "sourceUrl": "https://example.com/iea-report-2024",
  "documentName": "IEA World Energy Investment Report 2024",
  "relevantExcerpt": "Total investment in renewable energy technologies reached approximately $495 billion in calendar year 2023, representing a 17% increase over 2022.",
  "publicationDate": "2024-06-15"
}


The critical challenge is that attribution dies during summarisation. When a synthesis agent combines findings from multiple subagents, it naturally compresses and paraphrases. Without explicit instructions to preserve claim-source mappings, the synthesis produces statements like "Investment in renewable energy has grown significantly" — no amount, no source, no date.

Downstream agents must explicitly preserve and merge claim-source mappings through synthesis. This requires:

Subagents output findings in the structured claim-source format.
The synthesis agent is instructed to maintain these mappings when combining findings.
The final output includes inline citations or a structured reference section that traces each claim to its source.
Conflict Handling

When two credible sources report different statistics for the same measure, the synthesis agent faces a critical decision. The wrong approach — and the one the exam tests for — is to arbitrarily select one value.

Example: Source A reports 12% market growth. Source B reports 8% market growth. Both are credible publications.

Wrong approach: Select the more recent source, or average the values, or pick the one from the more authoritative publisher.

Correct approach: Annotate with both values and full source attribution. Let the consumer decide.

MARKDOWN
Copy
Market growth estimates vary by source:
- **12% growth** — IEA World Energy Report (published June 2024, using 2023 calendar year data)
- **8% growth** — Bloomberg NEF Annual Review (published March 2024, using July 2022–June 2023 data)

The difference may reflect different reporting periods and methodological approaches.


This preserves the full picture. The consumer can see both values, understand the sources, and make their own judgement about which is more relevant to their needs. Arbitrarily selecting one value destroys information and presents a false certainty.

Temporal Awareness

Different publication dates explain different numbers. That's not a contradiction. It's temporal context, and it has to be preserved.

Consider two sources:

Source A (published 2023): reports 8% growth
Source B (published 2024): reports 12% growth

Without publication dates, these look contradictory. With dates, they tell a story: growth accelerated from 8% to 12% over the measured period. The "conflict" is actually a trend.

Require publication/data collection dates in all structured outputs. This isn't housekeeping; it's what makes correct interpretation possible. Without temporal context, valid trends get misread as data quality issues, and the synthesis agent may incorrectly flag or suppress findings that are actually consistent.

Subagents must include these dates in their structured outputs. The synthesis agent must preserve them through the merging process. And the final output must present them alongside the data they describe.

Content-Appropriate Rendering

Different types of content demand different presentation formats. The exam tests whether you understand that synthesis should not flatten everything into a uniform format:

Financial data → Tables. Numbers, comparisons, and trends are most readable in tabular format. Forcing financial data into prose paragraphs makes it harder to compare values and spot patterns.

Year	Investment ($B)	Growth (%)
2021	366	12%
2022	423	16%
2023	495	17%

News and current events → Prose. Narrative context, cause-and-effect relationships, and chronological developments read naturally as paragraphs.

Technical findings → Structured lists. Architectural patterns, API specifications, and configuration options are clearest as bulleted or numbered lists with clear hierarchy.

Forcing all content into a single format — all tables, or all prose, or all lists — degrades readability and comprehension. The synthesis agent should select the appropriate rendering format based on the content type.

Attribution Preservation Through Multi-Step Synthesis

In a multi-agent pipeline, attribution must survive every step:

Research subagent collects findings with claim-source mappings.
Analysis subagent evaluates findings and adds assessment, preserving original mappings.
Synthesis subagent combines findings from multiple agents, merging mappings.
Report generation produces the final output with inline citations.

At each step, there is a risk of attribution loss. The most common failure point is step 3, where the synthesis agent combines and paraphrases findings without carrying the source mappings forward. The synthesis agent's prompt must explicitly require that every claim in its output is traceable to a specific source.

Reports should include explicit sections distinguishing well-established findings from contested ones, preserving original source characterisations and methodological context. A finding supported by three independent sources is different from a finding based on a single report, even if both are presented with equal confidence in the text.

Completing Analysis with Conflicts Intact

When document analysis encounters conflicting values, the analysis agent must complete its work with the conflicts included and explicitly annotated. It should not resolve the conflict — that decision belongs to the coordinator or the consumer.

JSON
Copy
{
  "field": "annualRevenue",
  "conflictDetected": true,
  "values": [
    {
      "value": "$4.2M",
      "source": "Annual Report 2023",
      "context": "Audited financial statements, fiscal year ending December 2023"
    },
    {
      "value": "$3.8M",
      "source": "SEC Filing Q4 2023",
      "context": "Preliminary unaudited figures, calendar year 2023"
    }
  ],
  "possibleExplanation": "Difference may reflect audited vs preliminary figures and fiscal vs calendar year reporting periods"
}


The coordinator can then decide how to handle the conflict: present both values, investigate further, or escalate to a human analyst.

KEY CONCEPT

Every claim needs a structured mapping: claim + source URL + document name + excerpt + publication date. Attribution dies during summarisation unless explicitly preserved. Conflicting sources should be annotated with both values and attribution — never arbitrarily pick one. Different dates explain different numbers. Render content appropriately: financial data as tables, news as prose, technical findings as lists.

Exam Traps
EXAM TRAP

Selecting the most recent source when two credible sources conflict

Arbitrarily selecting one value destroys information. Annotate both values with source attribution and publication dates. Let the consumer decide.

EXAM TRAP

Assuming different numbers from different sources are contradictions

Different publication or data collection dates often explain different numbers. Require dates in structured outputs to enable correct temporal interpretation.

EXAM TRAP

Allowing the synthesis agent to paraphrase without preserving claim-source mappings

Attribution dies during summarisation. The synthesis agent must explicitly preserve and merge claim-source mappings. Without this, the output is untraceable.

EXAM TRAP

Rendering all content types in a uniform format (all prose, all tables, or all lists)

Financial data is best as tables, news as prose, technical findings as structured lists. Flattening to a single format degrades readability and comprehension.

Practice Scenario

A multi-agent research system produces a synthesis report on market trends. Two credible sources report different growth rates: Source A reports 12% growth (2023 data) and Source B reports 8% growth (2024 data). The synthesis agent currently selects the more recent value. What is the correct approach?

OPTION A
Flag the conflict and escalate it to a human researcher for resolution before including either of the two figures in the final report
OPTION B
Average the two values and report 10% growth, with a footnote recording the variance between the two sources
OPTION C
Always use the most recent source, since the later publication date makes it the more reliable reflection of current market conditions
OPTION D
Annotate both values with source attribution and publication dates, letting the consumer decide how to interpret the difference
Check Answer
Build Exercise
BUILD EXERCISE
Build a Provenance-Preserving Synthesis Pipeline
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

Design structured claim-source mappings with claim, source URL, document name, excerpt, and publication date
Preserve attribution through multi-step synthesis pipelines without loss during summarisation
Handle conflicting sources by annotating both values rather than arbitrarily selecting one
Use temporal awareness (publication dates) to distinguish trends from contradictions
Apply content-appropriate rendering: tables for financial data, prose for news, lists for technical findings
Define a structured claim-source mapping schema with fields: claim, sourceUrl, documentName, relevantExcerpt, publicationDate

WHY: Every finding in a multi-agent research system must carry its provenance. Without structured claim-source mappings, attribution dies during summarisation and the final output becomes untraceable plausible-sounding text with no verifiable sources.

YOU SHOULD SEE: A TypeScript interface or JSON schema with all five required fields: claim (the assertion), sourceUrl (where found), documentName (title), relevantExcerpt (supporting passage), and publicationDate (when published or data collected). Each field should be required, not optional.

Stuck? Get a nudge
Implement two research subagents that output findings using the claim-source mapping schema, including publication dates

WHY: Subagents must output in the structured format from the start. If subagents return unstructured prose, attribution is already lost before synthesis begins. Requiring structured output at the subagent level is the foundation of end-to-end provenance.

YOU SHOULD SEE: Two subagent functions that each return an array of ClaimSourceMapping objects with all fields populated, including publication dates. Each subagent should research a different aspect of the same topic.

Stuck? Get a nudge
Build a synthesis agent that merges findings from both subagents while explicitly preserving all claim-source mappings through the merge process

WHY: Step 3 (synthesis) is the most common failure point for attribution. The synthesis agent naturally compresses and paraphrases, destroying claim-source mappings unless explicitly instructed to preserve them. The exam tests whether you understand that attribution must be explicitly maintained through every synthesis step.

YOU SHOULD SEE: A synthesis output where every claim is traceable to its source. The synthesis should combine related findings but maintain inline citations or a reference section linking each claim to its original source URL, document name, and publication date.

Stuck? Get a nudge
Handle conflicting sources by annotating both values with full attribution and possible explanations, without arbitrarily selecting one value

WHY: When two credible sources report different statistics, arbitrarily selecting one destroys information and presents false certainty. The exam tests that the correct approach is to annotate both values with source attribution and let the consumer decide. Different publication dates often explain different numbers as trends, not contradictions.

YOU SHOULD SEE: A conflict handling function that detects overlapping claims with different values, preserves both with full attribution, and adds a possible explanation noting temporal or methodological differences. The output should never silently pick one value.

Stuck? Get a nudge
Implement content-appropriate rendering in the final output: format financial data as tables, news findings as prose, and technical findings as structured lists

WHY: The exam tests that synthesis should not flatten everything into a uniform format. Financial data is most readable as tables, news context reads naturally as prose, and technical findings are clearest as structured lists. Forcing all content into one format degrades readability.

YOU SHOULD SEE: A rendering function that detects the content type of each section and applies the appropriate format. Financial data should appear in tables with columns for year, value, and source. News should be prose paragraphs. Technical findings should be bulleted lists.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.6 — Anthropic
Anthropic Multi-Agent Research Patterns — Anthropic
Anthropic Prompt Engineering — Citation and Attribution — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Human Review & Confidence Calibration