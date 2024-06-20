import {getDailyTrivia} from "@/app/(main)/trivia/actions/trivia.action";
import {TriviaFnType} from "@/types/trivia.type";
import TriviaContainer from "./component/trivia-container";
import {removeTriviaAnswers} from "./utils/removeTriviaAnswers";

export const dynamic = "force-dynamic";

const TriviaPage = async () => {
  const dailyTrivia = await getDailyTrivia();
  const dailyTriviaWithoutAnswers = removeTriviaAnswers(dailyTrivia?.questions || []);

  if (!dailyTrivia) {
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
