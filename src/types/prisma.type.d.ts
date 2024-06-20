declare global {
  namespace PrismaJson {
    type TriviaQuestion = {
      question: string;
      options: string[];
      answer_index: number;
    };

    type TriviaQuestionWithoutAnswer = Omit<TriviaQuestion, "answer_index">;
  }
}

export {PrismaJson};
