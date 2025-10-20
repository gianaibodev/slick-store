'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      const searchInput = document.getElementById('search-input') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
      setSearchQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-white/20 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none text-lg"
              style={{ textShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-400/20 text-white py-3 px-6 rounded-lg hover:bg-blue-400/30 transition-all duration-200 font-medium"
              style={{ textShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-white hover:text-gray-300 transition-colors"
              style={{ textShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

