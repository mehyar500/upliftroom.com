# UpliftRoom

## Overview
Cannabis lifestyle web application built with React (Vite) frontend and a Cloudflare Worker backend connected to Supabase. The frontend displays products, articles, and curated content.

## Project Architecture
- **Frontend** (`web/`): Vite + React 19 + TypeScript + Tailwind CSS v4
  - Pages: Home, Products, Menu, Latest, About, Privacy, Admin
  - Uses `react-router-dom` for routing, `@tanstack/react-query` for data fetching
  - API calls go to `VITE_API_URL` env var or fallback to `https://api.upliftroom.com`
- **Backend** (`backend/`): Cloudflare Worker + Supabase
  - Designed to run on Cloudflare Workers (uses `wrangler`)
  - Endpoints: `/health`, `/products`, `/categories`, `/rss/items`, admin routes
  - Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets
- **Monorepo**: npm workspaces (`web` and `backend`)

## Recent Changes
- 2026-02-17: Initial Replit setup — configured Vite dev server on port 5000 with host 0.0.0.0 and allowedHosts: true. Deployment configured as static site from `web/dist`.

## Key Commands
- `npm run dev` — Start frontend dev server (port 5000)
- `npm run build` — Build frontend for production
- `npm run dev:backend` — Start backend with wrangler dev (requires Cloudflare/Supabase config)

## User Preferences
- (none yet)
