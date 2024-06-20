import {TriviaQuestionStat} from "@/types/trivia.type";
import React, {useMemo} from "react";

const TriviaResults = ({questionStats}: {questionStats: TriviaQuestionStat[]}) => {
  const stats = useMemo(() => {
    const newStat = {
      correct: 0,
      wrong: 0,
    };

    questionStats.forEach((questionStat) => {
      if (questionStat.correct) {
        newStat.correct += 1;
      } else {
        newStat.wrong += 1;
      }
    });

    return newStat;
  }, [questionStats]);

  return (
    <div>
      <div className="text-5xl text-center font-medium">Results</div>
      <div className="flex justify-around mt-10">
        <div className="flex-col gap-6 justify-center relative w-[130px] md:w-[150px]">
          <div className="text-5xl sm:text-6xl font-bold text-center text-green-500">Correct</div>
          <div className="text-7xl md:text-8xl font-bold text-center text-green-100">
            {stats.correct}
          </div>
          <div className="absolute w-10/12 h-full bg-green-300 top-0 left-1/2 -translate-x-1/2 skew-x-12 -z-10 rounded-lg"></div>
        </div>
        <div className="flex-col gap-6 justify-center relative w-[130px] md:w-[150px]">
          <div className="text-5xl sm:text-6xl font-bold text-center text-red-500">Wrong</div>
          <div className="text-7xl md:text-8xl font-bold text-center text-red-100">
            {stats.wrong}
          </div>
          <div className="absolute w-10/12 h-full bg-red-300 top-0 left-1/2 -translate-x-1/2 -skew-x-12 -z-10 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default TriviaResults;
