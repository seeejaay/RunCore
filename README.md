# RunCore

RunCore is a personal running dashboard that connects to Strava, syncs
activities, and renders your latest route in a clean, minimal UI.

## Features

- Strava OAuth sign-in and activity sync
- Stores tokens and activities in Firebase Firestore
- Renders the latest route polyline on the dashboard
- Tailwind v4 + shadcn/ui styling
- NextAuth session handling

## Tech Stack

- Next.js 16 (App Router)
- React 19
- NextAuth
- Firebase (Firestore)
- Tailwind CSS v4 + shadcn/ui
- next-themes

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Environment Variables

Create a `.env.local` file with:

```bash
# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret

# Strava
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase (client config)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Optional utility (if you use the Strava helper in lib/strava.ts)
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_REFRESH_TOKEN=your_strava_refresh_token
```

### 3) Run

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint
npm run typecheck # TypeScript check
npm run format    # Prettier format
```

## Notes

- Strava sync stores activity data in Firestore.
- The dashboard renders the latest route as an SVG polyline.

## License

MIT
