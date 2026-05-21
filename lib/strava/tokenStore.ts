import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import type { StravaTokenPayload } from "@/@types/StravaTokenPayload"

export async function saveStravaMasterToken(
  userId: string,
  tokenData: StravaTokenPayload
) {
  const updatedAt = new Date().toISOString()
  const userRef = doc(db, "users", userId)
  await setDoc(
    userRef,
    {
      stravaRefreshToken: tokenData.refresh_token,
      athleteId: tokenData.athlete,
      updatedAt,
    },
    { merge: true }
  )
}
