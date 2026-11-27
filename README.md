# iLoveShare

> **Every feeling deserves a beautiful way to be shared.**

iLoveShare is a premium digital celebration and personalized surprise platform. Create beautiful, interactive experiences — birthday surprises, anniversary messages, love timelines, invitations, and more — and share them with the people who matter most.

---

## ✨ Features

- 🎂 **Birthday Experiences** — Animated cake, blow-out candles, Happy Birthday music
- 💌 **Personalized Messages** — Rich text, photos, audio, and PDF attachments
- 🎴 **Scratch Card Reveals** — Hidden messages revealed by touch or mouse
- 💫 **Love Timeline** — Visual milestone journeys for anniversaries and relationships
- 🎉 **Animation Effects** — Confetti, floating hearts, balloons, flowers, fireworks
- 📅 **Countdown Gate** — Experiences unlock only on the scheduled date
- 🔒 **Passcode Protection** — Optional PIN lock for private surprises
- 🌐 **Public Shareable Links** — Recipients open experiences without an account
- 📊 **Dashboard & Analytics** — Track views, responses, and ratings
- 🌙 **Light & Dark Theme** — Fully responsive on all screen sizes

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Validation | Zod |
| Fonts | Playfair Display · DM Sans · Cormorant Garamond |
| Deployment | Vercel |

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/shubham-devx/iLoveshare.git
cd iLoveshare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase project credentials (see `.env.example` for details).

### 4. Apply database migrations

Run the SQL files in `supabase/migrations/` in order via the Supabase SQL editor:

1. `001_initial_schema.sql`
2. `002_extended_schema.sql`

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, forgot/reset password
│   ├── (public)/        # Marketing pages
│   ├── api/             # API routes (experiences, responses, upload, contact)
│   ├── dashboard/       # Authenticated dashboard
│   └── e/[token]/       # Public experience viewer
├── components/
│   ├── create/          # Multi-step creation wizard
│   ├── creative/        # Interactive components (cake, scratch card, etc.)
│   ├── dashboard/       # Dashboard UI
│   ├── experience/      # Public experience viewer
│   └── ui/              # Shared UI components
├── lib/                 # Supabase client, validations, utilities
└── types/               # TypeScript types
supabase/
└── migrations/          # SQL schema + RLS policies
```

## 🔐 Environment Variables

See [`.env.example`](.env.example) for all required variables. **Never commit `.env.local`.**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (`https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

## 📄 License

MIT
