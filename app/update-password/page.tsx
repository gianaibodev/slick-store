"use client"

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // When the user lands here from email link, Supabase will provide a session
    // via the URL hash. We can ensure session is present; otherwise, redirect.
    const ensureSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Your reset link is invalid or has expired. Please request a new one.')
      }
    }
    ensureSession()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Password updated. You can now log in.')
        setTimeout(() => router.push('/login'), 1200)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-royal-700">
      <Header />
      <main className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Update Password</h1>
            <p className="text-gray-200">Enter a new password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/15 border border-red-500/60 rounded-lg p-4">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            {message && (
              <div className="bg-green-500/15 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-100 text-sm">{message}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-royal-400 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-royal-400 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-600 text-white py-3 px-4 text-lg font-semibold rounded-lg hover:bg-royal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}


