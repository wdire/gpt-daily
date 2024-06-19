import openai from "@/lib/openai";
import prisma from "@/lib/prisma";
import {ChatCompletion} from "openai/resources/index.mjs";

export const getDailyTrivia = () => {
  return prisma.trivia.findFirst();
};

export const GPTGenerateTrivia = async (): Promise<ChatCompletion> => {
  console.info("GPTGenerateTrivia run");
  const gptCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content:
          "You are a trivia question generator that only replies with valid, iterable RFC8259 compliant JSON. Generate 5 trivia questions with choices and answer on various topics in a humorous way that makes peoples day but not so easy. Respond without whitespaces following this format: [{question:string, options:string[], answer_index:number}]",
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
