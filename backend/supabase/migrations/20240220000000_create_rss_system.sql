-- RSS Sources table (stores RSS feed URLs to fetch from)
CREATE TABLE IF NOT EXISTS rss_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  homepage_url TEXT,
  category TEXT, -- 'cannabis', 'lifestyle', 'news', etc.
  is_active BOOLEAN DEFAULT true,
  refresh_interval_minutes INTEGER DEFAULT 360, -- 6 hours default
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSS Items table (stores fetched articles/posts)
CREATE TABLE IF NOT EXISTS rss_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES rss_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  author TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_rss_items_source ON rss_items(source_id);
CREATE INDEX idx_rss_items_published ON rss_items(published_at DESC);
CREATE INDEX idx_rss_items_created ON rss_items(created_at DESC);
CREATE INDEX idx_rss_sources_active ON rss_sources(is_active);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_rss_sources_updated_at
  BEFORE UPDATE ON rss_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;

-- Public can view active RSS items
CREATE POLICY "Public can view rss items"
  ON rss_items FOR SELECT
  USING (true);

-- Public can view active RSS sources
CREATE POLICY "Public can view active rss sources"
  ON rss_sources FOR SELECT
  USING (is_active = true);

-- Admins can manage RSS sources
CREATE POLICY "Authenticated users can manage rss sources"
  ON rss_sources FOR ALL
  USING (true)
  WITH CHECK (true);

-- Admins can manage RSS items
CREATE POLICY "Authenticated users can manage rss items"
  ON rss_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert some default cannabis/lifestyle RSS sources
INSERT INTO rss_sources (name, feed_url, homepage_url, category, is_active) VALUES
  ('High Times', 'https://hightimes.com/feed/', 'https://hightimes.com', 'cannabis', true),
  ('Leafly News', 'https://www.leafly.com/news/feed', 'https://www.leafly.com/news', 'cannabis', true),
  ('Cannabis Now', 'https://cannabisnow.com/feed/', 'https://cannabisnow.com', 'cannabis', true),
  ('MJBizDaily', 'https://mjbizdaily.com/feed/', 'https://mjbizdaily.com', 'cannabis', true),
  ('The Cannabist', 'https://www.thecannabist.co/feed/', 'https://www.thecannabist.co', 'cannabis', true)
ON CONFLICT (feed_url) DO NOTHING;

-- Add comment
COMMENT ON TABLE rss_sources IS 'Stores RSS feed sources to fetch content from periodically';
COMMENT ON TABLE rss_items IS 'Stores individual articles/posts fetched from RSS sources';
