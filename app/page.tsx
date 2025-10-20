import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const featuredProducts = [
    { name: 'SLICK RUNNER V1', price: '₱8,999', slug: 'slick-runner-v1' },
    { name: 'SLICK AIR', price: '₱11,999', slug: 'slick-air' },
    { name: 'SLICK CLASSIC', price: '₱7,999', slug: 'slick-classic' },
    { name: 'SLICK PRO', price: '₱14,999', slug: 'slick-pro' },
  ]

  return (
    <div className="min-h-screen bg-royal-800 pb-20 lg:pb-0">
      <Header />
      
      {/* Hero Section - Full Screen Impact */}
      <section className="relative h-screen sm:h-screen md:h-screen lg:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Athletic Performance" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-wider mb-6 transform translate-x-0 opacity-100 transition-all duration-1000 -mt-16">
            JUST DO IT.
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide mb-6 text-white/90">
            DEFINE YOUR STRIDE
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Step into greatness with premium sneakers designed for champions. 
            Built for performance, styled for the streets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-white text-black px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold tracking-wide hover:bg-black hover:text-white hover:border-2 hover:border-white transition-all duration-200 transform hover:-translate-y-1"
            >
              SHOP NOW
            </Link>
            <Link
              href="/about"
              className="inline-block bg-transparent text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold tracking-wide border-2 border-white hover:bg-white hover:text-black transition-all duration-200"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

          {/* Features Section - Clean Lines */}
          <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-royal-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-white mb-4 sm:mb-6">
              WHY CHOOSE SLICK?
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-white/80 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Built for athletes, designed for champions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
            <div className="text-center group">
              <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white mb-3 sm:mb-4">LIGHTNING FAST</h3>
              <p className="text-gray-300 font-light leading-relaxed text-sm sm:text-base">Express delivery across the Philippines in 24-48 hours</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white mb-3 sm:mb-4">100% AUTHENTIC</h3>
              <p className="text-gray-300 font-light leading-relaxed text-sm sm:text-base">Guaranteed genuine sneakers with authenticity certificates</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white mb-3 sm:mb-4">BEST PRICES</h3>
              <p className="text-gray-300 font-light leading-relaxed text-sm sm:text-base">Competitive pricing with exclusive deals for Filipino athletes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black tracking-wider text-white mb-6">
              FEATURED COLLECTION
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 font-light">
              The latest drops from top brands
            </p>
          </div>
          
          {/* Hero Product Showcase */}
          <div className="mb-20">
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80" 
                alt="Featured Sneaker Collection" 
                className="w-full h-96 sm:h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 text-white">
                <h3 className="text-3xl sm:text-4xl font-black tracking-wider mb-4">NEW ARRIVALS</h3>
                <p className="text-lg mb-6 font-light">Fresh kicks for your next adventure</p>
                <Link
                  href="/products"
                  className="inline-block bg-white text-black px-8 py-3 font-bold tracking-wide hover:bg-black hover:text-white hover:border-2 hover:border-white transition-all duration-200"
                >
                  VIEW ALL
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                price={product.price}
                slug={product.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-royal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black tracking-wider text-white mb-8">
            READY TO LEVEL UP?
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Join thousands of athletes who trust Slick for their performance footwear needs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/products"
              className="inline-block bg-black text-white px-12 py-4 text-lg font-bold tracking-wide hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-200 transform hover:-translate-y-1"
            >
              SHOP COLLECTION
            </Link>
            <Link
              href="/signup"
              className="inline-block bg-transparent text-black px-12 py-4 text-lg font-bold tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              JOIN THE TEAM
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}