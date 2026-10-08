# CCAR-F question format and source review — 2026-10-08

## Evidence hierarchy

1. **Official authority:** [Anthropic Partner Academy certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification), [Anthropic certification FAQ](https://anthropic-partners.skilljar.com/page/faq-certifications), and the [July 2026 CCAR-F v1.0 exam guide kept in this repo](../static/assets/cca-f/pdfs/claude-architect-foundations-study-guide.pdf). The guide lists 60 items, 120 minutes, five domains, four scenarios drawn from six published contexts, multiple-choice and multiple-response formats, 30 task statements, and 12 official sample items.
2. **Style calibration, not answer authority:** [Paolo Amato's original practice exam](https://github.com/paoloamato2/claude-certified-architect-foundations-practice-exam), [Szymon Paluch's three public sample questions](https://szymonpaluch.com/claude-certified-architect-practice-exam), and [Amey Thakur's original practice questions](https://amey-thakur.github.io/CLAUDE-CERTIFICATIONS/architect-foundations/index.html). These explicitly identify themselves as unofficial or original. Use them to assess question writing, then check every keyed answer against the official task statements and current product docs.
3. **Anecdotal calibration:** [one candidate describes four plausible fixes and an architectural choice](https://www.reddit.com/r/ClaudeAI/comments/1u43exm/passed_the_claude_certified_architect_foundations/), while [another describes plausible options differentiated by efficiency, determinism, and maintainability](https://www.reddit.com/r/ClaudeAI/comments/1w4cd7w/passed_the_claude_certified_architect_foundations/). These accounts agree with the guide's samples, but they are self-reports, not a published live question bank. Other candidates disagree about how many scenarios appear; the official guide remains the format authority.

I found **no authenticated public copy of live exam questions**. Commercial pages labelled “dumps” do not establish provenance or answer correctness. One [unofficial five-question PDF](https://claudecertified.com/downloads/cca-sample-5q.pdf) even lists a $99 attempt price while the current [official page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) lists $125; that is a concrete reason to verify third-party metadata before importing anything. No dump content was imported.

## What an exam-style item looks like

The official samples are not uniformly long: the Claude Code command-location item is relatively short. The reliable feature is a **specific production need or observed failure**, followed by a choice among actions. The winning option addresses the named constraint; distractors may be valid techniques for a different constraint. Some official samples ask for a command or file location, so length alone does not prove an item is invalid.

| Official sample | Decision being tested | Bank calibration |
| --- | --- | --- |
| Q1: support tool ordering | Enforce a verified identity prerequisite instead of relying on prompt compliance. | A definition of `stop_reason` is useful study material; an exam mock should ask what to do when a workflow violates a prerequisite. |
| Q2: wrong support tool selected | Fix overlapping tool descriptions before adding a router or merging tools. | Choices should distinguish first corrective step from larger redesigns. |
| Q7: incomplete research coverage | Trace the missing domains to the coordinator's decomposition. | Include logs or output evidence so the root cause is inferable. |
| Q9: synthesis verification latency | Give a specialist a narrow verification tool for common checks while retaining coordinator escalation for harder work. | Make tradeoffs and permissions explicit. |
| Q11: blocking versus overnight jobs | Choose real-time or batch by latency tolerance, not by the discount alone. | A bare “What percent cheaper?” item is a flashcard, not mock calibration. |
| Q12: inconsistent 14-file review | Split local and integration passes rather than increase the context window. | Distractors should be plausible fixes for adjacent problems. |

## Bank audit and actions

| Measurement | Before this pass | After this pass | Interpretation |
| --- | ---: | ---: | --- |
| Source records | 1,217 | 1,223 | Six original editorial items added. |
| Quarantined | 82 | 82 | No additional record was declared factually wrong from a format heuristic. |
| Published for practice | 1,135 | 1,141 | Study and practice keep the short items. |
| Eligible for timed mocks | 1,135 | 937 | 204 short, context-free items became study-only. |
| Active items with a task `section` field | 330 | 336 | 805 active items still lack a recorded task mapping. |
| Active items with fewer than 20 stem words and no separate `scenario` | 204 | 204 | These are the study-only register below. |
| Mock-eligible items with 20–29 stem words and no separate `scenario` | — | 258 | Editorial review queue; length alone does not justify exclusion. |

The 204 study-only items were **not quarantined as incorrect**. The exam-simulation defect is that a stem under 20 words without a separate scenario usually cannot present a meaningful production constraint, while the old UI supplied a generic invented scenario in a side panel. Thirty-nine items are additionally marked as direct recall prompts (for example `cca-f-prep-062`, “What is a few-shot prompt?”). All 204 have `mockEligible: false`, `reviewStatus: needs-rewrite`, and a `qualityReview` reason. They remain `ready` for untimed study. The timed-mock UI now shows a side scenario only when the record actually contains one or a meaningful scenario can be separated from its stem.

The six original scenario items are `cca-f-calibration-001` through `006`. They map respectively to customer support, Claude Code development, multi-agent research, codebase exploration, CI review, and structured extraction. Each records a guide task statement and an explanation of the incorrect options. They are **original editorial questions**, not official samples or reconstructed live items. Their source ID intentionally says `editorial`.

## Remaining quality work

- **Four-of-six scenario structure:** the site still draws 60 independent questions using domain quotas. The guide says an exam form uses four shared scenarios selected from six. The existing data has inconsistent scenario tags and 906 mock-eligible items have no separate `scenario` field, although many put the context in the prompt. Build a reviewed six-scenario mapping before changing the mock selection logic; a keyword-only classifier could quietly assign questions to the wrong context.
- **Multiple response:** the official exam allows it, but the question validator and UI currently require one answer and render radio buttons. Add checkbox rendering, exact-set scoring, a stated selection count, and reviewed multi-response items before claiming complete format coverage.
- **Task mapping:** 805 active items lack a `section` field. Map the tested decision, not just its vocabulary, to one of the 30 tasks. The published count is a count of available questions, not of independently verified items.
- **Distractor review:** 30 remaining mock-eligible records have at least two answer options under five words. Some command or file-path choices are legitimately short, so inspect these manually against the official sample style rather than excluding them by length.
- **Answer verification:** every new or modified item needs a checked key, option-by-option rationale, guide task, source provenance, and review date. Model/version-specific items should be rechecked as docs change. Keep the existing 82 quarantined until repaired or archived.

## Study-only register

Each row below is still available in untimed practice. “Recall” means explicitly selected for its definition-style stem; “short context” means fewer than 20 words and no separate scenario. Both require editorial rewriting before returning to a timed mock.

| ID | Flag | Current prompt |
| --- | --- | --- |
| `cca-f-prep-016` | Short context | You are designing a coordinator prompt for a multi-agent research system. Which prompt style leads to better subagent outcomes? |
| `cca-f-prep-020` | Recall | What is the key difference between `prompt chaining` and `dynamic adaptive decomposition` for task execution? |
| `cca-f-prep-021` | Short context | A subagent fails to retrieve data from a slow external API (timeout). What is the correct error-handling architecture? |
| `cca-f-prep-028` | Recall | What is the primary mechanism Claude uses to decide which tool to invoke? |
| `cca-f-prep-030` | Recall | What are the three values available for the `tool_choice` parameter? |
| `cca-f-prep-031` | Recall | What does the MCP `isError` flag on a tool response indicate? |
| `cca-f-prep-045` | Recall | What is CLAUDE.md and when does Claude Code read it? |
| `cca-f-prep-046` | Short context | In the CLAUDE.md hierarchy, which file takes precedence when there are conflicting instructions? |
| `cca-f-prep-047` | Short context | When should you use plan mode in Claude Code? |
| `cca-f-prep-048` | Recall | What is the `permissionMode: "acceptEdits"` option in the Claude Agent SDK? |
| `cca-f-prep-051` | Short context | You want Claude Code to automatically run your linter after every file edit. Which mechanism achieves this? |
| `cca-f-prep-052` | Recall | What is the key benefit of integrating Claude Code into a CI/CD pipeline for automated PR reviews? |
| `cca-f-prep-053` | Short context | A new engineer joins the team. What is the most effective way to use CLAUDE.md to accelerate their onboarding? |
| `cca-f-prep-054` | Short context | Which `allowedTools` configuration creates a read-only agent that can explore a codebase without modifying any files? |
| `cca-f-prep-061` | Recall | What is the primary advantage of requesting JSON output with a defined schema over free-form text output? |
| `cca-f-prep-062` | Recall | What is a few-shot prompt? |
| `cca-f-prep-063` | Recall | The Message Batches API offers approximately what cost reduction compared to the standard synchronous API? |
| `cca-f-prep-064` | Recall | What is a validation retry loop in the context of structured output extraction? |
| `cca-f-prep-067` | Recall | When is it NOT appropriate to use the Message Batches API? |
| `cca-f-prep-069` | Recall | Few-shot examples are effective for which purpose, and NOT effective for which purpose? |
| `cca-f-prep-070` | Recall | What does `strict: true` on a tool definition guarantee? |
| `cca-f-prep-079` | Recall | What is attention dilution and when does it occur? |
| `cca-f-prep-080` | Recall | Why is self-reported LLM confidence a poor signal for escalation routing? |
| `cca-f-prep-081` | Recall | When should you use prompt caching for cost optimization? |
| `cca-f-prep-085` | Recall | Information provenance in a multi-agent pipeline refers to: |
| `cca-f-prep-128` | Recall | What is the difference between tool_choice: "auto", tool_choice: "any", and forced tool selection in the Claude API? |
| `cca-f-prep-143` | Recall | In the Model Context Protocol, what is the difference between an MCP Resource and an MCP Tool? |
| `cca-f-foundation-012` | Recall | What is the strongest justification for splitting work across subagents? |
| `cca-f-foundation-013` | Short context | An agent loops between two tools without converging. What is the most appropriate first control? |
| `cca-f-foundation-014` | Short context | Which property most increases the operational risk of an agentic design? |
| `cca-f-foundation-015` | Short context | How should an agentic system handle a step whose result it cannot verify? |
| `cca-f-foundation-017` | Short context | What most improves the debuggability of an agentic system in production? |
| `cca-f-foundation-018` | Short context | Where should conventions that apply to everyone working in a repository be recorded? |
| `cca-f-foundation-019` | Short context | What distinguishes work suited to headless mode? |
| `cca-f-foundation-020` | Short context | A skill and a subagent could both address a need. What decides between them? |
| `cca-f-foundation-021` | Recall | What is the correct use of a hook in a Claude Code workflow? |
| `cca-f-foundation-022` | Short context | Claude Code performs well for one engineer and inconsistently across the team. What is the most likely cause? |
| `cca-f-foundation-023` | Short context | A pipeline requires output that always validates against a schema. What is the correct approach? |
| `cca-f-foundation-024` | Short context | Extraction is accurate for common cases and fails on rare formats. What is the most effective response? |
| `cca-f-foundation-025` | Short context | What should a schema define for a field the source document may not contain? |
| `cca-f-foundation-026` | Short context | Which practice most improves consistency across a long-running structured extraction job? |
| `cca-f-foundation-027` | Short context | A prompt mixes the instruction, the data, and the output format in continuous prose. What is the first improvement? |
| `cca-f-foundation-028` | Recall | What is the strongest indicator that a tool surface needs redesign? |
| `cca-f-foundation-029` | Short context | How should a tool that performs an irreversible action be designed? |
| `cca-f-foundation-030` | Short context | A tool returns a large payload that consumes most of the context window. What is the right change? |
| `cca-f-foundation-031` | Short context | What belongs in a tool's description? |
| `cca-f-foundation-032` | Short context | A long agentic run degrades in quality as it proceeds. What is the most likely cause? |
| `cca-f-foundation-033` | Recall | What is the right way to carry state across a compaction boundary? |
| `cca-f-foundation-034` | Short context | Which measure most improves reliability for a workflow that must not silently produce wrong output? |
| `cca-f-foundation-035` | Short context | What should be measured to know whether a production agentic system is healthy? |
| `cca-f-cca-016` | Short context | How should you evaluate the performance of an agentic system that processes customer support tickets? |
| `cca-f-cca-021` | Recall | What is the primary risk of giving an agent unrestricted access to all available tools without any permission boundaries? |
| `cca-f-cca-024` | Short context | In the ReAct pattern, what happens in the 'Observe' step? |
| `cca-f-cca-026` | Short context | When implementing a token budget for an agentic system, what should happen when the budget is nearly exhausted? |
| `cca-f-cca-030` | Recall | What is the primary advantage of the orchestrator-worker pattern over a single monolithic agent for complex tasks? |
| `cca-f-cca-035` | Short context | In a coordinator-subagent architecture, a subagent fails unexpectedly. According to best practices, where should error handling occur first? |
| `cca-f-cca-043` | Short context | Your agent is tasked with 'add comprehensive tests to a legacy codebase.' Which decomposition strategy is most appropriate? |
| `cca-f-cca-045` | Short context | You want to explore two different refactoring approaches from the same codebase analysis baseline. Which feature should you use? |
| `cca-f-cca-048` | Short context | Your agentic loop sets a maximum of 3 iterations as the primary stopping mechanism. Why is this problematic? |
| `cca-f-cca-050` | Short context | Your coordinator evaluates the synthesis agent's output and finds gaps in coverage. What should it do? |
| `cca-f-cca-051` | Short context | You are configuring an AgentDefinition for a document analysis subagent. Which properties should you set? |
| `cca-f-cca-053` | Short context | When should you use prompt chaining (fixed sequential pipeline) versus dynamic adaptive decomposition for task breakdown? |
| `cca-f-cca-055` | Short context | Your research coordinator prompts its subagents with detailed step-by-step procedural instructions. A colleague suggests using goal-oriented prompts instead. Why? |
| `cca-f-cca-056` | Short context | How do tool results from previous iterations influence the agent's next action in an agentic loop? |
| `cca-f-cca-057` | Short context | What distinguishes model-driven decision-making from pre-configured decision trees in agentic systems? |
| `cca-f-cca-058` | Short context | Your research coordinator assigns each of 4 subagents the same broad research topic. What problem does this create? |
| `cca-f-cca-059` | Short context | Why should all subagent communication be routed through the coordinator rather than allowing direct peer-to-peer communication? |
| `cca-f-cca-102` | Short context | You need to monitor a long-running agent that processes documents over several hours. What monitoring instrumentation is most important? |
| `cca-f-cca-104` | Short context | When multiple agents share access to the same external database, what concurrency control issue must your architecture explicitly address? |
| `cca-f-cca-110` | Short context | You are implementing Claude's tool use API. What is the correct sequence of steps in the tool use flow? |
| `cca-f-cca-114` | Short context | Claude needs to check inventory and pricing simultaneously for a product availability request. How should you enable this? |
| `cca-f-cca-116` | Short context | Your tool returns an error when called. How should you format the error in the tool_result message to Claude? |
| `cca-f-cca-118` | Short context | Your agent can delete customer records using a tool. How should you implement side-effect management for this dangerous operation? |
| `cca-f-cca-120` | Recall | What is MCP (Model Context Protocol) and why does it matter? |
| `cca-f-cca-121` | Short context | In the MCP architecture, what are the roles of hosts, clients, and servers? |
| `cca-f-cca-122` | Short context | MCP defines three types of primitives. What are Resources, Tools, and Prompts in the MCP context? |
| `cca-f-cca-124` | Short context | When building an MCP server, what is the most important security principle to follow? |
| `cca-f-cca-125` | Short context | A tool designed to send emails should be idempotent where possible. What does this mean in practice? |
| `cca-f-cca-128` | Short context | In a tool_result message, how should you handle a large result that might consume too many tokens? |
| `cca-f-cca-129` | Short context | You want to ensure your MCP server validates all incoming tool call parameters. What validation should you implement? |
| `cca-f-cca-131` | Short context | Your agentic system uses three tools: read_file, write_file, and delete_file. What audit logging should you implement? |
| `cca-f-cca-133` | Short context | An MCP tool returns {isError: true} with a generic message 'Operation failed'. Why is this problematic for the agent? |
| `cca-f-cca-140` | Short context | Your .mcp.json file needs to reference a GitHub token without committing the secret. How should you handle this? |
| `cca-f-cca-141` | Short context | Your MCP server exposes a content catalog listing available issue summaries and database schemas. Why is this useful? |
| `cca-f-cca-142` | Short context | When should you choose an existing community MCP server over building a custom one? |
| `cca-f-cca-147` | Recall | Which tool should you use to search for all callers of a specific function across a codebase? |
| `cca-f-cca-148` | Short context | The Edit tool fails because the old_string you provided matches multiple locations in the file. What's the correct fallback? |
| `cca-f-cca-149` | Short context | You're building codebase understanding incrementally. What's the recommended approach? |
| `cca-f-cca-155` | Short context | You want to ensure the agent always calls extract_metadata before any enrichment tools. Which tool_choice configuration achieves this? |
| `cca-f-cca-158` | Recall | What is the difference between MCP Resources and MCP Tools? |
| `cca-f-cca-189` | Short context | Where should you configure which tools Claude Code is allowed to use and which require explicit approval? |
| `cca-f-cca-191` | Recall | How does Claude Code's memory system work across different conversations? |
| `cca-f-cca-194` | Short context | Your team uses a monorepo with a frontend, backend, and shared library. How should you structure CLAUDE.md files? |
| `cca-f-cca-198` | Recall | How does the .claude/settings.json hierarchy work when there are settings at both the project level and the user level? |
| `cca-f-cca-201` | Short context | A developer uses the /review slash command. What does this command do? |
| `cca-f-cca-205` | Recall | What is the relationship between Claude Code's git integration and CLAUDE.md rules? |
| `cca-f-cca-209` | Short context | Why are path-specific rules in .claude/rules/ preferred over directory-level CLAUDE.md files for conventions like test files? |
| `cca-f-cca-212` | Short context | A skill in .claude/skills/ produces verbose output that pollutes the main conversation context. How should you configure it? |
| `cca-f-cca-222` | Short context | Claude Code generates low-quality tests that duplicate existing test scenarios. How can you improve test generation quality? |
| `cca-f-cca-234` | Short context | Your automated code review leaves duplicate comments when re-running after new commits are pushed. How should you address this? |
| `cca-f-cca-236` | Short context | The same Claude session that generated code is asked to review it. Why might this produce lower-quality reviews? |
| `cca-f-cca-238` | Short context | When should you provide concrete input/output examples instead of prose descriptions when working with Claude Code? |
| `cca-f-cca-251` | Recall | What does running /init in a new project directory cause Claude Code to do? |
| `cca-f-cca-269` | Short context | When designing a tool_use JSON schema for a search function, how should you handle an optional 'date_range' parameter? |
| `cca-f-cca-279` | Short context | A many-shot prompt for sentiment analysis contains 100 examples. What is a potential downside of including so many examples? |
| `cca-f-cca-287` | Short context | You need guaranteed JSON output that conforms to a specific schema. What is the most reliable approach? |
| `cca-f-cca-292` | Short context | Your batch processing job has failures on 50 out of 10,000 documents. How should you handle resubmission? |
| `cca-f-cca-293` | Short context | Before batch-processing 10,000 documents, you want to maximize first-pass success rates. What preparation step is recommended? |
| `cca-f-cca-295` | Short context | You need consistent severity classification (critical, major, minor) for code review findings. How do you achieve reliable classification? |
| `cca-f-cca-303` | Short context | Your structured finding output includes a detected_pattern field alongside the issue description. Why is this useful? |
| `cca-f-cca-305` | Short context | You design a self-correction validation flow that extracts both calculated_total and stated_total from invoices. Why extract both? |
| `cca-f-cca-335` | Recall | What is the key difference between zero-shot and few-shot prompting in terms of when to choose each? |
| `cca-f-cca-342` | Short context | How is a conversation structured when sending it to the Messages API? |
| `cca-f-cca-351` | Short context | Your team is concerned about a model update changing behavior in production. What deployment strategy minimizes risk? |
| `cca-f-cca-356` | Short context | Your production Claude application experiences intermittent failures. What observability setup should you have in place? |
| `cca-f-cca-357` | Short context | A high-availability system using Claude needs to handle API outages gracefully. What pattern should be implemented? |
| `cca-f-cca-360` | Short context | Your multi-turn conversation agent's performance degrades after 50+ exchanges. The context window isn't full yet. What's happening? |
| `cca-f-cca-361` | Short context | When handing off context between agents in a multi-agent system, what's the most important consideration? |
| `cca-f-cca-362` | Short context | Your agent encounters a tool that returns a transient error (HTTP 503 Service Unavailable). What's the appropriate reliability pattern? |
| `cca-f-cca-365` | Short context | You're designing a human-in-the-loop workflow for a financial agent. At what point should human review be triggered? |
| `cca-f-associate-198` | Short context | Which condition should route a ticket to escalate_to_human rather than continue autonomous resolution? |
| `cca-f-associate-199` | Short context | The agent sometimes calls get_customer when it should call lookup_order. What is the most effective change? |
| `cca-f-associate-200` | Short context | Backend conventions should apply only when backend files are touched. Where do they belong? |
| `cca-f-associate-201` | Short context | When is plan mode the appropriate choice over direct execution? |
| `cca-f-associate-205` | Short context | A subagent fails permanently on one source. What should the coordinator receive? |
| `cca-f-associate-206` | Short context | The reviewer must emit results a pipeline can parse. Which invocation is correct? |
| `cca-f-associate-207` | Short context | Reviews flag many low-value style nits and engineers now ignore them. Which change addresses this? |
| `cca-f-associate-208` | Short context | Some invoices legitimately lack a delivery date. How should the schema express this? |
| `cca-f-associate-209` | Short context | Which loop gives the most reliable extraction output? |
| `cca-f-associate-210` | Short context | Your team reports 97% accuracy measured only on records that passed validation. Why is that number misleading? |
| `cca-f-associate-211` | Short context | A pipeline has four steps whose order never varies and whose outputs are each checkable. What should it be? |
| `cca-f-associate-212` | Recall | What is the principal cost of introducing a subagent? |
| `cca-f-associate-213` | Short context | An autonomous step would modify production data. What does the architecture require? |
| `cca-f-associate-214` | Short context | What most helps diagnose an agentic failure after the fact? |
| `cca-f-associate-215` | Short context | Where should repository-wide conventions for Claude Code live? |
| `cca-f-associate-216` | Short context | Which task is best suited to headless Claude Code in CI? |
| `cca-f-associate-217` | Recall | What is a hook for? |
| `cca-f-associate-218` | Short context | A pipeline needs output that always conforms to a fixed shape. What is the correct mechanism? |
| `cca-f-associate-219` | Short context | How should a schema handle a value the source may not contain? |
| `cca-f-associate-220` | Short context | Extraction succeeds on typical inputs and fails on unusual ones. What is the most effective response? |
| `cca-f-associate-221` | Recall | What is the clearest sign that a tool surface needs redesign rather than better prompting? |
| `cca-f-associate-222` | Short context | How should a tool that deletes records be constrained? |
| `cca-f-associate-223` | Short context | An MCP integration exposes an entire database through one general query tool. What is the architectural concern? |
| `cca-f-associate-224` | Short context | Quality degrades steadily through a long agentic run. What is the most likely cause? |
| `cca-f-associate-225` | Short context | What must happen for state to survive a compaction boundary? |
| `cca-f-associate-226` | Short context | An agentic design calls the same expensive tool repeatedly with identical arguments. What does this indicate? |
| `cca-f-associate-227` | Short context | What determines whether two lines of work belong in separate subagents? |
| `cca-f-associate-228` | Short context | Which design most reduces the cost of a wrong autonomous decision? |
| `cca-f-associate-229` | Short context | A CLAUDE.md has grown to several thousand lines. What is the likely effect? |
| `cca-f-associate-230` | Short context | What should be true of a skill before it is committed to a shared repository? |
| `cca-f-associate-231` | Short context | Why is committed configuration preferable to per-developer configuration for team conventions? |
| `cca-f-associate-232` | Short context | A schema-validated response fails validation once in every few hundred calls. What is the correct handling? |
| `cca-f-associate-233` | Recall | What is the advantage of validating structured output at the boundary rather than downstream? |
| `cca-f-associate-234` | Short context | A structured extraction must record where in the source each value came from. What does this require? |
| `cca-f-associate-235` | Short context | Two tools do nearly the same thing with different names. What is the architectural fault? |
| `cca-f-associate-236` | Short context | What should a tool do when given arguments it cannot satisfy? |
| `cca-f-associate-237` | Short context | An MCP tool exposes a write operation that the use case never needs. What should happen? |
| `cca-f-associate-238` | Recall | What is the earliest reliable signal that context management has failed in a long run? |
| `cca-f-associate-239` | Short context | Why is a defined success criterion necessary for a reliable agentic system? |
| `cca-f-associate-240` | Short context | A reliability requirement says wrong output must never reach the user unnoticed. What does the design need? |
| `cca-f-guide-017` | Short context | Scenario: What value of stop_reason indicates that Claude has finished its task and no more tool calls are needed? |
| `cca-f-guide-018` | Short context | Scenario: In an agentic loop, what is the primary role of an iteration cap? |
| `cca-f-guide-019` | Short context | Scenario: In a hub-and-spoke orchestration pattern, how does inter-agent communication flow? |
| `cca-f-guide-020` | Short context | Scenario: Which hook type runs after a tool has executed but before the model processes the results? |
| `cca-f-guide-021` | Short context | Scenario: In the Claude Agent SDK, what is the purpose of the tools property in an AgentDefinition? |
| `cca-f-guide-023` | Short context | Scenario: What is the purpose of fork_session in Claude Code? |
| `cca-f-guide-024` | Short context | Scenario: In a structured human-in-the-loop handoff, which of the following is a required component of the escalation payload? |
| `cca-f-guide-078` | Short context | Scenario: What message format does the Model Context Protocol (MCP) use for communication between clients and servers? |
| `cca-f-guide-081` | Short context | Scenario: In Claude Code, which built-in tool is specifically designed to search for patterns within file contents? |
| `cca-f-guide-082` | Short context | Scenario: What is the recommended maximum number of tools per agent to maintain reliable tool selection? |
| `cca-f-guide-125` | Short context | Scenario: What does an `@./path/to/file.md` line in a CLAUDE.md do? |
| `cca-f-guide-127` | Short context | Scenario: What does the allowedTools configuration control in Claude Code? |
| `cca-f-guide-129` | Short context | Scenario: What does the --output-format flag control when running Claude Code in CI/CD pipelines? |
| `cca-f-guide-181` | Short context | Scenario: Why does using tool_use for structured output provide stronger guarantees than prompt-based JSON extraction? |
| `cca-f-guide-183` | Short context | Scenario: What is the primary cost benefit of the Message Batches API, and what is the trade-off? |
| `cca-f-guide-184` | Short context | Scenario: Why does asking Claude to review its own output within the same conversation session produce unreliable reviews? |
| `cca-f-guide-185` | Short context | Scenario: In a multi-step prompt chain, what should happen between each step to maintain pipeline reliability? |
| `cca-f-guide-221` | Short context | Scenario: What is the 'progressive summarisation trap' in the context of managing long conversations with Claude? |
| `cca-f-guide-222` | Short context | Scenario: What is the primary purpose of scratchpad files in the context of long-running Claude Code agent sessions? |
| `cca-f-guide-229` | Short context | Scenario: In Claude's token budget, which components compete for space within the context window? |
| `cca-f-certyiq-ccdv-f-042` | Short context | A team wants stable automated pull request review results from Claude Code. Which method best supports automation? |
| `cca-f-calm-001` | Short context | An agent sometimes calls `process_refund` before `verify_customer`. The prompt already says to verify first. What is the best fix? |
| `cca-f-calm-005` | Short context | When a customer support case moves to a human agent, what should the handoff contain? |
| `cca-f-calm-009` | Short context | A team repo needs an MCP server that requires an API token. How should it be configured? |
| `cca-f-calm-010` | Short context | Your automated CI reviewer flags many trivial style issues and developers are ignoring it. What is best? |
| `cca-f-calm-011` | Short context | Some contracts contain no termination date, and the model keeps inventing one during structured extraction. What should you change? |
| `cca-f-calm-012` | Short context | Validation fails because the invoice number is missing from the source document. Three retries fail the same way. Why? |
| `cca-f-calm-013` | Short context | Which workload is the best fit for the Message Batches API? |
| `cca-f-calm-015` | Short context | `analyze_content` and `analyze_document` have near-identical descriptions and the agent confuses them. What is the best fix? |
| `cca-f-calm-016` | Short context | Every request must return data through a specific extraction schema, with no chatty text. How do you set `tool_choice`? |
| `cca-f-calm-018` | Short context | After a long chat is summarised, the agent forgets the order number and refund amount. What is best? |
| `cca-f-calm-019` | Short context | A lookup tool returns 40 fields, but the task needs 5. Context fills quickly. What do you do? |
| `cca-f-calm-020` | Short context | Which situation is the strongest reason for an agent to escalate to a human? |
| `cca-f-calm-022` | Short context | A subagent's search times out. What should it return? |
| `cca-f-sample5-005` | Short context | Long-running agent task near context limit with ~15% remaining; needs 3 more tool calls. Best strategy to preserve continuity? |
| `cca-f-community-d1-002` | Short context | A coordinator agent needs to pass customer information to a subagent. What is the correct approach? |
| `cca-f-community-d2-001` | Short context | An agent has 18 tools configured and is frequently selecting the wrong tool. What is the most effective solution? |
| `cca-f-community-d2-002` | Short context | A search tool returns an empty array. What should the agent communicate to the user? |
| `cca-f-community-d2-003` | Short context | Where should MCP server credentials be stored in a project using `.mcp.json`? |
| `cca-f-community-d3-003` | Short context | A CI pipeline needs to run Claude Code for automated code review. Which flag is essential? |
| `cca-f-community-d4-001` | Short context | A code review system flags "use your best judgment" as a criterion for reporting issues. What should be changed? |
| `cca-f-community-d4-003` | Short context | A batch processing job has 1,000 documents. 50 fail. What's the correct approach? |
| `cca-f-community-d5-004` | Short context | Two research subagents return different values for the same metric. What should the coordinator do? |
| `cca-f-community-d5-006` | Short context | An agentic workflow keeps getting truncated mid-task when it hits `max_tokens`. Which mechanism lets the model pace itself instead? |
