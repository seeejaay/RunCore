"use server"

import { runCoachModel } from "@/lib/gemini"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { buildCoachPrompt } from "@/lib/prompts/coach"
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

    // 3. Call the AI Model
    const coachPrompt = buildCoachPrompt(userProfile)
    const result = await runCoachModel.generateContent(coachPrompt)
    const responseText = result.response.text()

    console.log("AI Response:", responseText)

    const plan = JSON.parse(responseText)
    return { success: true, plan }
  } catch (error) {
    console.error("DETAILED AI ERROR:", error)
    return { success: false, error: "Failed to generate plan" }
  }
}
