declare global {
  namespace PrismaJson {
    type TriviaQuestion = {
      question: string;
      options: string;
      answer_index: number;
    };
  }
}

export {PrismaJson};
