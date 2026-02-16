import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent dark:from-green-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-6 md:space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              UpliftRoom
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Your lifestyle destination for premium cannabis products and culture
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 md:pt-8 px-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 text-center"
              >
                Browse Products
              </Link>
              
              <Link
                to="/latest"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-center"
              >
                Latest News
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Link
            to="/products"
            className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            <div className="relative">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Premium Products</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Curated selection of quality cannabis products for every preference
              </p>
            </div>
          </Link>

          <Link
            to="/latest"
            className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Latest News</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Stay updated with cannabis culture, industry news, and lifestyle content
              </p>
            </div>
          </Link>

          <div className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8">
            <div className="relative">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Lifestyle Forward</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Modern approach to cannabis culture with compliance and quality first
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
