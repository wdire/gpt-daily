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
          "You are a trivia question generator that only replies with valid, iterable RFC8259 compliant JSON. Generate 10 new questions about various questions in a humorous way about topics like: random general culture, random internet culture, random entertainment culture. Not so easy questions. Generate proper questions that require knowledge or tough logic to solve, not some weird shit questions. Without option labels(A., B.) just options. Create 4 options. Make sure answers are correct. Make sure you are creating new questions, enjoyable experience every time. Respond proper JSON without whitespaces following this format: [{question:string, options:string[], answer_index:number}]",
      },
    ],
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    temperature: 0.7,
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
