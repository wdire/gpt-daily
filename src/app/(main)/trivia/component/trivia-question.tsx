"use client";

import {cn} from "@/lib/cn";
import {TriviaQuestionFnType, TriviaQuestionStat} from "@/types/trivia.type";

type TriviaQuestionProps = {
  questionWithoutAnswer: PrismaJson.TriviaQuestionWithoutAnswer;
  triviaQuestionFn: TriviaQuestionFnType;
  questionStat: TriviaQuestionStat;
};

const TriviaQuestion = ({
  questionWithoutAnswer,
  triviaQuestionFn,
  questionStat,
}: TriviaQuestionProps) => {
  const questionSelectAnswer = async (index: number) => {
    if (questionStat.selection === null) {
      await triviaQuestionFn.questionSelectAnswer({
        optionIndex: index,
      });
    }
  };

  return (
    <div className="w-full">
      <div
        className="text-2xl md:text-4xl text-center mb-8 font-semibold rounded-xl touch-none"
        onTouchMove={(e) => e.stopPropagation()}
      >
        {questionWithoutAnswer.question}
      </div>

      <div className="flex flex-col gap-3.5">
        {questionWithoutAnswer.options.map((option, index) => {
          return (
            <button
              key={`o_${index}`}
              className={cn(
                "bg-white shadow-md w-full p-3 rounded-lg transition-all border-2 border-black/20 ease-in font-medium text-lg md:text-xl",
                {
                  "hover:bg-yellow-400 hover:border-yellow-500 active:bg-yellow-500":
                    questionStat.selection === null,

                  "opacity-60 pointer-events-none":
                    questionStat.selection !== null &&
                    questionStat.selection !== index &&
                    questionStat.correctIndex !== index,

                  "!bg-green-500/80": questionStat.correctIndex === index,

                  "bg-yellow-500":
                    questionStat.selection === index && questionStat.correctIndex === null,

                  "!bg-red-500/80":
                    questionStat.selection === index && questionStat.correct === false,
                },
              )}
              onClick={() => {
                questionSelectAnswer(index);
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TriviaQuestion;
