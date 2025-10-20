-- Admin Role-Based Access Control Setup
-- Run this in your Supabase SQL Editor

-- 1. Create admin_users table to manage admin roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id)
);

-- 2. Create admin_roles table for role definitions
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default admin roles
INSERT INTO admin_roles (name, description, permissions) VALUES
('super_admin', 'Super Administrator with full access', '{"all": true}'),
('admin', 'Administrator with most access', '{"products": true, "orders": true, "users": true, "analytics": true}'),
('moderator', 'Moderator with limited access', '{"products": true, "orders": true}');

-- 4. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = is_admin.user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to check admin role
CREATE OR REPLACE FUNCTION get_admin_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM admin_users 
  WHERE admin_users.user_id = get_admin_role.user_id 
  AND is_active = true;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to check admin permissions
CREATE OR REPLACE FUNCTION has_admin_permission(user_id UUID, permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_permissions JSONB;
BEGIN
  -- Get user's admin role
  SELECT au.role, ar.permissions INTO user_role, role_permissions
  FROM admin_users au
  JOIN admin_roles ar ON ar.name = au.role
  WHERE au.user_id = has_admin_permission.user_id 
  AND au.is_active = true;
  
  -- If no admin role, return false
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user has specific permission
  RETURN COALESCE((role_permissions->permission)::boolean, false) OR 
         COALESCE((role_permissions->'all')::boolean, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update RLS policies for admin access
-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage products" ON products;
DROP POLICY IF EXISTS "Admin can manage orders" ON orders;
DROP POLICY IF EXISTS "Admin can manage profiles" ON profiles;

-- Create new admin-specific policies
CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can manage orders" ON orders
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can manage profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- 8. Create policies for admin_users table
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- 9. Create policies for admin_roles table
CREATE POLICY "Admins can view admin roles" ON admin_roles
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin roles" ON admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- 10. Enable RLS on new tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- 12. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 13. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_roles TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_admin_permission(UUID, TEXT) TO authenticated;
