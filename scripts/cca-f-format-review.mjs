// These questions test useful terms, but provide no decision context. Keep them
// in untimed practice and exclude them from exam-style mock draws until rewritten.
export const recallOnlyIds = [
  'cca-f-prep-020', 'cca-f-prep-028', 'cca-f-prep-030', 'cca-f-prep-031',
  'cca-f-prep-045', 'cca-f-prep-048', 'cca-f-prep-052', 'cca-f-prep-061',
  'cca-f-prep-062', 'cca-f-prep-063', 'cca-f-prep-064', 'cca-f-prep-067',
  'cca-f-prep-069', 'cca-f-prep-070', 'cca-f-prep-079', 'cca-f-prep-080',
  'cca-f-prep-081', 'cca-f-prep-085', 'cca-f-prep-128', 'cca-f-prep-143',
  'cca-f-foundation-012', 'cca-f-foundation-021',
  'cca-f-foundation-028', 'cca-f-foundation-033', 'cca-f-cca-021',
  'cca-f-cca-030', 'cca-f-cca-120', 'cca-f-cca-147', 'cca-f-cca-158',
  'cca-f-cca-191', 'cca-f-cca-198', 'cca-f-cca-205', 'cca-f-cca-251',
  'cca-f-cca-335', 'cca-f-associate-212', 'cca-f-associate-217',
  'cca-f-associate-221', 'cca-f-associate-233', 'cca-f-associate-238'
];

export const recallOnlySet = new Set(recallOnlyIds);

export function lacksMockContext(question) {
  const stemWords = (question.prompt || '').trim().split(/\s+/).filter(Boolean).length;
  return !String(question.scenario || '').trim() && stemWords < 20;
}

if (recallOnlySet.size !== recallOnlyIds.length) throw new Error('Duplicate recall-only ID');
