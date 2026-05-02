import { StravaActivity } from "@/@types/StravaActivity"
import type { StravaTokenData } from "@/@types/StravaTokenData"

export async function refreshAccessToken(
  refreshToken: string
): Promise<StravaTokenData> {
  const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error("Failed to refresh access token")
  }

  return tokenResponse.json()
}

export async function fetchAllActivities(accessToken: string) {
  const all: StravaActivity[] = []
  let page = 1
  const perPage = 200

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch activities on page ${page}`)
    }

    const batch = (await res.json()) as StravaActivity[]
    const runs = batch.filter((a) => a.type === "Run")
    if (batch.length === 0 || runs.length === 0) break

    all.push(...runs)

    page++
  }

  return all
}
