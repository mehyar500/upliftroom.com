-- Add out_of_stock field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS out_of_stock BOOLEAN DEFAULT FALSE;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_products_out_of_stock ON products(out_of_stock);

-- Add comment for documentation
COMMENT ON COLUMN products.out_of_stock IS 'Indicates if the product is currently out of stock';
