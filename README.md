# Uplift Room

This repository contains the source code for Uplift Room, a React-based SPA hosted on Cloudflare Pages with a Supabase backend.

## Project Structure

- `web/`: Frontend application (React + Vite + TypeScript)
- `backend/`: Supabase configuration and migrations (planned)

## Getting Started

### Prerequisites

- Node.js (v18+)
- NPM
- A Supabase project

### Setup

1. Copy `.env.example` to `.env` in `web/` (or root if using workspaces setup to propagate, but create `.env` in `web` explicitly recommended for Vite):
   ```bash
   cp .env.example web/.env
   ```
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Development

Run the frontend locally:

```bash
npm run dev --workspace=web
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Deployment

The project is configured to deploy to Cloudflare Pages via GitHub Actions.

### Requirements

- Cloudflare Pages project named `upliftroom`.
- GitHub Secrets configured:
    - `CLOUDFLARE_ACCOUNT_ID`
    - `CLOUDFLARE_API_TOKEN`
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

Every push to `main` will trigger a deployment.
