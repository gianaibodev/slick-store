-- Fixed Admin policies for Supabase
-- Run this in your Supabase SQL Editor to allow admin operations

-- First, let's check what policies exist and drop them if needed
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.product_variants;

-- Create new policies for products table
CREATE POLICY "Enable all operations for authenticated users" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- Create new policies for product_variants table  
CREATE POLICY "Enable all operations for authenticated users" ON public.product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- Create new policies for orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.orders;

CREATE POLICY "Enable all operations for authenticated users" ON public.orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Create new policies for order_items table
DROP POLICY IF EXISTS "Order items are viewable by order owner" ON public.order_items;
DROP POLICY IF EXISTS "Order items can be created by order owner" ON public.order_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.order_items;

CREATE POLICY "Enable all operations for authenticated users" ON public.order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Also ensure profiles table allows updates
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Enable all operations for authenticated users" ON public.profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- Note: These policies allow all authenticated users to perform all operations
-- In a production environment, you would want more restrictive policies
-- based on user roles (admin, user, etc.)
