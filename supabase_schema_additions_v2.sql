
-- Update orders table columns to match code usage
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_description TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Update RLS policies to allow authenticated users (anyone logged in) to create orders
-- Note: 'authenticated' role means any logged in user.
-- For guest checkout (not logged in), you'd need the 'anon' role, but normally we restrict writing.
-- If user is NULL (guest), RLS might block insert if not properly configured. 
-- Let's allow insert for everyone for now to support guest checkout demo, 
-- or ensure we only allow authenticated if we enforce login.
-- Since the code allows 'user_id' to be null, we should allow public insert for demo purposes.

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
