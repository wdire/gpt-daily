import gemini from "@/lib/gemini";
import openai from "@/lib/openai";
import {TriviaAI, TriviaAIResponse} from "@/types/trivia.type";

export const AIGenerateTrivia = async ({
  ai = "gemini",
}: {
  ai: TriviaAI;
}): Promise<TriviaAIResponse> => {
  let triviaQuestions: PrismaJson.TriviaQuestion[] | false = false;

  try {
    if (ai === "chatgpt") {
      triviaQuestions = await GPTGenerateTrivia();
    } else if (ai === "gemini") {
      triviaQuestions = await GeminiGenerateTrivia();
    }

    if (!triviaQuestions) {
      throw new Error("Couldn't generate trivia questions");
    }

    return {
      success: true,
      ai,
      content: triviaQuestions,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      ai,
      error: err,
    };
  }
};

export const GPTGenerateTrivia = async (): Promise<PrismaJson.TriviaQuestion[]> => {
  console.info("GPTGenerateTrivia run");
  const gptResponse = await openai.chat.completions.create({
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

  console.info("CHATGPT TRIVIA RESPONSE:", gptResponse);

  const gptText = gptResponse.choices?.[0].message.content;

  if (!gptText) {
    console.error("Trivia Gpt no choice content", gptResponse);
    throw new Error("Trivia Gpt no choice content");
  }

  const triviaResponseJson = JSON.parse(gptText) as PrismaJson.TriviaQuestion[];

  return triviaResponseJson;
};

export const GeminiGenerateTrivia = async (): Promise<PrismaJson.TriviaQuestion[]> => {
  console.info("GeminiGenerateTrivia run");
  const geminiResponse = await gemini.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "You are a trivia question generator that only replies with valid, iterable RFC8259 compliant JSON. Generate 10 new questions about various questions in a humorous way about topics like: random general culture, random internet culture, random entertainment culture. Not so easy questions. Generate proper questions that require knowledge or tough logic to solve, not some weird shit questions. Without option labels(A., B.) just options. Create 4 options. Make sure answers are correct. Make sure you are creating new questions, not re-using previous ones, enjoyable experience every time. Respond proper JSON without whitespaces following this format: [{question:string, options:string[], answer_index:number}]",
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  console.info("GEMINI TRIVIA RESPONSE:", geminiResponse);

  const geminiText = geminiResponse.response.text();

  if (!geminiText) {
    console.error("Trivia Gemini no choice content", geminiResponse);
    throw new Error("Trivia Gemini no choice content");
  }

  const triviaResponseJson = JSON.parse(geminiText) as PrismaJson.TriviaQuestion[];

  return triviaResponseJson;
};
