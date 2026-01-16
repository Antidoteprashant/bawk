
-- Add address and contact fields to profiles table to save user data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Ensure users can update their own profile (Policy already existed but let's be safe)
-- "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
