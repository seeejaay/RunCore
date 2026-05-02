import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  setDoc,
  limit,
} from "firebase/firestore"

import type { StravaActivity } from "@/@types/StravaActivity"
import { RunData } from "@/@types/RunData"

export async function saveActivities(activities: StravaActivity[]) {
  for (const activity of activities) {
    const q = query(
      collection(db, "activities"),
      where("stravaId", "==", activity.id),
      limit(1)
    )

    const existing = await getDocs(q)
    if (!existing.empty) {
      continue
    }

    const runData: RunData = {
      stravaId: activity.id,
      name: activity.name,
      distance: (activity.distance / 1000).toFixed(2), // Meters to KM
      movingTime: activity.moving_time, // Seconds
      type: activity.type,
      startDate: activity.start_date,
      pace: activity.average_speed,
      syncedAt: new Date().toISOString(),
      routePolyline: activity.map?.summary_polyline ?? null,
    }

    if (activity.average_heartrate !== undefined) {
      runData.heartRate = activity.average_heartrate
    }

    const docRef = doc(db, "activities", String(activity.id))

    await setDoc(docRef, runData, { merge: true })
  }
}
