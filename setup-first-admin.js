// Setup First Admin User
// Run this script after creating a user account to make them an admin

const { createClient } = require('@supabase/supabase-js')

// Replace with your Supabase URL and service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need to add this to your .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupFirstAdmin() {
  try {
    // Get the first user (you can modify this to target a specific user)
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }

    if (users.users.length === 0) {
      console.log('No users found. Please create a user account first.')
      return
    }

    const firstUser = users.users[0]
    console.log('Setting up admin for user:', firstUser.email)

    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', firstUser.id)
      .single()

    if (existingAdmin) {
      console.log('User is already an admin with role:', existingAdmin.role)
      return
    }

    // Create admin user record
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
      console.error('Error creating admin user:', createError)
      return
    }

    console.log('✅ Successfully created super admin user:', adminUser)
    console.log('User email:', firstUser.email)
    console.log('Admin role:', adminUser.role)

  } catch (error) {
    console.error('Error setting up first admin:', error)
  }
}

// Run the setup
setupFirstAdmin()
