import {getDailyTrivia} from "@/actions/trivia.action";

export const dynamic = "force-dynamic";

const Home = async () => {
  const dailyTrivia = await getDailyTrivia();

  return (
    <main>
      <div>hello ai</div>
      <pre>{JSON.stringify(dailyTrivia, null, 1)}</pre>
    </main>
  );
};

export default Home;
