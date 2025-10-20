'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
  shipping_address: any
  created_at: string
  order_items: OrderItem[]
}

function OrderSuccessContent() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const supabase = createClient()

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided')
      setLoading(false)
      return
    }

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
            created_at,
            order_items (
              id,
              product_name,
              price,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-8"></div>
                <div className="h-32 bg-white/20 rounded"></div>
              </div>
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
              <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
            <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              Thank you! Your order is confirmed.
            </h1>
            <p className="text-gray-200 mb-8">
              We emailed your receipt and will notify you when your items ship.
            </p>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-300">Order Number</p>
                  <p className="text-white font-bold">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">Placed</p>
                  <p className="text-white font-bold">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10 mb-6">
                {order.order_items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/5">
                    <div>
                      <p className="text-white font-semibold">{item.product_name}</p>
                      <p className="text-gray-300 text-sm">Size {item.size} • Qty {item.quantity}</p>
                    </div>
                    <p className="text-white font-bold">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-white text-lg font-bold">Total</span>
                <span className="text-blue-300 text-2xl font-black">₱{order.total_amount.toLocaleString()}</span>
              </div>

              <div className="mt-8 flex gap-4">
                <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Continue Shopping
                </Link>
                <Link href={`/order/${order.id}`} className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition border border-white/20">
                  View Order Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-royal-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
