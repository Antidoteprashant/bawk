-- Execute this in your Supabase SQL Editor to ensure Categories are visible to everyone
alter table public.categories enable row level security;

-- Drop existing policy if it exists (to avoid errors, we use 'if exists' logic or just create a new distinct one)
drop policy if exists "Enable read access for all users" on public.categories;
drop policy if exists "Allow public read access" on public.categories;

-- Create the public read policy
create policy "Enable read access for all users"
on public.categories
for select
using (true);

-- Ensure products are also visible
drop policy if exists "Enable read access for all users" on public.products;
create policy "Enable read access for all users"
on public.products
for select
using (true);

-- Verify data exists (Optional check)
-- select count(*) from categories;
