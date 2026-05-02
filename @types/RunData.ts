export type RunData = {
  stravaId: number
  name: string
  distance: string
  movingTime: number
  type: string
  startDate: string
  pace?: number
  heartRate?: number
  syncedAt: string
  routePolyline: string | null
}
