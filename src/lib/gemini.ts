import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_TOKEN);

const gemini = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

export default gemini;
