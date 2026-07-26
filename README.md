# flujoo chat

Internal dashboard for flujoo's team to monitor and manage the WhatsApp AI bot conversations, leads, and appointment requests. This is not a public product — it's a team-only operational tool.

## Features

- **Team login gate** — a single shared password protects the dashboard behind a signed, HMAC-SHA256 session cookie (see `src/app/login`).
- **WhatsApp chats** — a conversation list (`Sidebar`) paired with a message thread (`ChatPanel`). Supports replying directly from the dashboard and toggling each conversation between automatic (bot) and human-handled mode.
- **Leads** — a table/card view of leads captured through WhatsApp, with an editable status field (`nuevo`, `contactado`, `ganado`, `perdido`) that updates in place.
- **Agenda** — a read-only list of appointment requests captured through WhatsApp (name, phone, requested day/time, topic).

All dashboard views poll their data on an interval rather than using websockets (see `usePollingResource`).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router), TypeScript (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first config (`@theme inline` in `src/app/globals.css`), no `tailwind.config.ts`
- [HeroUI v3 (beta)](https://heroui.com) — compound-component React library built on React Aria, no provider setup required
- No database of its own — the app is a UI on top of an **n8n** workflow ("WhatsApp Dashboard API") that owns conversations, leads, and appointments data

## Prerequisites

- Node.js 20+
- Access to the flujoo n8n "WhatsApp Dashboard API" workflow (base URL + bearer token)

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# then fill in DASHBOARD_PASSWORD, SESSION_SECRET, N8N_DASHBOARD_URL, N8N_DASHBOARD_TOKEN

# Start the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login gate first.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DASHBOARD_PASSWORD` | Shared password for the team login gate |
| `SESSION_SECRET` | Secret used to sign the session cookie (HMAC-SHA256). Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `N8N_DASHBOARD_URL` | Base URL of the n8n "WhatsApp Dashboard API" workflow |
| `N8N_DASHBOARD_TOKEN` | Bearer token for that workflow |

## Available Scripts

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

No test runner is configured in this repo yet.

## Project Structure

```
src/
├── app/
│   ├── login/              # Login gate (route group-free) + server action
│   ├── (dashboard)/         # Route group: shared Topbar layout
│   │   ├── page.tsx         # WhatsApp chats view (Sidebar + ChatPanel)
│   │   ├── leads/           # Leads view
│   │   └── agenda/          # Agenda view
│   └── api/                 # Route handlers proxying to the n8n workflow
│       ├── conversations/
│       ├── messages/
│       ├── reply/
│       ├── mode/
│       ├── leads/
│       └── appointments/
├── components/
│   ├── app-shell/            # Topbar, nav, Sidebar
│   └── chat/                 # ChatPanel and message UI
├── hooks/                    # usePollingResource, etc.
├── lib/                      # n8nDashboardFetch and other utilities
└── types/                    # Conversation, Lead, Appointment types
```

## Notes

- **This project's installed Next.js version has breaking changes** relative to common Next.js training data and assumptions. Before writing routing, data-fetching, or config code, check the relevant guide under `node_modules/next/dist/docs/` and read `AGENTS.md` / `CLAUDE.md`.
- HeroUI v3 is a beta release with a different API from HeroUI v2 (compound components, no `HeroUIProvider`). Don't rely on v2 knowledge.
- All data (conversations, messages, leads, appointments, mode) lives in the n8n workflow — this app has no database of its own.
