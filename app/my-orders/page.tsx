'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

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
  payment_status: string
  shipping_address: any
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  // Refresh list when user returns from success page
  useEffect(() => {
    const handler = () => fetchOrders()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  const fetchOrders = async () => {
    try {
      // 1) Fetch orders for this user (without embedding) to avoid RLS join issues
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(
          'id, order_number, total_amount, status, payment_status, shipping_address, created_at, updated_at'
        )
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError
      const baseOrders = ordersData || []

      if (baseOrders.length === 0) {
        setOrders([])
        return
      }

      // 2) Fetch items for those orders in one query
      const orderIds = baseOrders.map((o: any) => o.id)
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('id, order_id, product_name, product_price, quantity, size, product_slug')
        .in('order_id', orderIds)

      if (itemsError) throw itemsError

      const orderIdToItems: Record<string, any[]> = {}
      ;(itemsData || []).forEach((item: any) => {
        const list = orderIdToItems[item.order_id] || []
        list.push({
          id: item.id,
          product_name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          size: item.size,
          product_slug: item.product_slug,
        })
        orderIdToItems[item.order_id] = list
      })

      const composed = baseOrders.map((o: any) => ({
        ...o,
        order_items: orderIdToItems[o.id] || [],
      })) as Order[]

      setOrders(composed)
    } catch (err) {
      try { console.error('Failed to fetch orders:', JSON.stringify(err)) } catch { console.error('Failed to fetch orders:', err) }
      setError('Failed to load your orders')
    } finally {
      setLoading(false)
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'processing':
        return '🔄'
      case 'shipped':
        return '📦'
      case 'delivered':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return '📋'
    }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  if (!user) {
    return (
      <div className="min-h-screen bg-royal-500/20 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl text-center">
              <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                Sign In Required
              </h1>
              <p className="text-gray-200 mb-8">
                Please sign in to view your order history.
              </p>
              <Link href="/login" className="inline-block bg-royal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-royal-700 transition">
                Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-500/20 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-8"></div>
              <div className="h-64 bg-white/20 rounded"></div>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              My Orders
            </h1>
            <p className="text-gray-200 text-lg">
              Track your orders and view order history
            </p>
            
            {/* Status Filter */}
            <div className="flex gap-4 mb-6 mt-6">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === 'all'
                    ? 'bg-royal-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setSelectedStatus('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === 'pending'
                    ? 'bg-royal-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Pending ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setSelectedStatus('processing')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === 'processing'
                    ? 'bg-royal-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Processing ({orders.filter(o => o.status === 'processing').length})
              </button>
              <button
                onClick={() => setSelectedStatus('shipped')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === 'shipped'
                    ? 'bg-royal-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Shipped ({orders.filter(o => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setSelectedStatus('delivered')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === 'delivered'
                    ? 'bg-royal-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getStatusIcon(order.status)}</div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-gray-300">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-royal-300">
                      ₱{order.total_amount.toLocaleString()}
                    </p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-lg font-black text-white mb-3" style={{ letterSpacing: '-0.01em' }}>
                    Items ({order.order_items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-semibold">{item.product_name}</p>
                          <p className="text-gray-300 text-sm">Size {item.size} • Qty {item.quantity}</p>
                        </div>
                        <p className="text-white font-bold">₱{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-4 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-lg font-black text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                    Shipping Address
                  </h4>
                  <div className="text-gray-200">
                    <p className="font-semibold">{order.shipping_address?.name}</p>
                    <p>{order.shipping_address?.address}</p>
                    <p>
                      {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}
                    </p>
                    <p>{order.shipping_address?.country}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link
                    href={`/order/${order.id}`}
                    className="bg-royal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-royal-700 transition"
                  >
                    View Details
                  </Link>
                  {order.status === 'delivered' && (
                    <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 shadow-xl text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-black text-white mb-4" style={{ letterSpacing: '-0.01em' }}>
                {selectedStatus === 'all' ? 'No Orders Yet' : `No ${selectedStatus} Orders`}
              </h3>
              <p className="text-gray-200 mb-8">
                {selectedStatus === 'all' 
                  ? 'Start shopping to see your orders here!'
                  : `You don't have any ${selectedStatus} orders at the moment.`
                }
              </p>
              <Link href="/products" className="inline-block bg-royal-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-royal-700 hover:scale-105 transition-all duration-200">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
