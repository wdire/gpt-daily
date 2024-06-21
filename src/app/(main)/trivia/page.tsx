import {getDailyTrivia} from "@/app/(main)/trivia/actions/trivia.action";
import {TriviaFnType} from "@/types/trivia.type";
import {Metadata} from "next";
import {redirect} from "next/navigation";
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
    return null;
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
