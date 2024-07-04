-- CreateTable
CREATE TABLE "Trivia" (
    "id" TEXT NOT NULL,
    "questions" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trivia_pkey" PRIMARY KEY ("id")
);
