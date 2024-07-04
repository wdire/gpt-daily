import {DBCreateTrivia} from "@/app/(main)/trivia/actions/trivia.action";
import {AIGenerateTrivia} from "@/app/(main)/trivia/actions/trivia.ai";
import type {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const triviaAIResponse = await AIGenerateTrivia({ai: "gemini"});

    if (!triviaAIResponse.success) {
      return new Response(
        typeof triviaAIResponse.error === "string"
          ? triviaAIResponse.error
          : "Internal Server Error",
        {
          status: 500,
        },
      );
    }

    if (await DBCreateTrivia(triviaAIResponse.content)) {
      return Response.json({success: true, triviaResponse: triviaAIResponse.content});
    }
    throw Error("Trivia couldn't create prisma");
  } catch (err) {
    console.error("Trivia generate error:", err);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
