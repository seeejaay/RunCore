"use server"

import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  limit,
} from "firebase/firestore"

export async function syncLatestRun() {
  try {
    // 1. Pull the Refresh Token for your personal account
    const userRef = doc(db, "users", "carl_user")
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return { success: false, error: "Please connect Strava first." }
    }

    const { stravaRefreshToken } = userSnap.data()

    // 2. Refresh the Access Token
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: stravaRefreshToken,
        grant_type: "refresh_token",
      }),
    })

    const tokenData = await tokenResponse.json()

    // 3. Handle Token Rotation
    if (
      tokenData.refresh_token &&
      tokenData.refresh_token !== stravaRefreshToken
    ) {
      await updateDoc(userRef, { stravaRefreshToken: tokenData.refresh_token })
    }

    // 4. Fetch only the LATEST 1 activity from Strava
    const activityResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=1`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    )

    const activities = await activityResponse.json()

    if (!activities || activities.length === 0) {
      return {
        success: true,
        isNew: false,
        message: "No activities found on Strava.",
      }
    }

    const latestActivity = activities[0]

    // 5. Only process if it's a Run
    if (latestActivity.type !== "Run") {
      return {
        success: true,
        isNew: false,
        message: "Latest activity was not a run.",
      }
    }

    // 6. Check if this specific run already exists in Firestore
    const q = query(
      collection(db, "activities"),
      where("stravaId", "==", latestActivity.id),
      limit(1)
    )
    const existing = await getDocs(q)

    if (existing.empty) {
      const runData = {
        stravaId: latestActivity.id,
        name: latestActivity.name,
        distance: (latestActivity.distance / 1000).toFixed(2), // Meters to KM
        movingTime: latestActivity.moving_time, // Seconds
        type: latestActivity.type,
        startDate: latestActivity.start_date,
        syncedAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "activities"), runData)
      return { success: true, isNew: true, run: runData }
    }

    // Run already exists
    return {
      success: true,
      isNew: false,
      run: {
        name: latestActivity.name,
        distance: (latestActivity.distance / 1000).toFixed(2),
        movingTime: latestActivity.moving_time,
      },
    }
  } catch (error) {
    console.error("Sync failed:", error)
    return { success: false, error: "Failed to connect to Strava." }
  }
}
