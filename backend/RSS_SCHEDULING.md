# RSS Scheduling & Cleanup

## Overview
The RSS system automatically fetches and cleans up articles using Cloudflare Workers Cron Triggers.

## How It Works

### 1. Image Extraction
Images ARE extracted from RSS feeds via:
- `media:content` tags
- `enclosure` tags  
- `<img>` tags in content/description
- Stored in `rss_items.image_url` column
- Displayed on frontend in `LatestPage.tsx`

### 2. Automatic Scheduling
**Cron Schedule:** Every 6 hours (`0 */6 * * *`)

The worker automatically:
1. Deletes items older than 30 days
2. Fetches all active RSS sources
3. Parses and stores new items
4. Updates `last_fetched_at` timestamp

### 3. Manual Trigger
Admins can manually trigger via:
```
POST /admin/rss/fetch
Authorization: Bearer <admin-token>
```

## Configuration

### wrangler.toml
```toml
[triggers]
crons = ["0 */6 * * *"]
```

### Cron Schedule Options
- `0 */6 * * *` - Every 6 hours (current)
- `0 */4 * * *` - Every 4 hours
- `0 */12 * * *` - Every 12 hours
- `0 0 * * *` - Daily at midnight

## Data Retention
- Keeps last 30 days of articles
- Cleanup runs before each fetch
- Uses `published_at` timestamp for filtering

## Deployment
After deploying to Cloudflare:
1. Cron triggers activate automatically
2. View logs: `wrangler tail`
3. Test manually: `wrangler dev` (crons don't fire in dev)

## Monitoring
Check Cloudflare dashboard:
- Workers & Pages → upliftroom-api → Metrics
- View cron execution history
- Monitor success/failure rates
