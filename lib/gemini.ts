import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const runCoachModel = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
  },
})

// NOTE: This is an example prompt. The actual prompt is dynamically
// constructed in the `generateWeeklyPlan` server action.
export const COACH_PROMPT = `
  You are 'Run Core Coach', an expert running coach for a 21-year-old IT student.
  Generate a 1-week training block for a 21km race goal.
  
  CONSTRAINTS:
  - Exactly 3 runs per week.
  - All runs must be completed before 12:00 PM (to shower before 1 PM work).
  - Include one Interval session (focus on 1km repeats).
  
  OUTPUT FORMAT (Strict JSON):
  [
    { "day": "Tuesday", "type": "Interval", "distance": 8, "description": "8x1km repeats at goal pace", "focus": "Speed" },
    ...
  ]
`
