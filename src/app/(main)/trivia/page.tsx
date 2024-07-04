import {getDailyTrivia} from "@/app/(main)/trivia/actions/trivia.action";
import {TriviaFnType} from "@/types/trivia.type";
import {Metadata} from "next";
import TriviaContainer from "./component/trivia-container";
import {removeTriviaAnswers} from "./utils/removeTriviaAnswers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trivia",
};

const TriviaPage = async () => {
  const dailyTrivia = await getDailyTrivia();
  const dailyTriviaWithoutAnswers = removeTriviaAnswers(dailyTrivia?.questions || []);

  if (!dailyTrivia?.questions?.length) {
    return (
      <main className="bg-neutral-100">
        <div className="text-center text-xl">
          <div>There is no Trivia data good enough for you 😔</div>{" "}
          <div>There must be a problem.</div>
        </div>
      </main>
    );
  }

  const getQuestion: TriviaFnType["getQuestion"] = async ({
    questionIndex,
  }: {
    questionIndex: number;
  }) => {
    "use server";

    return dailyTrivia.questions?.[questionIndex];
  };

  const triviaFn: TriviaFnType = {
    getQuestion,
  };

  return (
    <main className="bg-neutral-100">
      <TriviaContainer questionsWithoutAnswers={dailyTriviaWithoutAnswers} triviaFn={triviaFn} />
    </main>
  );
};

export default TriviaPage;
