import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function getUserRefreshToken(userId: string) {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    return null
  }

  return userSnap.data().stravaRefreshToken as string | undefined
}

export async function updateUserRefreshToken(userId: string, newToken: string) {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, { stravaRefreshToken: newToken })
}

export async function getLastSyncTimestamp(userId: string) {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    return null
  }

  return userSnap.data().lastSyncTimestamp as number | undefined
}

export async function setLastSyncTimestamp(userId: string, ts: number) {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, { lastSyncTimestamp: ts })
}
