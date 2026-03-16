import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }),
    })

    const data = await response.json()

    if (data.errors || !data.refresh_token) {
      console.error("Strava Exchange Error:", data)
      return NextResponse.json({ error: "Invalid exchange" }, { status: 400 })
    }

    // Initialize/Update the user's master keys in Firestore
    const userRef = doc(db, "users", "carl_user")
    await setDoc(
      userRef,
      {
        stravaRefreshToken: data.refresh_token,
        athleteId: data.athlete?.id || "unknown",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )

    console.log("✅ Master Refresh Token saved to Firestore.")

    // Redirect to home so the user sees their dashboard
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Callback Error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
