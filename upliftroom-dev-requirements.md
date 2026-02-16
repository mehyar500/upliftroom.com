
# upliftroom.com — Developer Requirements
# FULL TECHNICAL REQUIREMENTS & IMPLEMENTATION GUIDE


It includes:
- Architecture
- Data models
- Logic flows
- Validation rules
- Security model
- UI/UX direction
- Compliance guardrails
- Admin training guide
- RSS system
- Newsletter system
- SEO requirements
- Deployment instructions
- Environment configuration
- RLS examples
- Edge function pseudocode
- Content policy language guide

No sections omitted.

---

# 1. BUSINESS MODEL CLARITY

This is an informational cannabis lifestyle website.

It DOES:
- Present products (menu style)
- Educate users
- Publish blog content
- Curate external RSS content
- Collect newsletter emails
- Provide contact details

It DOES NOT:
- Sell online
- Process payments
- Offer delivery
- Offer user accounts
- Allow public content submission

---

# 2. SYSTEM ARCHITECTURE

Frontend:
- React (Vite)
- TypeScript
- SPA with pre-rendered critical routes
- Tailwind CSS
- TanStack Query
- Zod schema validation

Backend:
- Supabase
  - Postgres
  - Auth (Admin only)
  - Storage (Images)
  - RLS policies
  - Edge Functions

Hosting:
- Cloudflare Pages

Architecture Model:
Client → Supabase (Public anon key)
Admin → Supabase (Auth session)
Edge Functions → Supabase (Service role)

---

# 4. DATABASE SCHEMA (FULL)

## products
id uuid pk
name text not null
slug text unique not null
short_description text not null
long_description_md text
category_id uuid
labels text[]
strength text
timing text
tags text[]
content_warnings text[]
price_text text
image_cover_path text
image_gallery_paths text[]
lab_report_url text
is_active boolean default false
is_featured boolean default false
sort_order int default 0
created_at timestamp default now()
updated_at timestamp default now()

## categories
id uuid pk
name text unique
slug text unique
sort_order int

## blog_posts
id uuid pk
title text not null
slug text unique not null
excerpt text not null
content_md text not null
cover_image_path text
tags text[]
status text
published_at timestamp
created_at timestamp
updated_at timestamp

## rss_sources
id uuid pk
name text
feed_url text unique
homepage_url text
category text
is_active boolean default true
refresh_interval_minutes int default 360
last_fetched_at timestamp

## rss_items
id uuid pk
source_id uuid references rss_sources(id)
title text
link text unique
summary text
image_url text
published_at timestamp
created_at timestamp default now()

## newsletter_signups
id uuid pk
email text not null
source text
created_at timestamp default now()

## site_settings
id int pk default 1
site_name text
contact_phone text
contact_address text
banner_text text
disclaimer_footer text
disclaimer_age_gate text
age_gate_enabled boolean default true
age_gate_ttl_days int default 30

## admin_users
user_id uuid unique
email text unique
role text default 'admin'

---

# 5. ROW LEVEL SECURITY (RLS)

Public:
SELECT products WHERE is_active = true
SELECT blog_posts WHERE status='published' AND published_at <= now()
SELECT categories
SELECT rss_items
SELECT site_settings
INSERT newsletter_signups (rate limited)

Admin:
Full CRUD where auth.uid() exists in admin_users

Example Policy (products select):
USING (is_active = true)

Example Admin Policy:
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
)

---

# 6. LOGIC FLOWS

## PUBLIC FIRST VISIT

1. Load app shell
2. Fetch site_settings
3. If age_gate_enabled:
   - Check localStorage consent
   - If missing/expired → show modal
4. If confirmed:
   - Fetch featured products
   - Fetch latest blog posts
   - Fetch rss items

---

## PRODUCT PUBLISH FLOW

1. Admin creates draft (is_active=false)
2. Upload cover image
3. Add labels, strength, timing
4. Save
5. Click Publish
6. Run hard validation:
   - cover exists
   - strength set
   - timing set
   - short_description length <= 160
