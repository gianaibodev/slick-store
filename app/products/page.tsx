import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // Fallback products if database is empty or error
  const fallbackProducts = [
    { name: 'SLICK RUNNER V1', price: 8999, slug: 'slick-runner-v1' },
    { name: 'SLICK AIR', price: 11999, slug: 'slick-air' },
    { name: 'SLICK CLASSIC', price: 7999, slug: 'slick-classic' },
    { name: 'SLICK PRO', price: 14999, slug: 'slick-pro' },
  ]

  const displayProducts = products && products.length > 0 ? products : fallbackProducts

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12">
            All Products
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                price={`₱${product.price.toLocaleString()}`}
                slug={product.slug}
                imageUrl={(product as any).image_url}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
