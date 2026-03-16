"use server"

import { COACH_PROMPT, runCoachModel } from "@/lib/gemini"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function generateWeeklyPlan() {
  try {
    // 1. Fetch User Profile from Firestore
    const userRef = doc(db, "users", "carl_user")
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return { success: false, error: "User profile not found." }
    }

    // NOTE: This assumes the user's profile has this structure.
    // We'll need to ensure the profile gets saved this way elsewhere.
    const userProfile = userSnap.data().profile || {}
    const {
      age = 21, // Default values from original prompt
      goal = "21km",
      programWeeks = 12,
      frequency = 3,
      tenKmTime = "50 minutes",
      weight = 75,
      height = 180,
    } = userProfile

    // 2. Dynamically construct the prompt
    const personalizedPrompt = `
      You are 'Run Core Coach', an expert running coach.
      Generate a 1-week training block for a person with the following characteristics:
      - Age: ${age}
      - Weight: ${weight} kg
      - Height: ${height} cm
      - Goal Race: ${goal}
      - Total Program Length: ${programWeeks} weeks
      - Current 10km Personal Best: ${tenKmTime}
      
      CONSTRAINTS:
      - Exactly ${frequency} runs per week.
      - All runs must be completed before 12:00 PM.
      - Include a mix of run types (e.g., Easy, Long, Interval, Tempo).
      
      OUTPUT FORMAT (Strict JSON):
      [
        { "day": "Tuesday", "type": "Interval", "distance": 8, "description": "e.g., 8x1km repeats at goal pace", "focus": "Speed" },
        ...
      ]
    `

    // 3. Call the AI Model
    const result = await runCoachModel.generateContent(COACH_PROMPT)
    const responseText = result.response.text()

    console.log("AI Response:", responseText)

    const plan = JSON.parse(responseText)
    return { success: true, plan }
  } catch (error) {
    console.error("DETAILED AI ERROR:", error)
    return { success: false, error: "Failed to generate plan" }
  }
}
