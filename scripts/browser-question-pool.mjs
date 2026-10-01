export function publishedQuestionsForExam(questions, examId) {
  return questions.filter(question =>
    question.status === 'released' || (examId === 'cca-f' && question.status === 'ready')
  );
}

export function mockQuestionsForExam(questions, examId) {
  return publishedQuestionsForExam(questions, examId).filter(question => question.mockEligible === true);
}
