import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const runCoachModel = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
  },
})
