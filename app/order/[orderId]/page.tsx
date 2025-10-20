'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

interface OrderItem {
  id: string
  product_name: string
  price: number
  quantity: number
  size: number
  product_slug: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  shipping_address: any
  billing_address: any
  payment_method: string
  payment_status: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

interface OrderPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default function OrderPage({ params }: OrderPageProps) {
  const [orderId, setOrderId] = useState<string>('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = createClient()
  
  useEffect(() => {
    params.then(({ orderId: id }) => {
      setOrderId(id)
    })
  }, [params])

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            total_amount,
            status,
            shipping_address,
            payment_method,
            payment_status,
            created_at,
            updated_at,
            order_items (
              id,
              product_name,
              product_price as price,
              quantity,
              size,
              product_slug
            )
          `)
          .eq('id', orderId)
          .single()

        if (error) throw error
        setOrder(data)
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, supabase])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-4"></div>
              <div className="h-4 bg-white/20 rounded mb-8"></div>
              <div className="h-32 bg-white/20 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
              <h1 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                Order Not Found
              </h1>
              <p className="text-gray-200 mb-8">
                {error || 'We couldn\'t find the order you\'re looking for.'}
              </p>
              <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                Continue Shopping
              </Link>
            </div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              Order #{order.order_number}
            </h1>
            <p className="text-gray-200">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          {/* Order Status */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                  Order Status
                </h2>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-300">
                  ₱{order.total_amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-300">Total</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-lg font-black text-white mb-6" style={{ letterSpacing: '-0.01em' }}>
              Order Items
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-white/10 last:border-b-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👟</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-white">{item.product_name}</h3>
                    <p className="text-sm text-gray-300">Size: {item.size}</p>
                    <p className="text-sm text-gray-300">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-300">
                      ₱{item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-lg font-black text-white mb-4" style={{ letterSpacing: '-0.01em' }}>
              Shipping Address
            </h2>
            <div className="text-gray-200">
              <p className="font-black text-white">{order.shipping_address.name}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>

          {/* Back to Orders */}
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-blue-700 hover:scale-105 transition-all duration-200"
              style={{ letterSpacing: '0.1em' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}