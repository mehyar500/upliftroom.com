-- Create newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  zip TEXT NOT NULL,
  source TEXT DEFAULT 'website',
  brevo_list_id INTEGER,
  brevo_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created_at ON newsletter_signups(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_newsletter_signups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_signups_updated_at
  BEFORE UPDATE ON newsletter_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_signups_updated_at();

-- Enable Row Level Security
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert (for signup form)
CREATE POLICY "Allow public insert" ON newsletter_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Service role (backend) can do everything
CREATE POLICY "Service role full access" ON newsletter_signups
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can view all signups (for admin dashboard)
CREATE POLICY "Allow authenticated select" ON newsletter_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update signups (for admin dashboard)
CREATE POLICY "Allow authenticated update" ON newsletter_signups
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete signups (for admin dashboard)
CREATE POLICY "Allow authenticated delete" ON newsletter_signups
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE newsletter_signups IS 'Stores newsletter signup information from website forms';
COMMENT ON COLUMN newsletter_signups.source IS 'Source of signup (e.g., website, footer, popup)';
COMMENT ON COLUMN newsletter_signups.brevo_list_id IS 'Brevo list ID where contact was added';
COMMENT ON COLUMN newsletter_signups.brevo_synced_at IS 'Timestamp when contact was synced to Brevo';
