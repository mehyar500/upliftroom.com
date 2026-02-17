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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading products...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchProducts() }} className="btn-secondary text-sm">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="section-title mb-3">Products</h1>
          <p className="section-subtitle mx-auto" style={{ maxWidth: '480px' }}>
            Explore our curated selection of premium cannabis products
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`pill ${selectedCategory === null ? 'pill-active' : ''}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill capitalize ${selectedCategory === cat ? 'pill-active' : ''}`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--color-text-tertiary)' }}>No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map(product => (
              <div key={product.id} className="card group">
                <div
                  className="aspect-square overflow-hidden relative"
                  style={{ background: 'var(--color-bg-secondary)' }}
                >
                  {product.image_cover_path ? (
                    <img
                      src={product.image_cover_path}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/product-placeholder.svg'
                      }}
                    />
                  ) : (
                    <img
                      src="/product-placeholder.svg"
                      alt={product.name}
                      className="w-full h-full object-cover opacity-40"
                    />
                  )}
                  
                  {product.is_featured && (
                    <div className="absolute top-3 right-3 badge gradient-bg text-white" style={{ border: 'none' }}>
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {product.categories && (
                      <span className="text-xs capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
                        {product.categories.name}
                      </span>
                    )}
                    {product.profile && (
                      <>
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>&middot;</span>
                        <span className="badge badge-accent capitalize">{product.profile}</span>
                      </>
                    )}
                  </div>

                  <h3
                    className="text-base font-semibold mb-1.5 line-clamp-2 transition-colors group-hover:opacity-80"
                    style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}
                  >
                    {product.name}
                  </h3>

                  <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {product.short_description}
                  </p>

                  <div className="flex items-center justify-between">
                    {product.price_text && (
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                        {product.price_text}
                      </span>
                    )}
                    {product.intensity && (
                      <span className="text-xs capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
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
