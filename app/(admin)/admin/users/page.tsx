'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  user_id: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
  profiles: {
    email: string
    full_name: string | null
  }
}

export default function AdminUsers() {
  const { user, isAdmin, adminRole, hasPermission, loading: authLoading } = useAuth()
  const router = useRouter()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator'>('admin')

  useEffect(() => {
    // Check admin access
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/admin/login')
      return
    }

    // Check if user has permission to manage users
    if (!authLoading && isAdmin && !hasPermission('users')) {
      router.push('/admin/dashboard')
      return
    }

    if (user && isAdmin && hasPermission('users')) {
      fetchAdminUsers()
    }
  }, [user, isAdmin, hasPermission, authLoading, router])

  const fetchAdminUsers = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          *,
          profiles (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdminUsers(data as AdminUser[])
    } catch (err) {
      console.error('Error fetching admin users:', err)
      setError('Failed to fetch admin users: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail.trim()) return

    setLoading(true)
    setError('')
    const supabase = createClient()

    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newUserEmail)
        .single()

      if (userError || !userData) {
        setError('User not found with that email address')
        setLoading(false)
        return
      }

      // Create admin user record
      const { error: createError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userData.id,
          role: newUserRole,
          permissions: newUserRole === 'admin' 
            ? { products: true, orders: true, users: true, analytics: true }
            : { products: true, orders: true },
          created_by: user?.id,
          is_active: true
        })

      if (createError) throw createError

      // Refresh the list
      await fetchAdminUsers()
      setShowAddForm(false)
      setNewUserEmail('')
      setNewUserRole('admin')
    } catch (err) {
      console.error('Error adding admin user:', err)
      setError('Failed to add admin user: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (adminUserId: string, currentStatus: boolean) => {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !currentStatus })
        .eq('id', adminUserId)

      if (error) throw error
      await fetchAdminUsers()
    } catch (err) {
      console.error('Error updating admin user:', err)
      setError('Failed to update admin user: ' + (err as Error).message)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'moderator':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (authLoading || loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Admin Users
        </h1>
        <p className="text-slate-600 mb-8">
          {authLoading ? 'Checking authentication...' : 'Loading admin users...'}
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-6">You don't have admin privileges to access this page.</p>
        <button
          onClick={() => router.push('/admin/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Admin Login
        </button>
      </div>
    )
  }

  if (!hasPermission('users')) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Insufficient Permissions</h1>
        <p className="text-slate-600 mb-6">You don't have permission to manage admin users.</p>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Admin Users
          </h1>
          <p className="text-slate-600">Manage admin access and permissions</p>
        </div>
        {adminRole === 'super_admin' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {showAddForm ? 'Cancel' : 'Add Admin User'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-white/50 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Add New Admin User</h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user's email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Admin Role
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'moderator')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Admin User'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-white/50">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminUsers.map((adminUser) => (
                <tr key={adminUser.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {adminUser.profiles?.full_name || 'No name'}
                      </div>
                      <div className="text-xs text-slate-500">{adminUser.profiles?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(adminUser.role)}`}>
                      {adminUser.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      adminUser.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {adminUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(adminUser.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {adminRole === 'super_admin' && (
                      <button
                        onClick={() => handleToggleActive(adminUser.id, adminUser.is_active)}
                        className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                          adminUser.is_active
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {adminUser.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
