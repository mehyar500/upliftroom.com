# UpliftRoom

Cannabis lifestyle web application built with React (Cloudflare Pages) and a Cloudflare Worker backend connected to Supabase.

## Project Structure

```
upliftroom.com/
├── web/              # Frontend — Vite + React + TypeScript + Tailwind CSS v4
├── backend/          # Backend  — Cloudflare Worker + Supabase
│   ├── src/index.ts  # Worker entry point with /health endpoint
│   ├── wrangler.toml # Worker config
│   └── .dev.vars     # Local secrets (not committed)
├── .github/workflows # CI/CD — auto-deploy on push to main
├── package.json      # Root scripts for dev & deploy
└── .env.example      # Environment variable template
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com) project (remote — no local Supabase needed)
- A [Cloudflare](https://cloudflare.com) account (for deployment only)

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure backend secrets

Create `backend/.dev.vars` with your Supabase credentials (Wrangler reads this file automatically during local dev):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Configure frontend env

Create `web/.env`:

```env
VITE_API_URL=http://localhost:8787
```

This tells the React app to talk to the local backend Worker.

### 4. Run both services

```bash
npm run dev:all
```

This starts **both** services concurrently:

| Service | URL | What it does |
|---------|-----|-------------|
| Frontend (Vite) | `http://localhost:5173` | React app |
| Backend (Wrangler) | `http://localhost:8787` | Worker → remote Supabase |

You can also run them individually:

```bash
npm run dev          # Frontend only
npm run dev:backend  # Backend only
```

### How it works locally

```
Browser → localhost:5173 (React)
              ↓ fetch /health
         localhost:8787 (Worker)
              ↓ Supabase client
         hnjtgbshpsnylccfvutz.supabase.co (Remote DB)
```

---

## Deployment

Set your Cloudflare credentials:

```bash
# Windows PowerShell
$env:CLOUDFLARE_API_TOKEN="your-token"
$env:CLOUDFLARE_ACCOUNT_ID="your-account-id"

# macOS/Linux
export CLOUDFLARE_API_TOKEN=your-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id
```

| Command | Description |
|---------|-------------|
| `npm run deploy` | Deploy both frontend + backend |
| `npm run deploy:web` | Build + deploy frontend to Cloudflare Pages |
| `npm run deploy:backend` | Deploy backend Worker to Cloudflare |

> **Note:** When deploying the frontend, `VITE_API_URL` must be set to `https://api.upliftroom.com` (the production backend). Set this as a Cloudflare Pages environment variable in the dashboard, or temporarily update `web/.env` before building.

### Live URLs

| Service | URL |
|---------|-----|
| Frontend | [upliftroom.com](https://upliftroom.com) |
| Backend API | [api.upliftroom.com/health](https://api.upliftroom.com/health) |

### CI/CD (GitHub Actions)

Pushing to `main` automatically deploys the frontend. Set these secrets in your GitHub repo:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Cloudflare API Token Permissions

- **Cloudflare Pages** — Edit
- **Workers Scripts** — Edit
- **DNS** — Edit
- **Zone** — Read

---

## Database

The backend uses a `daily_users` table in Supabase for rate limiting. Run the migration in Supabase SQL Editor:

```
backend/supabase/migrations/20240216000000_create_daily_users.sql
```
