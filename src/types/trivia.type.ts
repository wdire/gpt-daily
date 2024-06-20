export type TriviaFnType = {
  getQuestion: ({questionIndex}: {questionIndex: number}) => Promise<PrismaJson.TriviaQuestion>;
};

export type TriviaQuestionFnType = {
  questionSelectAnswer: ({optionIndex}: {optionIndex: number}) => Promise<number>;
};

export type TriviaQuestionStat = {
  selection: number | null;
  correct: boolean | null;
  correctIndex: number | null;
};

export type TriviaModeType = "questions" | "results";
