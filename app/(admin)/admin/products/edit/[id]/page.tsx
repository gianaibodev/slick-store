'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/ImageUpload'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  brand: string
  status: string
  image_url?: string
  variants: Array<{
    id: string
    size: string
    stock: number
  }>
}

export default function EditProductPage() {
  const params = useParams()
  const id = (params?.id as string) || ''
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const supabase = createClient()
      
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (productError) {
        setError('Product not found')
        return
      }

      // Fetch variants
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id, size, stock')
        .eq('product_id', id)

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()
      
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          brand: product.brand,
          status: product.status,
          image_url: product.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (productError) {
        setError('Failed to update product')
        return
      }

      // Update variants
      for (const variant of product.variants) {
        if (variant.id) {
          // Update existing variant
          const { error: variantError } = await supabase
            .from('product_variants')
            .update({
              size: variant.size,
              stock: variant.stock,
              updated_at: new Date().toISOString()
            })
            .eq('id', variant.id)

          if (variantError) {
            console.error('Error updating variant:', variantError)
          }
        } else {
          // Create new variant
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert({
              product_id: id,
              size: variant.size,
              stock: variant.stock
            })

          if (variantError) {
            console.error('Error creating variant:', variantError)
          }
        }
      }

      setSuccess('Product and variants updated successfully!')
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (err) {
      console.error('Save error:', err)
      setError('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleVariantAdd = () => {
    if (!product) return
    setProduct({
      ...product,
      variants: [...product.variants, { id: '', size: '', stock: 0 }]
    })
  }

  const handleVariantUpdate = (index: number, field: string, value: string | number) => {
    if (!product) return
    const newVariants = [...product.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setProduct({ ...product, variants: newVariants })
  }

  const handleVariantRemove = async (index: number) => {
    if (!product) return
    
    const variantToRemove = product.variants[index]
    
    // If variant has an ID, delete it from database
    if (variantToRemove.id) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('product_variants')
          .delete()
          .eq('id', variantToRemove.id)
        
        if (error) {
          console.error('Error deleting variant:', error)
        }
      } catch (err) {
        console.error('Error deleting variant:', err)
      }
    }
    
    // Remove from local state
    const newVariants = product.variants.filter((_, i) => i !== index)
    setProduct({ ...product, variants: newVariants })
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Edit Product
          </h1>
          <p className="text-slate-600">Loading product details...</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/50">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Product Not Found
          </h1>
          <p className="text-slate-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Edit Product
        </h1>
        <p className="text-slate-600">Update product information and variants</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/50">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center text-white text-sm font-bold">
                📝
              </span>
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={4}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                    step="0.01"
                    className="w-full p-4 pl-8 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={product.brand}
                  onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={product.status}
                  onChange={(e) => setProduct({ ...product, status: e.target.value })}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <ImageUpload
                  onImageUploaded={(url) => setProduct({ ...product, image_url: url })}
                  currentImageUrl={product.image_url || ''}
                />
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center text-white text-sm font-bold">
                📦
              </span>
              Product Variants
            </h2>
            <div className="space-y-4">
              {product.variants.map((variant, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Size
                      </label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => handleVariantUpdate(index, 'size', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                        placeholder="9"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantUpdate(index, 'stock', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                        placeholder="10"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVariantRemove(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleVariantAdd}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-semibold"
              >
                Add Variant
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-8 py-3 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
