export const removeTriviaAnswers = (
  questions: PrismaJson.TriviaQuestion[],
): PrismaJson.TriviaQuestionWithoutAnswer[] => {
  return questions.map(({answer_index: _, ...rest}) => rest);
};
