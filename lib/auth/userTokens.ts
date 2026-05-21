import { doc, setDoc } from "firebase/firestore"
import type { Account } from "next-auth"
import { db } from "@/lib/firebase"

export async function save0AuthTokens(userId: string, account: Account) {
  const userRef = doc(db, "users", userId)
  const updatedAt = new Date().toISOString()
  await setDoc(userRef, { ...account }, { merge: true })

  if (account.provider === "strava") {
    await setDoc(
      userRef,
      {
        stravaRefreshToken: account.refresh_token,
        stravaAccessToken: account.access_token,
        stravaAthleteId: account.providerAccountId,
        updatedAt,
      },
      { merge: true }
    )
  } else if (account.provider === "google") {
    await setDoc(
      userRef,
      {
        googleAccessToken: account.access_token,
        googleRefreshToken: account.refresh_token,
        updatedAt,
      },
      { merge: true }
    )
  }
}
