"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const redirectTo = `${window.location.origin}/update-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) {
        setError(error.message)
      } else {
        setMessage('If an account exists for that email, a reset link has been sent.')
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
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-gray-200">Enter your email to receive a reset link</p>
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
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-royal-400 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-600 text-white py-3 px-4 text-lg font-semibold rounded-lg hover:bg-royal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

