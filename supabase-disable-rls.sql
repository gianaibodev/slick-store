-- Temporarily disable RLS for testing
-- Run this in your Supabase SQL Editor

-- Disable RLS on all tables for testing
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Note: This disables all security policies
-- Only use this for development/testing
-- Re-enable RLS in production with proper policies
