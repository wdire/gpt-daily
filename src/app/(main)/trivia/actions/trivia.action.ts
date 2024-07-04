import prisma from "@/lib/prisma";
import {cache} from "react";

export const getDailyTrivia = cache(async () => {
  const response = await prisma.trivia.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  return response;
});

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
