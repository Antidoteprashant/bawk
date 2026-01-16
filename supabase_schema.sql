-- Create a table for product categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table for products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sale BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to view categories and products (Public Read)
CREATE POLICY "Public categories are viewable by everyone" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Allow authenticated users (Admins) to insert/update/delete
-- Note: In a real production app, you would check for a specific 'admin' role.
-- For now, we allow any authenticated user to manage products for the admin panel.
CREATE POLICY "Authenticated users can manage categories" 
ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage products" 
ON products FOR ALL USING (auth.role() = 'authenticated');

-- Insert some default categories
INSERT INTO categories (name, slug) VALUES 
('Action Figures', 'action-figures'),
('Apparel', 'apparel'),
('Keychains', 'keychains'),
('Mousepads', 'mousepads'),
('Swords', 'swords'),
('Cosplay', 'cosplay');

-- Insert some dummy products
INSERT INTO products (name, description, price, original_price, category_id, image_url, is_featured, stock) 
SELECT 
  'Zoro Wano Arc', 
  'High quality Roronoa Zoro action figure from One Piece Wano Arc.', 
  1299.00, 
  1999.00, 
  id, 
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw7OPfKe8Xg_hU3sbxtSnDJisqqqHtngu_Xw&s',
  TRUE,
  50
FROM categories WHERE slug = 'action-figures';

INSERT INTO products (name, description, price, original_price, category_id, image_url, is_featured, stock) 
SELECT 
  'Luffy Gear 5', 
  'Monkey D. Luffy Gear 5 detailed figurine.', 
  1599.00, 
  2499.00, 
  id, 
  'https://www.masioriginals.com/cdn/shop/files/1_bcf0f65d-47bb-476f-83c3-58a06dd02b7b.jpg?v=1753435528&width=1946',
  TRUE,
  30
FROM categories WHERE slug = 'action-figures';
