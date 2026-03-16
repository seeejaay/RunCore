import NextAuth from "next-auth"
import StravaProvider from "next-auth/providers/strava"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

const handler = NextAuth({
  providers: [
    StravaProvider({
      clientId: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read,activity:read_all" },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const userRef = doc(db, "users", token.sub!)
        
        if (account.provider === "strava") {
          await setDoc(
            userRef,
            {
              stravaRefreshToken: account.refresh_token,
              stravaAccessToken: account.access_token,
              stravaAthleteId: account.providerAccountId,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          )
        } else if (account.provider === "google") {
          await setDoc(
            userRef,
            {
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          )
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
