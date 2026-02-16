# UpliftRoom

Cannabis lifestyle web application built with React (Cloudflare Pages) and a Cloudflare Worker backend connected to Supabase.

## Project Structure

```
upliftroom.com/
├── web/              # Frontend — Vite + React + TypeScript + Tailwind CSS v4
├── backend/          # Backend  — Cloudflare Worker + Supabase
│   └── supabase/     # SQL migrations
├── .github/workflows # CI/CD — auto-deploy on push to main
├── package.json      # Root scripts for dev & deploy
└── .env.example      # Environment variable template
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com) project
- A [Cloudflare](https://cloudflare.com) account

## Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/mehyar500/upliftroom.com.git
   cd upliftroom.com
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy the example and fill in your values:
   ```bash
   cp .env.example web/.env
   ```

   For the backend, set secrets via Wrangler:
   ```bash
   npx wrangler secret put SUPABASE_URL --name upliftroom-api
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name upliftroom-api
   ```

4. **Run the database migration:**

   Go to your Supabase Dashboard → SQL Editor and run the contents of:
   ```
   backend/supabase/migrations/20240216000000_create_daily_users.sql
   ```

## Local Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server (Vite) |
| `npm run dev:backend` | Start backend Worker locally (Wrangler) |
| `npm run dev:all` | Start both frontend + backend concurrently |

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:8787`.

## Deployment

Set your Cloudflare credentials before deploying:
```bash
export CLOUDFLARE_API_TOKEN=your-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id
```

| Command | Description |
|---------|-------------|
| `npm run deploy` | Deploy both frontend + backend |
| `npm run deploy:web` | Build + deploy frontend to Cloudflare Pages |
| `npm run deploy:backend` | Deploy backend Worker to Cloudflare |

### Live URLs

| Service | URL |
|---------|-----|
| Frontend | [upliftroom.com](https://upliftroom.com) |
| Backend API | [api.upliftroom.com](https://api.upliftroom.com/health) |

### CI/CD

Pushing to `main` automatically deploys the frontend via GitHub Actions. Make sure the following secrets are set in your GitHub repo settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Cloudflare API Token Permissions

When creating your token, include:
- **Cloudflare Pages** — Edit
- **Workers Scripts** — Edit
- **DNS** — Edit
- **Zone** — Read
