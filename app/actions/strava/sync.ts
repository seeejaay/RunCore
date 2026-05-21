"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { refreshAccessToken, fetchAllActivities } from "./client"
import { saveActivities } from "../firebase/activityRepo"
import {
  getUserRefreshToken,
  updateUserRefreshToken,
} from "../firebase/userRepo"

export async function syncActivities() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId || typeof userId !== "string") {
      return { success: false, error: "User not authenticated." }
    }

    const refreshToken = await getUserRefreshToken(userId)
    if (!refreshToken) {
      return { success: false, error: "Please connect Strava first." }
    }

    const tokenData = await refreshAccessToken(refreshToken)

    if (tokenData.refresh_token && tokenData.refresh_token !== refreshToken) {
      await updateUserRefreshToken(userId, tokenData.refresh_token)
    }

    const activities = await fetchAllActivities(tokenData.access_token)
    if (!activities || activities.length === 0) {
      return { success: true, isNew: false, message: "No activities found." }
    }

    await saveActivities(activities)

    return { success: true, isNew: true, count: activities.length }
  } catch (error) {
    console.error("Sync failed:", error)
    return { success: false, error: "Failed to connect to Strava." }
  }
}
