// Simple Admin Setup Script
// This script will help you set up the first admin user

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Starting Admin Setup...')
console.log('Supabase URL:', supabaseUrl)

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey || supabaseServiceKey === 'your_service_role_key_here') {
  console.error('❌ Missing or invalid SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.log('📝 Please get your service role key from Supabase Dashboard:')
  console.log('   1. Go to https://supabase.com/dashboard')
  console.log('   2. Select your project')
  console.log('   3. Go to Settings → API')
  console.log('   4. Copy the service_role key')
  console.log('   5. Replace "your_service_role_key_here" in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupFirstAdmin() {
  try {
    console.log('📋 Fetching existing users...')
    
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    if (users.users.length === 0) {
      console.log('⚠️  No users found. Please create a user account first:')
      console.log('   1. Go to http://localhost:3001/signup')
      console.log('   2. Create an account')
      console.log('   3. Run this script again')
      return
    }

    console.log(`👥 Found ${users.users.length} user(s)`)

    // Show available users
    console.log('\n📋 Available users:')
    users.users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (ID: ${user.id})`)
    })

    // Use the first user as admin
    const firstUser = users.users[0]
    console.log(`\n🔑 Setting up admin for: ${firstUser.email}`)

    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', firstUser.id)
      .single()

    if (existingAdmin) {
      console.log(`✅ User is already an admin with role: ${existingAdmin.role}`)
      return
    }

    // Create admin user record
    console.log('👑 Creating super admin user...')
    const { data: adminUser, error: createError } = await supabase
      .from('admin_users')
      .insert({
        user_id: firstUser.id,
        role: 'super_admin',
        permissions: { all: true },
        created_by: firstUser.id, // Self-created for first admin
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating admin user:', createError.message)
      console.log('\n🔧 Make sure you have run the SQL script in Supabase Dashboard first!')
      return
    }

    console.log('✅ Successfully created super admin user!')
    console.log(`   Email: ${firstUser.email}`)
    console.log(`   Role: ${adminUser.role}`)
    console.log(`   Permissions: ${JSON.stringify(adminUser.permissions)}`)
    
    console.log('\n🎉 Setup complete! You can now:')
    console.log('   1. Go to http://localhost:3001/admin/login')
    console.log('   2. Login with your admin account')
    console.log('   3. Access admin features at /admin/dashboard')

  } catch (error) {
    console.error('❌ Error during setup:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Make sure you have run the SQL script in Supabase Dashboard')
    console.log('   2. Check that your service role key is correct')
    console.log('   3. Ensure your Supabase project is active')
  }
}

// Run the setup
setupFirstAdmin()
