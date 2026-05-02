"use client"

import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { syncActivities } from "@/app/actions/strava/sync"

function decodePolyline(encoded: string) {
  let index = 0
  let lat = 0
  let lng = 0
  const coordinates: Array<[number, number]> = []

  while (index < encoded.length) {
    let shift = 0
    let result = 0
    let byte = null

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1
    lat += deltaLat

    shift = 0
    result = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1
    lng += deltaLng

    coordinates.push([lat / 1e5, lng / 1e5])
  }

  return coordinates
}

function toSvgPoints(coords: Array<[number, number]>, size = 300) {
  if (coords.length === 0) return ""

  const lats = coords.map((c) => c[0])
  const lngs = coords.map((c) => c[1])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const scaleX = size / (maxLng - minLng || 1)
  const scaleY = size / (maxLat - minLat || 1)

  return coords
    .map(([lat, lng]) => {
      const x = (lng - minLng) * scaleX
      const y = size - (lat - minLat) * scaleY
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
}

export default function RunCoreDashboard() {
  const { data: session, status: authStatus } = useSession()
  const [status, setStatus] = useState("")
  const [polyline, setPolyline] = useState<string | null>(null)

  const handleStravaSync = async () => {
    setStatus("Syncing activities...")
    const result = await syncActivities()
    if (result.success) {
      setStatus(`Synced ${result.count ?? 0} activities`)
      await loadLatestRoute()
    } else {
      setStatus("Sync failed. Check connection.")
    }
  }

  const loadLatestRoute = async () => {
    const q = query(
      collection(db, "activities"),
      orderBy("startDate", "desc"),
      limit(1)
    )
    const snap = await getDocs(q)
    if (!snap.empty) {
      const data = snap.docs[0].data()
      setPolyline(data.routePolyline ?? null)
    }
  }

  useEffect(() => {
    if (session) {
      loadLatestRoute()
    }
  }, [session])

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-[#0e7452]">
        LOADING...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-black text-[#0e7452]">RUN CORE</h1>
          <p className="text-gray-400">Connect your Strava account</p>
          <Button
            onClick={() => signIn("strava")}
            className="h-12 bg-[#FC5200] px-10 text-lg font-bold text-white hover:bg-[#e34402]"
          >
            Connect with Strava
          </Button>
        </div>
      </div>
    )
  }

  const points = polyline ? toSvgPoints(decodePolyline(polyline)) : ""

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] p-6 text-white">
      <div className="w-full max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-black text-[#0e7452]">RUN CORE</h1>
        <p className="text-sm text-gray-400">
          Welcome back, {session.user?.name}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={handleStravaSync}
            className="h-10 bg-[#FC5200] font-bold text-white hover:bg-[#e34402]"
          >
            Sync Strava
          </Button>
          <Button
            onClick={() => signOut()}
            variant="ghost"
            className="text-xs text-gray-500 hover:text-white"
          >
            Logout
          </Button>
        </div>

        {status && (
          <div className="rounded-full bg-[#0e7452] px-4 py-2 text-xs font-bold uppercase">
            {status}
          </div>
        )}

        {polyline && points && (
          <div className="mx-auto mt-6 w-[320px] rounded-lg border border-[#2d3136] bg-[#111] p-4">
            <svg width="300" height="300" viewBox="0 0 300 300">
              <polyline
                points={points}
                fill="none"
                stroke="#FC5200"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
