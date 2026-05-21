export type StravaTokenPayload = {
  refresh_token: string
  athlete?: {
    id: number
  }
}
