import NextAuth, { type NextAuthOptions } from "next-auth"
import StravaProvider from "next-auth/providers/strava"
import GoogleProvider from "next-auth/providers/google"
import { save0AuthTokens } from "@/lib/auth/userTokens"
export const authOptions: NextAuthOptions = {
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
      if (account && token.sub) {
        await save0AuthTokens(token.sub, account)
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
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