7. Run content lint
8. If valid → set is_active=true

---

## BLOG SCHEDULING FLOW

1. Admin writes post
2. Set status='published'
3. Set published_at future timestamp
4. Public query filters by published_at <= now()

---

## RSS EDGE FUNCTION FLOW

for each active rss_source:
  fetch feed_url
  parse XML
  normalize items
  upsert into rss_items by link
  delete items older than retention window

Public never calls RSS externally.

---

# 7. ADMIN TERMINOLOGY GUIDE (MANDATORY)

To reduce compliance risk, admins must use experience-based language.

INDICA → Use:
- Night
- Drift
- Deep unwind
- Heavy profile
- Settle-in

SATIVA → Use:
- Day
- Lift
- Bright
- Social
- Upbeat

HYBRID → Use:
- Balanced
- Anytime
- Mixed profile

HIGH THC → Use:
- Strong
- Bold
- High intensity

LOW THC → Use:
- Light
- Mild
- Low intensity

CBD DOMINANT → Use:
- Calm
- Body
- Gentle
- Soft profile

NEVER USE:
- “cures anxiety”
- “treats pain”
- “medical grade healing”
- “guaranteed effect”

Always use:
- “may” language
- “effects vary by person”

---

# 8. GEN Z LOOK & FEEL DIRECTION

Dark UI first.
Muted gradients.
Glassmorphism subtle blur cards.
Rounded corners.
Large typography.
Short sentences.
Swipe-friendly layouts.
Micro animations.
No cannabis leaves.
No neon clichés.
No cartoon branding.

Tone:
Confident.
Minimal.
Lifestyle-forward.

---

# 9. SEO REQUIREMENTS

Pre-render:
/
/menu
/menu/:slug
/blog
/blog/:slug

Dynamic metadata per page.
OpenGraph support.
Sitemap edge endpoint.
Robots.txt included.
Canonical URLs.

---

# 10. NEWSLETTER SYSTEM

Frontend:
- Email input
- Consent checkbox
- Hidden honeypot

Backend:
- Edge function validates
- Rate limit by IP
- Insert into DB or forward to provider

Admin:
- View table
- Export CSV

---

# 11. IMAGE HANDLING

Cover:
- Resize to 1200px width
- Convert to WebP
- Compress

Gallery:
- Max 8 images
- Lazy load

---

# 12. ENVIRONMENT FILE

.env.example

VITE_SUPABASE_URL=https://hnjtgbshpsnylccfvutz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_MyfMEPRN00T0rrRQP2A5MQ_0hwE-hh4
VITE_ENABLE_RSS=true
VITE_ENABLE_NEWSLETTER=true
CLOUDFLARE_ACCOUNT_ID=73297e9019ac926f860a4496636e01e3
CLOUDFLARE_API_TOKEN=W6MXDIQlxA6piE9YDO4fgjrAJ9KrfHZfayHgS0WK
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuanRnYnNocHNueWxjY2Z2dXR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI1NTQ1MiwiZXhwIjoyMDg2ODMxNDUyfQ.jIdSU3iiJE98WZQQa4SyPXjLga5gnqP-fzMpuUiJeGo

Server-side secrets not exposed to frontend.

---

# 13. DEPLOYMENT PROCESS

1. Push to GitHub
2. Cloudflare Pages builds Vite project
3. Set environment variables
4. Connect custom domain
5. Verify SSL
6. Test admin login
7. Test RLS restrictions

---

# 14. ACCEPTANCE CRITERIA

- Age gate blocks content
- Admin can publish product without redeploy
- Blog scheduling works
- RSS cached server-side
- Newsletter spam protected
- Public cannot write products/blog
- Lighthouse mobile >= 80
- Accessibility >= 90

---

# 15. FINAL NOTES

All features must be portable.
No vendor lock beyond Supabase.
All dynamic data must function without rebuild.
Admin UI must be intuitive and safe.
Compliance warnings must be visible before publish.

END OF FULL SPECIFICATION.
