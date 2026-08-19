# Folio — Portfolio Generator

Build a premium, production-ready personal portfolio in minutes. Enter your
details, choose a design, and publish to a unique public URL you can share with
recruiters, clients, and companies.

Built as a polished SaaS product: guided onboarding, a real-time editor with a
live preview, AI content enhancement, multi-tenant public portfolios, and a
dashboard with analytics.

## Features

- **Guided onboarding** — a multi-step form with autosave that never loses data.
- **Live editor** — split-screen real-time preview, drag-and-drop section
  reordering, show/hide sections, accent/font/motion customization, undo/redo.
- **AI enhancement** — sharpen your bio, project, and experience copy with Groq
  (results are always editable; nothing is fabricated).
- **Flagship "Atelier" template** — an editorial, magazine-style design that
  renders entirely from your data. Empty sections hide automatically.
- **Publish to a unique URL** — real-time username availability, reserved-route
  and offensive-word protection, smart suggestions.
- **Public portfolios** — server-rendered from the database with full SEO
  (dynamic metadata, Open Graph, Twitter cards, JSON-LD Person schema, sitemap,
  robots) and cookieless view analytics.
- **Dashboard** — manage portfolios (edit, publish, duplicate, delete), copy /
  share (LinkedIn, X, WhatsApp, Facebook, email, QR code), and view analytics.
- **Auth** — email/password (Auth.js), with Google/GitHub ready to enable.

## Tech stack

- **Next.js 15** (App Router, RSC, Server Actions) · **TypeScript**
- **Tailwind CSS v4** (design tokens) · **Framer Motion**
- **Prisma** + **PostgreSQL** (Supabase) · **Auth.js** (NextAuth v5)
- **Supabase Storage** · **Groq** (AI) · **Zustand** + **zundo** (editor state)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run db:push              # create the database schema
npm run dev                  # http://localhost:3000
```

### Environment variables

See [.env.example](.env.example). You'll need a Supabase project (database +
storage), an `AUTH_SECRET` (`npx auth secret`), and a Groq API key for AI.

## Architecture

- **One data model** — a single Zod schema (`lib/portfolio/schema.ts`) is the
  source of truth for the form, live preview, every template, and AI.
- **Content ≠ presentation** — the same data renders through any template via a
  registry (`components/portfolio/registry.tsx`) and a single
  `PortfolioRenderer`. New templates require no route changes.
- **Multi-tenant** — one deployment serves every portfolio from a dynamic
  `/[username]` route, ready to extend to subdomains and custom domains.

## Deploy

Deploys to **Vercel**. Set the environment variables from `.env.example` in the
Vercel project settings, using the Supabase **transaction pooler** connection
string for `DATABASE_URL`. `prisma generate` runs automatically on install.
