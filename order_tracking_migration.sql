-- Order Tracking Database Migration
-- Run this SQL in your Supabase SQL Editor to add tracking capabilities

-- =============================================
-- 1. Add tracking-related columns to orders table
-- =============================================

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS courier_partner TEXT,
ADD COLUMN IF NOT EXISTS courier_tracking_link TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Create index for faster tracking number lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- =============================================
-- 2. Create order_tracking_history table
-- =============================================

CREATE TABLE IF NOT EXISTS order_tracking_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster order history lookups
CREATE INDEX IF NOT EXISTS idx_tracking_history_order_id ON order_tracking_history(order_id);

-- =============================================
-- 3. Enable Row Level Security
-- =============================================

ALTER TABLE order_tracking_history ENABLE ROW LEVEL SECURITY;

-- Users can view tracking history for their own orders
CREATE POLICY "Users can view their own order tracking history" 
ON order_tracking_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_tracking_history.order_id AND orders.user_id = auth.uid())
);

-- Admins can manage all tracking history (for authenticated users acting as admins)
CREATE POLICY "Admins can manage all tracking history" 
ON order_tracking_history FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 4. Function to auto-generate tracking number
-- =============================================

CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := 'BAWK' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate tracking number on order creation
DROP TRIGGER IF EXISTS trigger_generate_tracking_number ON orders;
CREATE TRIGGER trigger_generate_tracking_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_tracking_number();

-- =============================================
-- 5. Function to auto-log status changes
-- =============================================

CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  status_message TEXT;
BEGIN
  -- Only log if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Generate appropriate message based on status
    CASE NEW.status
      WHEN 'paid' THEN status_message := 'Your order has been confirmed and payment received';
      WHEN 'processing' THEN status_message := 'Your order is being prepared';
      WHEN 'printed' THEN status_message := 'Your items have been printed and are ready for packaging';
      WHEN 'shipped' THEN status_message := 'Your package has been handed over to the courier';
      WHEN 'out_for_delivery' THEN status_message := 'Your package is out for delivery today';
      WHEN 'delivered' THEN status_message := 'Your package has been delivered successfully';
      WHEN 'cancelled' THEN status_message := 'Your order has been cancelled';
      ELSE status_message := 'Order status updated to ' || NEW.status;
    END CASE;

    -- Insert tracking history entry
    INSERT INTO order_tracking_history (order_id, status, message)
    VALUES (NEW.id, NEW.status, status_message);

    -- Update timestamps for specific statuses
    IF NEW.status = 'shipped' AND NEW.shipped_at IS NULL THEN
      NEW.shipped_at := NOW();
      -- Set estimated delivery to 5 days from now if not set
      IF NEW.estimated_delivery IS NULL THEN
        NEW.estimated_delivery := NOW() + INTERVAL '5 days';
      END IF;
    ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-log status changes
DROP TRIGGER IF EXISTS trigger_log_status_change ON orders;
CREATE TRIGGER trigger_log_status_change
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- =============================================
-- 6. Insert initial tracking history for existing orders
-- =============================================

INSERT INTO order_tracking_history (order_id, status, message, created_at)
SELECT 
  id, 
  status, 
  CASE status
    WHEN 'paid' THEN 'Your order has been confirmed and payment received'
    WHEN 'pending' THEN 'Your order has been placed'
    ELSE 'Order status: ' || status
  END,
  created_at
FROM orders
WHERE NOT EXISTS (
  SELECT 1 FROM order_tracking_history WHERE order_tracking_history.order_id = orders.id
);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
-- Migration complete! Your orders table now has:
-- - tracking_number (auto-generated: BAWK + 8 chars)
-- - estimated_delivery (auto-set to 5 days when shipped)
-- - courier_partner (e.g., 'BlueDart', 'Delhivery')
-- - courier_tracking_link (external tracking URL)
-- - shipped_at, delivered_at timestamps
-- - customer_name field
--
-- The order_tracking_history table automatically logs all status changes!
