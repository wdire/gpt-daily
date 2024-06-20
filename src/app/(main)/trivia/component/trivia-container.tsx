"use client";

import {RightIcon} from "@/components/icons";
import {useState} from "react";
import {TriviaFnType, TriviaQuestionFnType, TriviaQuestionStat} from "@/types/trivia.type";
import TriviaQuestion from "./trivia-question";

type TriviaContainerProps = {
  questionsWithoutAnswers: PrismaJson.TriviaQuestionWithoutAnswer[];
  triviaFn: TriviaFnType;
};

const TriviaContainer = ({questionsWithoutAnswers, triviaFn}: TriviaContainerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionStats, setQuestionStats] = useState<TriviaQuestionStat[]>(
    Array(questionsWithoutAnswers.length)
      .fill({})
      .map(() => {
        return {
          selection: null,
          correct: null,
          correctIndex: null,
        };
      }),
  );

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questionsWithoutAnswers.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex - 1 >= 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const questionSelectAnswer: TriviaQuestionFnType["questionSelectAnswer"] = async ({
    optionIndex,
  }: {
    optionIndex: number;
  }) => {
    const question = await triviaFn.getQuestion({
      questionIndex: currentQuestionIndex,
    });

    setQuestionStats((prevState) => {
      const newState = [...prevState];
      newState[currentQuestionIndex] = {
        ...newState[currentQuestionIndex],
        correct: question.answer_index === optionIndex,
        selection: optionIndex,
        correctIndex: question.answer_index,
      };
      return newState;
    });

    return question.answer_index;
  };

  const triviaQuestionFn: TriviaQuestionFnType = {
    questionSelectAnswer,
  };

  return (
    <div className="flex h-screen items-center">
      <div className="w-[600px] max-w-full mx-auto px-4">
        <div className="text-center mb-7 text-4xl">
          Daily Trivia Corner
          <div className="text-xl italic">
            with <span className="text-green-600/80">ChatGPT</span>
          </div>
        </div>
        <div className="bg-neutral-200 rounded-lg pl-4 mb-5 text-xl flex items-center justify-between">
          <div className="py-3">
            <span className="font-medium">Question {currentQuestionIndex + 1}</span>
            <small>/{questionsWithoutAnswers.length}</small>
          </div>

          <div className="flex items-center">
            <button className="p-2.5 square-btn-hover cursor-pointer" onClick={prevQuestion}>
              <div className="w-7 h-7 -rotate-180">
                <RightIcon />
              </div>
            </button>
            <button className="p-2.5 square-btn-hover cursor-pointer" onClick={nextQuestion}>
              <div className="w-7 h-7">
                <RightIcon />
              </div>
            </button>
          </div>
        </div>
        <div className="">
          <TriviaQuestion
            questionWithoutAnswer={questionsWithoutAnswers[currentQuestionIndex]}
            triviaQuestionFn={triviaQuestionFn}
            questionStat={questionStats[currentQuestionIndex]}
          />
        </div>
      </div>
    </div>
  );
};

export default TriviaContainer;
