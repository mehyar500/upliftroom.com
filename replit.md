# UpliftRoom

## Overview
Cannabis lifestyle web application built with React (Vite) frontend and a Cloudflare Worker backend connected to Supabase. The frontend displays products, articles, and curated content.

## Project Architecture
- **Frontend** (`web/`): Vite + React 19 + TypeScript + Tailwind CSS v4
  - Pages: Home, Products, Menu, Latest, About, Privacy, Admin
  - Uses `react-router-dom` for routing, `@tanstack/react-query` for data fetching
  - API calls go to `VITE_API_URL` env var or fallback to `https://api.upliftroom.com`
  - Design system: Centralized CSS custom properties in `index.css` (colors, spacing, typography, shadows, radii)
  - Utility classes: `.container`, `.card`, `.pill`, `.badge`, `.btn-primary`, `.btn-secondary`, `.glass`, `.gradient-text`, `.section-title`, `.page-section`
  - Generated image assets in `web/public/images/`
- **Backend** (`backend/`): Cloudflare Worker + Supabase
  - Designed to run on Cloudflare Workers (uses `wrangler`)
  - Endpoints: `/health`, `/products`, `/categories`, `/rss/items`, admin routes
  - Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets (in backend/.dev.vars)
- **Monorepo**: npm workspaces (`web` and `backend`)

## Recent Changes
- 2026-02-17: Complete UI redesign — Apple-like 2026 aesthetic with centralized design tokens, SVG logo integration, generated hero images, pill-style nav/filters, proper centering and padding throughout. Dark/light mode support.
- 2026-02-17: Initial Replit setup — configured Vite dev server on port 5000 with host 0.0.0.0 and allowedHosts: true. Full-stack workflow running both frontend and backend. Deployment configured as static site from `web/dist`.

## Key Commands
- `npm run dev:all` — Start both frontend (port 5000) and backend (port 8787)
- `npm run dev` — Start frontend dev server only (port 5000)
- `npm run build` — Build frontend for production
- `npm run dev:backend` — Start backend with wrangler dev (port 8787)

## User Preferences
- Apple-like design aesthetic (2026 style)
- Centralized styling for ease of change
- Clean centered layouts with generous padding
