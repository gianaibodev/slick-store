# Admin Role-Based Access Control Setup Guide

This guide will help you set up proper role-based access control (RBAC) for your Slick e-commerce store admin panel.

## 🚀 Quick Setup

### Step 1: Run the Database Setup

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-admin-rbac.sql`
4. Run the SQL script

This will create:
- `admin_users` table for managing admin roles
- `admin_roles` table for role definitions
- Helper functions for checking permissions
- Updated RLS policies

### Step 2: Add Service Role Key

Add your Supabase service role key to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ **Important**: The service role key bypasses RLS and should be kept secure. Only use it server-side.

### Step 3: Set Up Your First Admin

1. Create a user account through the normal signup process
2. Run the setup script:

```bash
cd "/Users/mbam22022/Downloads/Slick Website/slick-store"
node setup-first-admin.js
```

This will make the first user a super admin.

## 🔐 Admin Roles

### Super Admin
- **Role**: `super_admin`
- **Permissions**: All permissions (`all: true`)
- **Can do**: Everything including managing other admin users

### Admin
- **Role**: `admin`
- **Permissions**: Products, orders, users, analytics
- **Can do**: Manage products, orders, view analytics, manage users

### Moderator
- **Role**: `moderator`
- **Permissions**: Products, orders only
- **Can do**: Manage products and orders only

## 🛡️ Security Features

### 1. Row Level Security (RLS)
- All admin operations are protected by RLS policies
- Only authenticated admin users can access admin data
- Super admins can manage other admin users

### 2. Middleware Protection
- Admin routes are protected by middleware
- Automatic redirect to login if not authenticated
- Permission checks for specific admin features

### 3. Context-Based Access Control
- `useAuth()` hook provides admin status
- `isAdmin` - boolean for admin status
- `adminRole` - current user's admin role
- `hasPermission(permission)` - check specific permissions

## 📋 Usage Examples

### Check if User is Admin
```typescript
const { isAdmin, adminRole, hasPermission } = useAuth()

if (isAdmin) {
  // User is an admin
}

if (adminRole === 'super_admin') {
  // User is a super admin
}

if (hasPermission('users')) {
  // User can manage admin users
}
```

### Protect Admin Routes
```typescript
// In your admin component
useEffect(() => {
  if (!authLoading && (!user || !isAdmin)) {
    router.push('/admin/login')
    return
  }
}, [user, isAdmin, authLoading, router])
```

### Add New Admin User
```typescript
// Only super admins can do this
const { data, error } = await supabase
  .from('admin_users')
  .insert({
    user_id: userId,
    role: 'admin',
    permissions: { products: true, orders: true, users: true, analytics: true },
    created_by: currentUserId,
    is_active: true
  })
```

## 🔧 Admin Management

### Adding Admin Users
1. Go to `/admin/users` (super admin only)
2. Click "Add Admin User"
3. Enter the user's email address
4. Select their role (Admin or Moderator)
5. Click "Add Admin User"

### Managing Permissions
- Super admins can activate/deactivate other admin users
- Role permissions are defined in the `admin_roles` table
- Individual permissions can be customized in the `admin_users` table

## 🚨 Security Best Practices

### 1. Service Role Key Security
- Never expose the service role key in client-side code
- Only use it in server-side functions or secure environments
- Consider using environment-specific keys

### 2. Regular Audits
- Regularly review admin user list
- Deactivate unused admin accounts
- Monitor admin activity logs

### 3. Principle of Least Privilege
- Give users only the permissions they need
- Use moderator role for limited access
- Regularly review and update permissions

## 🐛 Troubleshooting

### "Access Denied" Errors
- Check if user is properly added to `admin_users` table
- Verify `is_active` is set to `true`
- Ensure RLS policies are correctly set up

### Permission Errors
- Check user's role in `admin_users` table
- Verify permissions in the `permissions` JSONB column
- Ensure the permission check is using the correct key

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check if service role key has correct permissions
- Ensure database is accessible from your application

## 📊 Monitoring

### Check Admin Users
```sql
SELECT 
  au.*,
  p.email,
  p.full_name
FROM admin_users au
JOIN profiles p ON p.id = au.user_id
WHERE au.is_active = true;
```

### Check User Permissions
```sql
SELECT 
  p.email,
  au.role,
  au.permissions
FROM admin_users au
JOIN profiles p ON p.id = au.user_id
WHERE au.user_id = 'user-uuid-here';
```

## 🔄 Updates and Maintenance

### Adding New Permissions
1. Update the `admin_roles` table with new permissions
2. Update the `hasPermission` function in `AuthContext.tsx`
3. Update admin components to check for new permissions

### Role Changes
1. Update role in `admin_users` table
2. User will need to refresh their session
3. Consider implementing real-time updates for role changes

This setup provides a robust, secure admin system that can scale with your application needs.
