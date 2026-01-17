-- Add Watch category
INSERT INTO categories (name, slug, image_url)
VALUES ('Watch', 'watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400')
ON CONFLICT (slug) DO NOTHING;

-- Add new columns to products table for dimensions (if they don't exist)
-- Run these one by one if your Supabase version doesn't support IF NOT EXISTS for columns

ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS height DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS breadth DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS length DECIMAL(10, 2);

-- If the above doesn't work, try these (will error if columns already exist, which is safe):
-- ALTER TABLE products ADD COLUMN weight DECIMAL(10, 2);
-- ALTER TABLE products ADD COLUMN height DECIMAL(10, 2);
-- ALTER TABLE products ADD COLUMN breadth DECIMAL(10, 2);
-- ALTER TABLE products ADD COLUMN length DECIMAL(10, 2);
