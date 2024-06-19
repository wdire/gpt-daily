import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_TOKEN,
});

export default openai;
