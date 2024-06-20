export const removeTriviaAnswers = (
  questions: PrismaJson.TriviaQuestion[],
): PrismaJson.TriviaQuestionWithoutAnswer[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return questions.map(({answer_index: _, ...rest}) => rest);
};
