export async function fetchLatestStravaRun() {
  const tokenReponse = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  })
  const tokenData = await tokenReponse.json()
  const accessToken = tokenData.access_token

  const activitiesResponse = await fetch(
    "https://www.strava.com/api/v3/athlete/activities",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  const activities = await activitiesResponse.json()
  const latestActivity = activities[0]
  return latestActivity
}
