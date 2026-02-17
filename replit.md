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

## SEO & Metadata
- Custom `useSEO` hook (`web/src/hooks/useSEO.ts`) manages per-page `<title>`, meta description, keywords, canonical URL, OpenGraph, and Twitter Card tags
- Global SEO defaults in `web/index.html`: structured data (JSON-LD), OG tags, theme-color, favicon
- Static `robots.txt` and `sitemap.xml` in `web/public/`
- Generated OG image at `web/public/og-image.png`
- Favicon at `web/public/favicon.png`

## Recent Changes
- 2026-02-17: Added favicon, OG image, full SEO meta tags (OpenGraph, Twitter Cards, JSON-LD structured data), per-page dynamic metadata via useSEO hook, robots.txt, sitemap.xml. Fixed theme default in index.html to light.
- 2026-02-17: Redesigned product detail modal — proper centering, image area with placeholder, rounded close button, better padding.
- 2026-02-17: Fixed product card text clipping — removed overflow:hidden from .card CSS, added explicit border-radius to image containers instead. Increased bottom padding on product cards (pb-7).
- 2026-02-17: Light mode is now the default theme (was dark). Users can still toggle.
- 2026-02-17: Navbar logo scales to fill nav height dynamically. Section titles/subtitles centered via CSS class.
- 2026-02-17: Complete UI redesign — Apple-like 2026 aesthetic with centralized design tokens, SVG logo integration, generated hero images, pill-style nav/filters, proper centering and padding throughout. Dark/light mode support.
- 2026-02-17: Initial Replit setup — configured Vite dev server on port 5000 with host 0.0.0.0 and allowedHosts: true. Full-stack workflow running both frontend and backend. Deployment configured as static site from `web/dist`.

## Key Commands
- `npm run dev:all` — Start both frontend (port 5000) and backend (port 8787)
- `npm run dev` — Start frontend dev server only (port 5000)
- `npm run build` — Build frontend for production
- `npm run dev:backend` — Start backend with wrangler dev (port 8787)

## User Preferences
- Apple-like design aesthetic (2026 style)
- Light mode as default
- Centralized styling for ease of change
- Clean centered layouts with generous padding
- Cards need breathing room — no text clipping at rounded corners
