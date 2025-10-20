'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import CartIcon from '@/components/CartIcon'

interface CartItem {
  id: string
  name: string
  price: number
  size: number
  quantity: number
  slug: string
  imageUrl?: string
}

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-royal-800 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
              Your Cart
            </h1>
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Cart
          </h1>

          {totalItems === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 mx-4 shadow-xl">
                <div className="flex justify-center mb-6">
                  <CartIcon className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-200 shadow-lg"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item: CartItem) => (
                <div key={`${item.id}-${item.size}`} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                        <img 
                          src={item.imageUrl || `https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-gray-600">Size: {item.size}</p>
                        <p className="text-gray-900 font-semibold">₱{(item.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(`${item.id}-${item.size}`, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(`${item.id}-${item.size}`, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(`${item.id}-${item.size}`)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total Items:</span>
                  <span className="text-lg font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total Price:</span>
                    <span className="text-2xl font-bold text-gray-900">₱{(totalPrice || 0).toLocaleString()}</span>
                </div>
                    <Link
                      href="/checkout"
                      className="block w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-xl text-center"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      PROCEED TO CHECKOUT
                    </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}