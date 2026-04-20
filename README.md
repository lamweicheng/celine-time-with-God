# Time with God

Time with God is a calm devotional web app built with Next.js, Tailwind CSS, Prisma, and PostgreSQL. It centers on Scripture reading through the official ESV API, chapter notes, prayer journaling, bookmarks, and reading progress.

## Features

- Full-screen welcome overlay with a prayer prompt and optional ambient sound.
- Dashboard with devotion shortcuts, reading progress, streaks, recent notes, and journal previews.
- Daily devotion view driven by a selectable reading plan.
- Bible browser with canonical books, chapter completion states, bookmarks, and chapter notes.
- Prayer journal with create, edit, delete, and dated entries.
- Settings for theme, font size, ambience preference, preferred landing page, and devotion plan.

## Environment variables

Create a local `.env` from `.env.example` and provide:

```bash
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."
ESV_API_KEY="your-esv-api-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

The app does not preload or store Bible text. Scripture passages are fetched on demand from the official ESV API.

At runtime, the app needs `DATABASE_URL`. `DIRECT_URL` is used for Prisma migrations and deploy-time schema commands.

## Local development

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

If `DATABASE_URL` and `DIRECT_URL` are set but the Prisma tables have not been created yet, the app now falls back to a read-only default state instead of crashing. To enable saved settings, notes, bookmarks, and journal entries, apply the Prisma migrations.

## Deployment

The app is set up for Vercel deployment. Configure `DATABASE_URL`, `DIRECT_URL`, and `ESV_API_KEY` in Vercel and run `npm run prisma:deploy` during your deployment flow.