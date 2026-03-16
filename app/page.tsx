"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import Image from "next/image"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Server Actions
import { generateWeeklyPlan } from "@/app/actions/generatePlan"
import { syncLatestRun } from "@/app/actions/stravaSync"

export default function RunCoreDashboard() {
  const { data: session, status: authStatus } = useSession()

  const [profile, setProfile] = useState({
    primaryGoal: "21km Half Marathon",
    age: 21,
    height: 170,
    weight: 70,
    pbDistance: "10km",
    pbTime: "01:00:00",
    runsPerWeek: "3",
    targetDate: "",
    isProgressive: true,
    programWeeks: "12",
  })

  const [status, setStatus] = useState("")
  const [plan, setPlan] = useState<any[]>([])
  const [lastRun, setLastRun] = useState<any>(null)

  useEffect(() => {
    if (session?.user?.id) {
      const loadUserData = async () => {
        const userRef = doc(db, "users", session.user.id)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          if (data.profile) setProfile(data.profile)
          if (data.currentPlan) setPlan(data.currentPlan)
        }
      }
      loadUserData()
    }
  }, [session])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Saving athlete metrics...")
    try {
      const userRef = doc(db, "users", session.user.id!)
      await setDoc(userRef, { profile }, { merge: true })
      setStatus("Success: Profile updated.")
    } catch (error) {
      setStatus("Error: Failed to save.")
    }
  }

  const handleGenerate = async () => {
    setStatus("Consulting AI Coach...")
    const result = await generateWeeklyPlan(profile)
    if (result.success) {
      setPlan(result.plan)
      setStatus("Coach updated your plan!")
    } else {
      setStatus("AI Error: Check logs.")
    }
  }

  const handleStravaSync = async () => {
    setStatus("Syncing activities...")
    const result = await syncLatestRun()
    if (result.success) {
      setLastRun(result.run)
      setStatus(`Synced: ${result.run.name}`)
    } else {
      setStatus("Sync failed. Check connection.")
    }
  }

  if (authStatus === "loading")
    return (
      <div className="flex min-h-screen animate-pulse items-center justify-center bg-[#0d1117] text-[#0e7452]">
        BOOTING RUN CORE...
      </div>
    )

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-black text-[#0e7452]">RUN CORE</h1>
          <p className="text-gray-400">Multi-User AI Training Portal</p>
          {/* COMPLIANCE 1.1: Official Strava Orange #FC5200 and height 48px */}
          <Button
            onClick={() => signIn("strava")}
            className="h-[48px] bg-[#FC5200] px-10 text-lg font-bold text-white hover:bg-[#e34402]"
          >
            Connect with Strava
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#0d1117] p-6 font-sans text-white">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#2d3136] pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-[#0e7452]">
              RUN CORE
            </h1>
            <p className="text-sm text-gray-400">
              Welcome back, {session.user.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* COMPLIANCE 1.1: Unified "Connect with Strava" button text */}
            <Button
              onClick={handleStravaSync}
              className="h-[40px] bg-[#FC5200] font-bold text-white hover:bg-[#e34402]"
            >
              Connect with Strava
            </Button>
            <Button
              onClick={handleGenerate}
              variant="outline"
              className="h-[40px] border-[#0e7452] text-[#0e7452] hover:bg-[#0e7452] hover:text-white"
            >
              Update AI Plan
            </Button>
            <Button
              onClick={() => signOut()}
              variant="ghost"
              className="text-xs text-gray-500 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-[#2d3136] bg-[#211f24] text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-[10px] tracking-widest text-gray-400 uppercase">
                  Athlete Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <Label className="text-[9px] text-gray-500 uppercase">
                      Primary Goal
                    </Label>
                    <Input
                      value={profile.primaryGoal}
                      onChange={(e) =>
                        setProfile({ ...profile, primaryGoal: e.target.value })
                      }
                      className="border-[#2d3136] bg-[#0d1117]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[9px] text-gray-500 uppercase">
                        Age
                      </Label>
                      <Input
                        type="number"
                        value={profile.age}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            age: parseInt(e.target.value),
                          })
                        }
                        className="border-[#2d3136] bg-[#0d1117]"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] text-gray-500 uppercase">
                        Weight (kg)
                      </Label>
                      <Input
                        type="number"
                        value={profile.weight}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            weight: parseInt(e.target.value),
                          })
                        }
                        className="border-[#2d3136] bg-[#0d1117]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[9px] text-gray-500 uppercase">
                      Runs Per Week
                    </Label>
                    <Select
                      value={profile.runsPerWeek}
                      onValueChange={(val) =>
                        setProfile({ ...profile, runsPerWeek: val })
                      }
                    >
                      <SelectTrigger className="border-[#2d3136] bg-[#0d1117]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="4">4 Days</SelectItem>
                        <SelectItem value="5">5 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-xs text-gray-300">
                      Progressive Build
                    </Label>
                    <Switch
                      checked={profile.isProgressive}
                      onCheckedChange={(val) =>
                        setProfile({ ...profile, isProgressive: val })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#0e7452] font-bold hover:bg-[#0c6346]"
                  >
                    Update Stats
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Latest Activity Display */}
            {lastRun && (
              <Card className="border-[#2d3136] bg-[#211f24] text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-[10px] tracking-widest text-[#FC5200] uppercase">
                    Latest Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-lg font-bold">{lastRun.name}</p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-gray-400">Distance:</span>
                      <span className="font-mono text-[#6ee7b7]">
                        {lastRun.distance} km
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Time:</span>
                      <span className="font-mono">
                        {Math.floor(lastRun.movingTime / 60)}m{" "}
                        {lastRun.movingTime % 60}s
                      </span>
                    </div>
                  </div>

                  {/* COMPLIANCE 3.0: Required "View on Strava" link format */}
                  <a
                    href={`https://www.strava.com/activities/${lastRun.stravaId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs font-bold text-[#FC5200] underline hover:opacity-80"
                  >
                    View on Strava
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-200">
              Weekly Training Block
            </h2>

            {plan && plan.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {plan.map((run, i) => (
                  <div
                    key={i}
                    className="group relative flex flex-col rounded-xl border border-[#2d3136] bg-[#161b22] p-5 shadow-sm transition-all hover:border-[#0e7452]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest text-[#0e7452] uppercase">
                        {run.day}
                      </span>
                      <span className="rounded-full bg-[#0e7452]/20 px-3 py-1 text-[9px] font-bold text-[#6ee7b7] uppercase">
                        {run.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black">{run.distance}km</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {run.description}
                    </p>
                    {run.focus && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase">
                          {run.focus}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2d3136] text-gray-500">
                <p className="font-medium">No training data detected.</p>
                <p className="text-center text-xs">
                  Click <span className="text-[#0e7452]">Update AI Plan</span>{" "}
                  to let the coach build your schedule.
                </p>
              </div>
            )}

            {/* COMPLIANCE 1.2: Attribution Section */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-[#2d3136] pt-8 opacity-60 grayscale transition-all hover:grayscale-0">
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                Compatible with Strava
              </span>
              <div className="relative h-6 w-32">
                {/* Place api_logo_pwrdBy_strava_horiz_light.png in your /public folder */}
                <Image
                  src="/api_logo_pwrdBy_strava_horiz_light.png"
                  alt="Powered by Strava"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className="fixed right-6 bottom-6 animate-in slide-in-from-bottom-4">
          <div
            className={`rounded-full px-6 py-3 text-[10px] font-black uppercase shadow-2xl ${status.includes("Error") ? "bg-red-600" : "bg-[#0e7452]"} text-white`}
          >
            {status}
          </div>
        </div>
      )}
    </div>
  )
}
