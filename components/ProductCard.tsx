'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  name: string
  price: string
  slug: string
  imageUrl?: string
}

export default function ProductCard({ name, price, slug, imageUrl }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Safely get cart context
  let addItem: any = null
  try {
    const cartContext = useCart()
    addItem = cartContext.addItem
  } catch (error) {
    // CartProvider not available, addItem will be null
  }

  // Use uploaded image when available; otherwise fall back to consistent demo images by slug
  const getProductImage = (slug: string) => {
    const imageMap: { [key: string]: string } = {
      'slick-runner-v1': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'slick-air': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'slick-classic': 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'slick-pro': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
    if (imageUrl && imageUrl.length > 0) return imageUrl
    return imageMap[slug] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!addItem) {
      console.log('Cart not available')
      return
    }
    
    setIsAddingToCart(true)
    
    try {
      // Extract price number from string (remove ₱ and commas)
      const priceNumber = parseFloat(price.replace(/[₱,]/g, ''))
      
      addItem({
        id: slug,
        name: name,
        price: priceNumber,
        size: 9, // Default size
        slug: slug
      })
      
      // Show success feedback
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
        <Link href={`/products/${slug}`} className="group block">
          <div className="bg-white overflow-hidden rounded-2xl shadow-2xl">
        {/* Product Image - Edge to Edge */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img 
            src={getProductImage(slug)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
            {/* Product Info - Light Glassmorphism Block */}
            <div className="relative p-6 space-y-4 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl mx-4 -mt-8 shadow-2xl">
              {/* Product Name */}
              <h3 className="font-bold text-black text-lg leading-tight">
                {name}
              </h3>
              
              {/* Price */}
              <p className="text-black text-base font-semibold">
                {price}
              </p>
          
              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-black text-white px-6 py-4 text-sm font-semibold rounded-xl hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
                {/* Wishlist Heart Icon */}
                <button
                  onClick={handleWishlist}
                  className="p-4 border-2 border-gray-300 rounded-full hover:border-red-500 hover:bg-red-50 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:scale-110"
                >
              <svg 
                className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none stroke-current text-gray-600 hover:text-red-500'}`}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                />
              </svg>
            </button>
          </div>
          
          {/* Success Notification */}
          {showSuccess && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold animate-pulse">
              ✓ Added to Cart!
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}