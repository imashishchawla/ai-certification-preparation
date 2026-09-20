/**
 * Domain keywords and patterns for Claude Certified Architect - Foundations (CCA-F)
 */
export const domainKeywords = {
  'D1 Agentic Architecture & Orchestration': [
    'agentic loop', 'agent loop', 'orchestration', 'orchestrator-workers',
    'subagent', 'stop_reason', 'tool_use', 'end_turn', 'handoff',
    'task decomposition', 'agent sdk', 'session management', 'evaluator-optimizer',
    'autonomous agent', 'workflow enforcement', 'hierarchical agent'
  ],
  'D2 Tool Design & MCP Integration': [
    'model context protocol', 'mcp', 'mcp server', 'mcp client',
    'tool schema', 'tool definition', 'json schema', 'input_schema',
    'structured error', 'tools/list', 'tools/call', 'stdio transport',
    'sse transport', 'tool distribution', 'read_resource', 'annotations'
  ],
  'D3 Claude Code Configuration & Workflows': [
    'claude code', 'claude.md', '.claudeignore', 'slash command',
    'skills', 'hooks', 'cli reference', 'plan mode', 'compact',
    'pr review', 'git integration', 'terminal command', 'permissions'
  ],
  'D4 Prompt Engineering & Structured Output': [
    'system prompt', 'few-shot', 'prompt chaining', 'structured output',
    'json mode', 'xml tags', 'thinking block', 'validation loop',
    'batch api', 'prompt caching', 'cache_control', 'ephemeral',
    'zero-shot', 'chain-of-thought', 'cot'
  ],
  'D5 Context Management & Reliability': [
    'context window', 'context compaction', 'message history',
    'token budget', 'truncation', 'error recovery', 'fallback',
    'escalation', 'human in the loop', 'hallucination', 'provenance',
    'rate limit', 'backoff', 'retry loop', 'max_tokens'
  ]
};

/**
 * Checks whether content is relevant to the CCA-F exam and determines its best-fit domain.
 */
export function checkExamRelevance(content, threshold = 2) {
  if (!content || typeof content !== 'string') {
    return { isRelevant: false, domain: null, score: 0 };
  }

  const lower = content.toLowerCase();
  let maxScore = 0;
  let bestDomain = 'D1 Agentic Architecture & Orchestration';

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  }

  const isRelevant = maxScore >= threshold;
  return {
    isRelevant,
    domain: isRelevant ? bestDomain : null,
    score: maxScore
  };
}
