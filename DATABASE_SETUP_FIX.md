# 🚨 Database Setup Required

## **The Error You're Seeing:**
```
Failed to fetch admin users: Could not find a relationship between 'admin_users' and 'profiles' in the schema cache
```

This means your Supabase database doesn't have the required tables set up yet.

## **🔧 Quick Fix:**

### **Step 1: Run the Complete Database Setup**
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the **entire contents** of `supabase-complete-setup.sql`
4. **Click "Run"** to execute the script

### **Step 2: Create Your First Admin User**
After running the database setup, you need to create your first admin user:

1. **Sign up for a regular user account** on your site
2. **Run the admin setup script**:
   ```bash
   cd /Users/mbam22022/Downloads/slick-store-main
   node setup-first-admin.js
   ```

## **📋 What the Setup Script Creates:**

✅ **All Required Tables:**
- `profiles` - User profile information
- `products` - Product catalog
- `product_variants` - Product sizes and stock
- `orders` - Customer orders
- `order_items` - Order line items
- `order_status_history` - Order tracking
- `admin_users` - Admin user management
- `admin_roles` - Admin role definitions

✅ **Security Features:**
- Row Level Security (RLS) policies
- Admin permission system
- User data protection

✅ **Storage Setup:**
- Product image upload bucket
- Storage access policies

✅ **Helper Functions:**
- Order number generation
- Admin permission checks
- Status change logging

## **🎯 After Setup:**

1. **Your admin dashboard will work** - No more relationship errors
2. **Image uploads will work** - Storage bucket is configured
3. **Order management will work** - All order tables are created
4. **User management will work** - Profiles and admin tables are ready

## **🚨 Important:**
- **Run the SQL script FIRST** before trying to use admin features
- **Create a regular user account** before running the admin setup script
- **The setup script only needs to be run once**

Your database will be fully functional after running this setup! 🎉
