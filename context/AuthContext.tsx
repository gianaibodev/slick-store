'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AdminUser {
  id: string
  user_id: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: Record<string, any>
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  adminUser: AdminUser | null
  isAdmin: boolean
  adminRole: string | null
  hasPermission: (permission: string) => boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  
  let supabase: any = null
  try {
    supabase = createClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    // Set loading to false immediately if Supabase fails
    setLoading(false)
  }

  // Fetch admin user data
  const fetchAdminUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        // Silently handle all errors - treat as non-admin
        setAdminUser(null)
        return
      }

      // No error: data may be null (non-admin) or an admin row
      setAdminUser(data ?? null)
    } catch (err) {
      // Silently handle all errors - treat as non-admin
      setAdminUser(null)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Fetch admin status after setting loading to false
        if (session?.user) {
          fetchAdminUser(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    let subscription: any = null
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event: any, session: any) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          
          // Fetch admin status after setting loading to false
          if (session?.user) {
            fetchAdminUser(session.user.id)
          } else {
            setAdminUser(null)
          }
        }
      )
      subscription = authSubscription
    } catch (error) {
      console.error('Error setting up auth state change listener:', error)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not available') }
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not available') }
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: err }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      setAdminUser(null)
      return
    }
    try {
      await supabase.auth.signOut()
      setAdminUser(null)
    } catch (err) {
      console.error('Sign out error:', err)
      setAdminUser(null)
    }
  }

  // Helper functions for admin access
  const isAdmin = adminUser !== null && adminUser.is_active
  const adminRole = adminUser?.role || null
  
  const hasPermission = (permission: string): boolean => {
    if (!adminUser || !adminUser.is_active) return false
    
    // Super admin has all permissions
    if (adminUser.role === 'super_admin') return true
    
    // Check specific permissions
    return adminUser.permissions[permission] === true || adminUser.permissions.all === true
  }

  const value = {
    user,
    session,
    loading,
    adminUser,
    isAdmin,
    adminRole,
    hasPermission,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
