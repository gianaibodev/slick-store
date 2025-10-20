'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import CartIcon from './CartIcon'
import SearchModal from './SearchModal'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  // Pages where the header should auto-hide while scrolling down
  const shouldAutoHide = (() => {
    // Checkout and landing-like experiences
    const autoHidePrefixes = ['/', '/checkout', '/landing']
    // Explicit admin pages should never auto-hide for clarity
    const blockPrefixes = ['/admin']
    if (!pathname) return false
    if (blockPrefixes.some(p => pathname.startsWith(p))) return false
    return autoHidePrefixes.some(p => pathname === p)
  })()

  useEffect(() => {
    setMounted(true)
    // Load cart count from localStorage
    const savedCart = localStorage.getItem('slick-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartItemCount(total)
      } catch (error) {
        console.error('Error parsing cart:', error)
      }
    }

    // Handle scroll effect + auto hide/show
    const handleScroll = () => {
      const currentY = window.scrollY
      setIsScrolled(currentY > 50)

      if (shouldAutoHide) {
        const isScrollingDown = currentY > lastScrollY
        const passedThreshold = currentY > 80
        setIsHidden(isScrollingDown && passedThreshold)
        setLastScrollY(currentY)
      } else {
        setIsHidden(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  // Listen for storage changes to update cart count
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('slick-cart')
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart)
          const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setCartItemCount(total)
        } catch (error) {
          console.error('Error parsing cart:', error)
        }
      } else {
        setCartItemCount(0)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!mounted) {
    return null
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 will-change-transform transition-all duration-300 ${
      isHidden ? '-translate-y-full' : 'translate-y-0'
    } ${
      isScrolled
        ? 'bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-xl'
        : 'bg-white/5 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="text-3xl sm:text-4xl font-bold text-white hover:text-gray-300 transition-colors duration-200">
                  Slick
                </Link>
              </div>

          {/* Utility Icons & Personalized Greeting - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Personalized Greeting */}
            {user && (
              <span className="text-white font-medium text-sm px-3 py-1 rounded-lg bg-royal-500/20" style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.6)' }}>
                Hey {userName}!
              </span>
            )}
            
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-royal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-400/60 rounded-lg transition-all duration-200 hover:scale-110 p-2 hover:bg-royal-500/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.5)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User/Profile Icon */}
            {user ? (
              <Link href="/profile" className="text-white hover:text-royal-400 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-royal-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.5)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link href="/login" className="text-white hover:text-royal-400 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-royal-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.5)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* My Orders Link (when logged in) */}
            {user && (
              <Link href="/my-orders" className="text-white hover:text-royal-400 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-royal-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.5)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </Link>
            )}

            {/* Logout Button (when logged in) */}
            {user && (
              <button
                onClick={handleSignOut}
                className="text-white hover:text-royal-400 transition-all duration-200 text-xs font-medium px-3 py-1 border border-royal-400/30 rounded-lg hover:border-royal-300/60 hover:bg-royal-500/20"
                style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.5)' }}
              >
                Logout
              </button>
            )}

            {/* Shopping Cart Icon */}
            <Link href="/cart" className="relative text-white hover:text-royal-400 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-royal-500/20">
              <CartIcon className="w-6 h-6" style={{ textShadow: '0 0 8px rgba(43, 63, 232, 0.5)' }} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-royal-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Browse Button */}
            <Link
              href="/products"
              className="text-white hover:text-royal-400 transition-all duration-200 font-medium text-lg relative group px-6 py-3 rounded-lg hover:bg-royal-500/20"
              style={{ textShadow: '0 0 10px rgba(43, 63, 232, 0.5)' }}
            >
              Browse
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-royal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-blue-100 transition-colors rounded-lg hover:bg-royal-500/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Modal Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-16 sm:top-20 left-0 right-0 bg-slate-900 border-b border-white/20 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-6 space-y-4">
              <Link 
                href="/products" 
                className="block text-lg font-medium text-white hover:text-royal-400 py-2 px-4 rounded-lg hover:bg-royal-500/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.5)' }}
              >
                Browse
              </Link>
              <Link 
                href="/cart" 
                className="block text-lg font-medium text-white hover:text-royal-400 py-2 px-4 rounded-lg hover:bg-royal-500/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.5)' }}
              >
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              {user ? (
                <>
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <p className="text-sm text-white mb-3 font-medium px-4 py-2 rounded-lg bg-royal-500/20" style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.6)' }}>
                      Hey {userName}!
                    </p>
                    <Link 
                      href="/profile" 
                      className="block text-lg font-medium text-white hover:text-royal-400 py-2 px-4 rounded-lg hover:bg-royal-500/20 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.5)' }}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/my-orders" 
                      className="block text-lg font-medium text-white hover:text-royal-400 py-2 px-4 rounded-lg hover:bg-royal-500/20 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.5)' }}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block text-lg font-medium text-white hover:text-royal-400 py-2 px-4 rounded-lg hover:bg-royal-500/20 transition-all duration-200"
                      style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.5)' }}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="block text-lg font-medium text-white hover:text-royal-400 py-2 px-4 rounded-lg hover:bg-royal-500/20 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ textShadow: '0 0 8px rgba(45, 160, 237, 0.5)' }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
