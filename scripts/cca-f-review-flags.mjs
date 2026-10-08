// Decisions against the July 2026 CCAR-F v1.0 exam guide.
// The first 51 pairs are copies of the same numbered source question; keep the
// richer cca-f-prep version. For the other five, keep the clean associate copy.
export const duplicateSuffixes = '001 002 003 004 005 007 008 009 010 016 021 023 024 027 040 045 046 047 051 052 053 062 069 076 078 081 101 104 105 106 107 108 109 113 119 120 129 133 141 143 144 146 159 160 161 162 163 164 166 169 170'.split(' ');

export const duplicatePairs = [
  ...duplicateSuffixes.map(suffix => [`cca-f-prep-${suffix}`, `cca-f-cca-prep-170-qu-${suffix}`]),
  ['cca-f-associate-163', 'cca-f-foundation-003'],
  ['cca-f-associate-164', 'cca-f-foundation-004'],
  ['cca-f-associate-165', 'cca-f-foundation-005'],
  ['cca-f-associate-168', 'cca-f-foundation-008'],
  ['cca-f-associate-169', 'cca-f-foundation-009']
];

export const unusableIds = '012 013 041 052 067 069'.split(' ').map(suffix => `cca-f-archeval-${suffix}`);

export const malformedSourceItems = [
  { id: 'cca-f-certyiq-018', reason: 'The stem ends with broken document identifiers and does not form a complete question.' },
  { id: 'cca-f-certyiq-022', reason: 'The final question clause is missing words, so the required control boundary is unclear.' },
  { id: 'cca-f-certyiq-023', reason: 'A tool operation and part of the observed failure are truncated in the supplied source.' }
];

export const scopeExclusions = [
  { id: 'cca-f-prep-089', reason: 'Detailed cache-hit debugging is outside the blueprint; the keyed cause also ignores per-model cache invalidation.' },
  { id: 'cca-f-cca-015', reason: 'When to enable extended thinking has no mapped task statement in the exam blueprint.' },
  { id: 'cca-f-cca-077', reason: 'When to enable extended thinking has no mapped task statement in the exam blueprint.' },
  { id: 'cca-f-cca-176', reason: 'MCP resource subscription protocol details have no mapped task statement in the exam blueprint.' },
  { id: 'cca-f-cca-204', reason: 'JetBrains IDE plugin feature recall has no mapped task statement in the exam blueprint.' },
  { id: 'cca-f-cca-267', reason: 'Numeric temperature selection for creative writing has no mapped task statement.' },
  { id: 'cca-f-cca-278', reason: 'Numeric temperature selection has no mapped task statement; low temperature does not establish factual accuracy.' },
  { id: 'cca-f-cca-277', reason: 'Custom stop-sequence syntax has no mapped task statement; the keyed code fence would stop at its opening fence.' },
  { id: 'cca-f-cca-283', reason: 'Many-shot versus few-shot selection is beyond the guide\'s targeted few-shot objective.' },
  { id: 'cca-f-cca-331', reason: 'General chain-of-thought prompting has no mapped task statement in the exam blueprint.' },
  { id: 'cca-f-cca-339', reason: 'Marketing-copy style guidance has no mapped task statement in the architect blueprint.' },
  { id: 'cca-f-cca-352', reason: 'API pricing calculations are explicitly out of scope.' },
  { id: 'cca-f-cca-353', reason: 'RAG chunking, hybrid retrieval, and reranking implementation are outside the listed objectives.' },
  { id: 'cca-f-cca-374', reason: 'Batch-window arithmetic yields at least two viable answers: both a 4-hour and a 6-hour submission interval fit the stated 30-hour SLA.' },
  { id: 'cca-f-cca-394', reason: 'Per-user prompt-cache architecture is beyond the guide\'s high-level caching allowance; its blanket claim about per-user caching is also incorrect.' },
  { id: 'cca-f-cca-400', reason: 'Cloud-provider deployment and data-residency configuration are outside the blueprint; the keyed answer does not meet the stated cannot-leave-infrastructure constraint.' },
  { id: 'cca-f-community-d2-005', reason: 'Model-specific Fable 5.1 migration behavior is beyond the guide\'s tool-choice objective.' },
  { id: 'cca-f-community-d4-004', reason: 'Model-specific thinking and temperature migration behavior has no mapped task statement.' },
  { id: 'cca-f-community-d5-007', reason: 'Model-specific thinking-block prefix mechanics exceed the guide\'s context-management tasks.' },
  { id: 'cca-f-certyiq-ccar-p-093', reason: 'First-launch operating-system permission dialogs for an MCP server test hosting/setup, not an Architect Foundations task statement.' }
];

export const reviewFlags = new Map([
  ...duplicatePairs.map(([keep, exclude]) => [exclude, { code: 'duplicate', duplicateOf: keep }]),
  ...unusableIds.map(id => [id, { code: 'unusable-options', reason: 'All four choices are literal letter placeholders.' }]),
  ...malformedSourceItems.map(({ id, reason }) => [id, { code: 'malformed-source', reason }]),
  ...scopeExclusions.map(({ id, reason }) => [id, { code: 'exam-scope-or-key', reason }])
]);

if (reviewFlags.size !== duplicatePairs.length + unusableIds.length + malformedSourceItems.length + scopeExclusions.length) {
  throw new Error('Overlapping CCA-F review flags need a manual decision');
}
