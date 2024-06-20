import openai from "@/lib/openai";
import prisma from "@/lib/prisma";
import {ChatCompletion} from "openai/resources/index.mjs";
import {cache} from "react";

export const getDailyTrivia = cache(async () => {
  const response = await prisma.trivia.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  return response;
});

export const GPTGenerateTrivia = async (): Promise<ChatCompletion> => {
  console.info("GPTGenerateTrivia run");
  const gptCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content:
          "You are a trivia question generator that only replies with valid, iterable RFC8259 compliant JSON. Generate 10 trivia questions with choices and answer on various topics in a humorous, jokeful, maybe stand up way that can make people's day. Without option labels(A., B.) just options. Create 4 options. Make sure answers are correct and not generic or re-used questions, I will ask you daily so generate new questions each time. Respond without whitespaces following this format: [{question:string, options:string[], answer_index:number}]",
      },
    ],
    temperature: 0.8,
  });

  return gptCompletion;
};

export const DBCreateTrivia = async (questions: PrismaJson.TriviaQuestion[]) => {
  try {
    await prisma.trivia.create({
      data: {
        questions,
      },
    });

    return true;
  } catch (err) {
    console.error("DBCreateTrivia prisma error:", err);

    return false;
  }
};
