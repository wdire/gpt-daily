import {DBCreateTrivia, GPTGenerateTrivia} from "@/actions/trivia.action";
import type {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const triviaResponse = await GPTGenerateTrivia();

    console.info("CHATGPT TRIVIA RESPONSE:", triviaResponse);

    if (!triviaResponse.choices?.[0].message.content) {
      console.error("Trivia Gpt no choice content", triviaResponse);
      throw new Error("Trivia Gpt no choice content");
    }

    const triviaResponseJson = JSON.parse(
      triviaResponse.choices[0].message.content,
    ) as PrismaJson.TriviaQuestion[];

    if (await DBCreateTrivia(triviaResponseJson)) {
      return Response.json({success: true, triviaResponse});
    }
    throw Error("Trivia couldn't create prisma");
  } catch (err) {
    console.error("Trivia generate error:", err);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
