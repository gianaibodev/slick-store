-- Admin policies for Supabase
-- Run this in your Supabase SQL Editor to allow admin operations

-- Enable RLS on products table (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create admin policy for products (allows all operations for authenticated users)
-- This is a temporary policy for admin operations
CREATE POLICY "Allow all operations for authenticated users" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on product_variants table (if not already enabled)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create admin policy for product_variants (allows all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON public.product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on orders table (if not already enabled)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create admin policy for orders (allows all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON public.orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on order_items table (if not already enabled)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create admin policy for order_items (allows all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON public.order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Note: These policies allow all authenticated users to perform all operations
-- In a production environment, you would want more restrictive policies
-- based on user roles (admin, user, etc.)
