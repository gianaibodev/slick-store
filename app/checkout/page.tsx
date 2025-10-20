'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface CartItem {
  id: string
  name: string
  price: number
  size: number
  quantity: number
  slug: string
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Philippines',
    phone: ''
  })
  const [error, setError] = useState('')
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    // Pre-fill form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-royal-800 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateOrderNumber = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `ORD-${y}${m}${d}-${rnd}`
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    setError('')
    
    try {
      // Validate required fields (trim to avoid whitespace-only)
      const fullName = formData.fullName.trim()
      const email = formData.email.trim()
      const address = formData.address.trim()
      const city = formData.city.trim()

      if (!fullName || !email || !address || !city) {
        setError('Please fill in all required fields')
        return
      }

      if (!user) {
        setError('Please log in to complete checkout')
        return
      }

      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: generateOrderNumber(),
          total_amount: totalPrice,
          shipping_address: {
            name: fullName,
            email,
            address,
            city,
            state: formData.state.trim(),
            zip: formData.zipCode.trim(),
            country: formData.country,
            phone: formData.phone.trim()
          },
          payment_method: 'cash_on_delivery',
          payment_status: 'pending',
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        setError(orderError.message || 'Failed to create order')
        return
      }

      // Create order items
      const orderItems = items.map((item: CartItem) => ({
        order_id: orderData.id,
        product_name: item.name,
        product_slug: item.slug,
        product_price: Number(item.price ?? 0),
        quantity: item.quantity,
        size: item.size
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        setError(itemsError.message || 'Failed to create order items')
        return
      }

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order/success?orderId=${orderData.id}`)
      
    } catch (err) {
      try {
        console.error('Checkout error:', JSON.stringify(err))
      } catch {
        console.error('Checkout error:', err)
      }
      setError(err instanceof Error ? err.message : 'Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-royal-800 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-black text-white mb-8" style={{ letterSpacing: '-0.02em' }}>
              Your Cart is Empty
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Add some items to your cart before checking out
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-royal-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-royal-700 hover:scale-105 transition-all duration-200"
              style={{ letterSpacing: '0.1em' }}
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-12" style={{ letterSpacing: '-0.02em' }}>
            Checkout
          </h1>

          {error && (
            <div className="bg-red-500/15 border border-red-500/60 text-red-100 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white mb-6" style={{ letterSpacing: '-0.01em' }}>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={`${item.id}-${item.size}`} className="bg-royal-500/20 backdrop-blur-sm border border-royal-400/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-lg">{item.name}</h3>
                          <p className="text-gray-300">Size: {item.size}</p>
                          <p className="text-gray-300">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-white font-bold text-lg">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white mb-6" style={{ letterSpacing: '-0.01em' }}>
                Payment Details
              </h2>
              
              <div className="bg-royal-500/20 backdrop-blur-sm border border-royal-400/30 rounded-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      placeholder="Enter your address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your ZIP code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-white">Total Items:</span>
                      <span className="text-lg font-black text-white">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-black text-white">Total Price:</span>
                      <span className="text-2xl font-black text-royal-400">₱{totalPrice.toLocaleString()}</span>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-royal-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-royal-700 hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {isProcessing ? 'PROCESSING...' : 'COMPLETE ORDER'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}