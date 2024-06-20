"use client";

import {RightIcon} from "@/components/icons";
import {useRef, useState} from "react";
import {TriviaFnType, TriviaQuestionFnType, TriviaQuestionStat} from "@/types/trivia.type";
import {cn} from "@/lib/cn";
import TriviaQuestion from "./trivia-question";
import TriviaResults from "./trivia-results";

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

  const autoNextTimeoutRef = useRef<NodeJS.Timeout>();

  const [triviaMode, setTriviaMode] = useState<"questions" | "results">("questions");

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questionsWithoutAnswers.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex - 1 >= 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
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

    if (currentQuestionIndex === questionsWithoutAnswers.length - 1) {
      setTimeout(() => {
        setTriviaMode("results");
      }, 1500);
    } else {
      autoNextTimeoutRef.current = setTimeout(() => {
        nextQuestion();
      }, 1500);
    }

    return question.answer_index;
  };

  const triviaQuestionFn: TriviaQuestionFnType = {
    questionSelectAnswer,
  };

  return (
    <div className="flex py-14 items-center">
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
            <button
              className={cn(
                "px-6 py-1 mr-2 md:mr-5 text-neutral-100 transition-all rounded-md text-lg opacity-100 scale-100",
                {
                  "opacity-0 scale-0":
                    questionStats[questionsWithoutAnswers.length - 1].selection === null,

                  "bg-green-500/80 hover:bg-green-400 active:bg-green-500":
                    triviaMode === "questions",

                  "bg-yellow-500/80 hover:bg-yellow-400 active:bg-yellow-500":
                    triviaMode === "results",
                },
              )}
              onClick={() => {
                setTriviaMode(triviaMode === "questions" ? "results" : "questions");
              }}
            >
              {triviaMode === "questions" ? "Results" : "Questions"}
            </button>

            <button
              className={cn(
                "p-2.5 square-btn-hover transition-opacity cursor-pointer select-none",
                {
                  "pointer-events-none opacity-40":
                    currentQuestionIndex === 0 || triviaMode === "results",
                },
              )}
              onClick={prevQuestion}
            >
              <div className="w-7 h-7 -rotate-180">
                <RightIcon />
              </div>
            </button>
            <button
              className={cn(
                "p-2.5 square-btn-hover transition-opacity cursor-pointer select-none ",
                {
                  "pointer-events-none opacity-40":
                    currentQuestionIndex === questionsWithoutAnswers.length - 1 ||
                    questionStats[currentQuestionIndex].selection === null ||
                    triviaMode === "results",
                },
              )}
              onClick={nextQuestion}
            >
              <div className="w-7 h-7">
                <RightIcon />
              </div>
            </button>
          </div>
        </div>
        <div className="overflow-hidden px-1 pb-1">
          <div
            className={cn(
              "w-full flex-col gap-16 transition-transform duration-500 ease-in-out relative",
            )}
            style={{
              transform: `${triviaMode === "results" ? "translateY(calc(-100% - 16px))" : ""}`,
            }}
          >
            <div
              className={cn("w-full flex gap-16 transition-all duration-500 ease-in-out", {
                "invisible opacity-0": triviaMode !== "questions",
              })}
              style={{
                transform: `translateX(calc(-${currentQuestionIndex}00% - ${currentQuestionIndex * 64}px))`,
              }}
            >
              {questionsWithoutAnswers.map((question, index) => (
                <div
                  key={index}
                  className={cn("w-full flex-shrink-0 transition-all duration-1000 visible", {
                    "select-none pointer-events-none opacity-0 invisible":
                      currentQuestionIndex !== index,
                  })}
                >
                  <TriviaQuestion
                    questionWithoutAnswer={question}
                    triviaQuestionFn={triviaQuestionFn}
                    questionStat={questionStats[index]}
                  />
                </div>
              ))}
            </div>

            <div
              className={cn(
                "absolute w-full visible opacity-100 transition-all duration-500 mt-5",
                {
                  "invisible opacity-0": triviaMode !== "results",
                },
              )}
            >
              <TriviaResults questionStats={questionStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaContainer;
