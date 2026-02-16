# UpliftRoom - Cannabis Lifestyle Website

This project is a monorepo setup for UpliftRoom, featuring a React frontend (Vite) hosted on Cloudflare Pages and a Supabase backend.

## Project Structure

- `web/`: Frontend application (React + Vite + TypeScript)
- `backend/`: Supabase configuration and migrations (to be initialized)

## Getting Started

### Prerequisites

- Node.js (v18+)
- NPM
- Supabase CLI (optional, but recommended for local dev)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd upliftroom.com
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    -   Copy `.env.example` to `web/.env` (create the file inside `web/` directory).
    -   Fill in your Supabase credentials.
    ```bash
    cp .env.example web/.env
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start the frontend development server.

## Deployment to Cloudflare Pages

This repository is configured to deploy to Cloudflare Pages via GitHub Actions (or automatic Cloudflare integration).

### Manual Setup via Cloudflare Dashboard

1.  Log in to Cloudflare Dashboard > Workers & Pages > Create Application > Pages > Connect to Git.
2.  Select this repository.
3.  **Build Settings:**
    -   **Framework Preset:** Vite
    -   **Build Command:** `npm run build`
    -   **Build Output Directory:** `dist`
    -   **Root Directory:** `web` (IMPORTANT: Set this to `web`)
4.  **Environment Variables:**
    -   Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Cloudflare Pages settings.

### Manual Deployment via CLI (Wrangler)

If you prefer to deploy manually or want to initialize the project from your local machine:

1.  **Set Environment Variables:**
    Ensure you have `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` set in your terminal or usage environment.

2.  **Create Project (First Time Only):**
    ```bash
    npx wrangler pages project create upliftroom-web --production-branch main
    ```

3.  **Upload Secrets:**
    ```bash
    # Replace values with your actual keys
    echo '{"VITE_SUPABASE_URL":"your_url","VITE_SUPABASE_ANON_KEY":"your_key"}' | npx wrangler pages secret bulk --project-name upliftroom-web
    ```

4.  **Deploy (from Root):**
    ```bash
    npm run deploy
    ```
    This script builds the `web` workspace and deploys it to Cloudflare Pages using `wrangler`.

### Via GitHub Actions (Automated)

A `.github/workflows/deploy.yml` is included. To use it:

1.  Get your Cloudflare Account ID and API Token.
    -   **Account ID:** Found in the Cloudflare Dashboard URL or sidebar.
    -   **API Token:** User Profile > API Tokens > Create Token > Template: "Edit Cloudflare Workers".
2.  Add secrets to your GitHub Repository (Settings > Secrets and variables > Actions):
    -   `CLOUDFLARE_ACCOUNT_ID`
    -   `CLOUDFLARE_API_TOKEN`
3.  Push to `main` branch.

## Cloudflare Token Permissions

To fully manage the project (Pages, Workers, AI, DNS) via API/GitHub Actions, create a token with the following permissions:

1.  Go to **User Profile** > **API Tokens** > **Create Token**.
2.  Select **Create Custom Token** at the bottom.
3.  **Token Name**: e.g., "UpliftRoom Deploy".
4.  **Permissions**:
    -   **Account** > **Cloudflare Pages** > **Edit**
    -   **Account** > **Workers Scripts** > **Edit**
    -   **Account** > **Workers AI** > **Read** (or Edit)
    -   **Zone** > **DNS** > **Edit**
    -   **Zone** > **Zone** > **Read**
5.  **Account Resources**: Select "Include" > "All accounts" (or your specific account).
6.  **Zone Resources**: Select "Include" > "All zones" (or your specific zone).
7.  Click **Continue to Summary** > **Create Token**.

Copy this token immediately. This is your `CLOUDFLARE_API_TOKEN`.
