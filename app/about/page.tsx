import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-royal-700 pb-20 lg:pb-0">
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8">
            About <span className="text-royal-300">Slick</span>
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-2xl text-gray-200 mb-16 font-medium leading-relaxed">
              We are a premium streetwear brand dedicated to creating the most comfortable and stylish sneakers for the urban enthusiast.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-20">
              <div className="group">
                <h2 className="text-3xl font-bold text-white mb-8">
                  <span className="text-royal-300 group-hover:text-royal-200 transition-colors duration-200">Our Mission</span>
                </h2>
                <p className="text-gray-200 leading-relaxed text-xl font-medium">
                  To define your stride with exclusive drops and premium sneakers that combine comfort, style, and durability. We believe that great shoes should not only look amazing but also feel incredible on your feet.
                </p>
              </div>
              
              <div className="group">
                <h2 className="text-3xl font-bold text-white mb-8">
                  <span className="text-royal-300 group-hover:text-royal-200 transition-colors duration-200">Our Vision</span>
                </h2>
                <p className="text-gray-200 leading-relaxed text-xl font-medium">
                  To become the leading streetwear brand that sets trends and inspires confidence in every step our customers take. We're committed to innovation and quality in everything we create.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-16 my-20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-12">
                <span className="text-royal-300">Why Choose Slick?</span>
              </h2>
              <ul className="space-y-6 text-gray-200">
                <li className="flex items-start text-xl font-medium group">
                  <span className="text-royal-300 mr-6 text-2xl font-black group-hover:scale-110 transition-transform duration-200">✓</span>
                  <span className="group-hover:text-white transition-colors duration-200">Premium materials and construction</span>
                </li>
                <li className="flex items-start text-xl font-medium group">
                  <span className="text-royal-300 mr-6 text-2xl font-black group-hover:scale-110 transition-transform duration-200">✓</span>
                  <span className="group-hover:text-white transition-colors duration-200">Limited edition drops and exclusive designs</span>
                </li>
                <li className="flex items-start text-xl font-medium group">
                  <span className="text-royal-300 mr-6 text-2xl font-black group-hover:scale-110 transition-transform duration-200">✓</span>
                  <span className="group-hover:text-white transition-colors duration-200">Sustainable and ethical manufacturing</span>
                </li>
                <li className="flex items-start text-xl font-medium group">
                  <span className="text-royal-300 mr-6 text-2xl font-black group-hover:scale-110 transition-transform duration-200">✓</span>
                  <span className="group-hover:text-white transition-colors duration-200">Free worldwide shipping on all orders</span>
                </li>
                <li className="flex items-start text-xl font-medium group">
                  <span className="text-royal-300 mr-6 text-2xl font-black group-hover:scale-110 transition-transform duration-200">✓</span>
                  <span className="group-hover:text-white transition-colors duration-200">30-day satisfaction guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
