export type StravaActivity = {
  id: number
  name: string
  distance: number
  moving_time: number
  type: string
  start_date: string
  average_heartrate?: number
  average_speed?: number
  map?: {
    summary_polyline?: string
    polyline?: string
  }
}
