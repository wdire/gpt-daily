import prisma from "@/lib/prisma";

export const getDailyTrivia = () => {
  return prisma.trivia.findFirst();
};
