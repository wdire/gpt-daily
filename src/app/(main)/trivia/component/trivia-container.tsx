"use client";

import {RightIcon} from "@/components/icons";
import {useCallback, useEffect, useRef, useState} from "react";
import {
  TriviaFnType,
  TriviaModeType,
  TriviaQuestionFnType,
  TriviaQuestionStat,
} from "@/types/trivia.type";
import {cn} from "@/lib/cn";
import {useSwipeable} from "react-swipeable";
import TriviaQuestion from "./trivia-question";
import TriviaResults from "./trivia-results";

type TriviaContainerProps = {
  questionsWithoutAnswers: PrismaJson.TriviaQuestionWithoutAnswer[];
  triviaFn: TriviaFnType;
};

const TriviaContainer = ({questionsWithoutAnswers, triviaFn}: TriviaContainerProps) => {
  const [currentQuestionIndex, _setCurrentQuestionIndex] = useState(0);
  const currentQuestionIndexRef = useRef(0);

  const setCurrentQuestionIndex = (num: number) => {
    _setCurrentQuestionIndex(num);
    currentQuestionIndexRef.current = num;
  };

  const [questionStats, _setQuestionStats] = useState<TriviaQuestionStat[]>(
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
  const questionStatsRef = useRef<TriviaQuestionStat[]>(questionStats);

  const setQuestionStats = (newQuestionStats: TriviaQuestionStat[]) => {
    _setQuestionStats(newQuestionStats);
    questionStatsRef.current = newQuestionStats;
  };

  const autoNextTimeoutRef = useRef<NodeJS.Timeout>();

  const [triviaMode, _setTriviaMode] = useState<TriviaModeType>("questions");
  const triviaModeRef = useRef<TriviaModeType>(triviaMode);

  const setTriviaMode = useCallback(
    (newTriviaMode: TriviaModeType) => {
      if (questionStatsRef.current[questionsWithoutAnswers.length - 1].selection !== null) {
        _setTriviaMode(newTriviaMode);
        triviaModeRef.current = newTriviaMode;
      }
    },
    [questionsWithoutAnswers.length],
  );

  const nextQuestion = useCallback(() => {
    if (
      currentQuestionIndexRef.current + 1 < questionsWithoutAnswers.length &&
      questionStatsRef.current?.[currentQuestionIndexRef.current]?.selection !== null &&
      triviaModeRef.current === "questions"
    ) {
      setCurrentQuestionIndex(currentQuestionIndexRef.current + 1);
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    }
  }, [questionsWithoutAnswers.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndexRef.current - 1 >= 0 && triviaModeRef.current === "questions") {
      setCurrentQuestionIndex(currentQuestionIndexRef.current - 1);
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    }
  }, []);

  const questionSelectAnswer: TriviaQuestionFnType["questionSelectAnswer"] = async ({
    optionIndex,
  }: {
    optionIndex: number;
  }) => {
    const newQuestonStatsLoading = [...questionStats];
    newQuestonStatsLoading[currentQuestionIndex] = {
      ...newQuestonStatsLoading[currentQuestionIndex],
      selection: optionIndex,
    };

    setQuestionStats(newQuestonStatsLoading);

    const question = await triviaFn.getQuestion({
      questionIndex: currentQuestionIndex,
    });

    const newQuestonStats = [...questionStats];
    newQuestonStats[currentQuestionIndex] = {
      correct: question.answer_index === optionIndex,
      selection: optionIndex,
      correctIndex: question.answer_index,
    };

    setQuestionStats(newQuestonStats);

    if (currentQuestionIndexRef.current === questionsWithoutAnswers.length - 1) {
      autoNextTimeoutRef.current = setTimeout(() => {
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

  const {ref: containerSwipeableRef} = useSwipeable({
    onSwiped: (e) => {
      if (e.dir === "Left") {
        nextQuestion();
      } else if (e.dir === "Right") {
        prevQuestion();
      } else if (e.dir === "Up") {
        setTriviaMode("results");
      } else if (e.dir === "Down") {
        setTriviaMode("questions");
      }
    },
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        nextQuestion();
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        prevQuestion();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        setTriviaMode("results");
      } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        setTriviaMode("questions");
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [nextQuestion, prevQuestion, setTriviaMode]);

  return (
    <div className="flex pb-14 items-center">
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
        <div className="overflow-hidden px-1 pb-1" ref={containerSwipeableRef}>
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
              {questionsWithoutAnswers?.map((question, index) => (
                <div
                  key={index}
                  className={cn("w-full flex-shrink-0 transition-all duration-1000 visible", {
                    "select-none pointer-events-none opacity-0 invisible":
                      currentQuestionIndex !== index,
                  })}
                >
                  {currentQuestionIndex === index ||
                  currentQuestionIndex - 1 === index ||
                  currentQuestionIndex + 1 === index ? (
                    <TriviaQuestion
                      questionWithoutAnswer={question}
                      triviaQuestionFn={triviaQuestionFn}
                      questionStat={questionStats[index]}
                    />
                  ) : (
                    <div className="w-full"></div>
                  )}
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
