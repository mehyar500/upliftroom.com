import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  profile: string | null
  intensity: string | null
  price_text: string | null
  image_cover_path: string | null
  is_featured: boolean
  categories: {
    name: string
    slug: string
  } | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  async function fetchProducts() {
    try {
      const url = selectedCategory
        ? `${API_URL}/products?category=${selectedCategory}`
        : `${API_URL}/products`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.status === 'ok') {
        setProducts(data.data)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['flower', 'pre-rolls', 'concentrates', 'edibles', 'vapes', 'accessories']

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">Products</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore our curated selection of premium cannabis products
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide text-center transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide text-center transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-cyan-400/60 dark:hover:border-cyan-500/60 transition-all"
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden relative">
                  {product.image_cover_path ? (
                    <img
                      src={product.image_cover_path}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/product-placeholder.svg'
                      }}
                    />
                  ) : (
                    <img
                      src="/product-placeholder.svg"
                      alt={product.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                  
                  {product.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  {/* Category & Profile */}
                  <div className="flex items-center gap-4 mb-2">
                    {product.categories && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {product.categories.name}
                      </span>
                    )}
                    {product.profile && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full capitalize">
                          {product.profile}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {product.short_description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {product.price_text && (
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {product.price_text}
                      </span>
                    )}
                    {product.intensity && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {product.intensity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
