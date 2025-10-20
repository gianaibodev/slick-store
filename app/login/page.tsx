'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    
    setLoading(false)
  }
  return (
    <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              Login to Slick
            </h1>
            <p className="text-gray-200 font-medium">
              Welcome back to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-royal-400 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-royal-400 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-600 text-white py-3 px-4 text-lg font-bold uppercase tracking-wide rounded-xl hover:bg-royal-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ letterSpacing: '0.05em' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-200">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="text-royal-200 hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-gray-200 mt-2">
              <Link href="/forgot-password" className="text-royal-200 hover:underline">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
