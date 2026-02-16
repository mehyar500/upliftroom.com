-- Categories table (for organizing products)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Descriptions
  short_description TEXT NOT NULL,
  long_description TEXT,
  
  -- Compliance-friendly attributes (no medical claims)
  profile TEXT, -- 'day', 'night', 'balanced', 'anytime'
  intensity TEXT, -- 'light', 'mild', 'moderate', 'strong', 'bold'
  experience_notes TEXT[], -- ['upbeat', 'calm', 'social', 'focus', 'unwind']
  
  -- Tags for filtering/search
  tags TEXT[],
  
  -- Pricing and sizes
  base_price DECIMAL(10, 2), -- Base price (optional, for display)
  price_text TEXT, -- Flexible text like "Starting at $25"
  
  -- Available sizes with individual pricing
  sizes JSONB DEFAULT '[]'::JSONB, 
  -- Example: [
  --   {"size": "3.5g", "price": 35.00, "unit": "gram"},
  --   {"size": "7g", "price": 65.00, "unit": "gram"},
  --   {"size": "14g", "price": 120.00, "unit": "gram"},
  --   {"size": "28g", "price": 220.00, "unit": "gram"},
  --   {"size": "1/2 lb", "price": 800.00, "unit": "pound"},
  --   {"size": "1 lb", "price": 1500.00, "unit": "pound"}
  -- ]
  
  -- Images
  image_cover_path TEXT,
  image_gallery_paths TEXT[],
  
  -- Lab testing
  lab_report_url TEXT,
  thc_percentage DECIMAL(5, 2),
  cbd_percentage DECIMAL(5, 2),
  
  -- Content warnings (for compliance)
  content_warnings TEXT[],
  
  -- Publishing controls
  is_active BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can only view active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Public can view all categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- Admin policies (using admins table with username-based auth)
-- Note: Since we're using custom auth (not Supabase Auth), we'll need to handle
-- admin permissions differently. For now, we'll create a permissive policy
-- that can be restricted via application logic or by adding a session table.

-- Temporarily allow all operations (will be restricted by application auth)
CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert some default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Flower', 'flower', 'Premium cannabis flower', 1),
  ('Pre-Rolls', 'pre-rolls', 'Ready to enjoy', 2),
  ('Concentrates', 'concentrates', 'High-potency extracts', 3),
  ('Edibles', 'edibles', 'Infused treats', 4),
  ('Vapes', 'vapes', 'Portable vaporizers', 5),
  ('Accessories', 'accessories', 'Essential tools', 6)
ON CONFLICT (slug) DO NOTHING;
