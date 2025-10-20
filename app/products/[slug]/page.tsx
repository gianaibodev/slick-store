'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
  brand: string
  slug?: string
  variants: Array<{
    id: string
    size: string
    stock: number
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [slug, setSlug] = useState<string>('')
  
  useEffect(() => {
    params.then(({ slug: productSlug }) => {
      setSlug(productSlug)
    })
  }, [params])
  
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      const supabase = createClient()
      
      // Fetch product by slug
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (productError) {
        setError('Product not found')
        return
      }

      // Fetch variants
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id, size, stock')
        .eq('product_id', productData.id)

      setProduct({
        ...productData,
        variants: variants || []
      })
    } catch (err) {
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return

    const variant = product.variants.find(v => v.size === selectedSize)
    if (!variant || variant.stock <= 0) {
      alert('This size is out of stock')
      return
    }

    setIsAdding(true)
    
    addItem({
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      price: product.price,
      size: parseInt(selectedSize),
      slug: product.slug || product.id
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The product you&apos;re looking for doesn&apos;t exist or is no longer available.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-royal-600 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  👟
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-gray-900 mb-2">
                  ${product.price}
                </p>
                <p className="text-gray-600">
                  by {product.brand}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Size
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedSize(variant.size)}
                      disabled={variant.stock <= 0}
                      className={`p-3 border rounded-lg text-center font-medium transition-colors ${
                        selectedSize === variant.size
                          ? 'border-black bg-black text-white'
                          : variant.stock <= 0
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isAdding}
                className="w-full bg-black text-white py-4 px-6 text-lg font-semibold rounded-lg hover:bg-royal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}