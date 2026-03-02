import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  long_description_md: string | null
  profile: string | null
  intensity: string | null
  price_text: string | null
  image_cover_path: string | null
  image_gallery_paths: string[] | null
  is_featured: boolean
  out_of_stock: boolean
  labels: string[] | null
  strength: string | null
  timing: string | null
  tags: string[] | null
  categories: {
    name: string
    slug: string
  } | null
}

export default function ProductsPage() {
  useSEO({
    title: 'Products',
    description: 'Explore our curated selection of cannabis products. Learn about each product, its profile, and find what fits your vibe.',
    canonical: 'https://upliftroom.com/products',
  })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  async function fetchProducts() {
    setLoading(true)
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

  if (loading && products.length === 0) {
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
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => { setError(null); fetchProducts() }} className="btn-secondary text-sm">
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
          <p className="section-subtitle mx-auto" style={{ maxWidth: '520px' }}>
            Explore our curated selection. Learn about each product, its profile, and find what fits your vibe.
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
            <p style={{ color: 'var(--color-text-tertiary)' }}>No products in this category yet.</p>
            <Link to="/menu" className="btn-secondary text-sm mt-4 inline-flex">View full menu</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="card group cursor-pointer"
              >
                <div
                  className="aspect-square overflow-hidden relative"
                  style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
                >
                  {product.image_cover_path ? (
                    <img
                      src={product.image_cover_path}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = '/product-placeholder.svg' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/product-placeholder.svg" alt={product.name} className="w-1/2 h-1/2 object-contain opacity-30" />
                    </div>
                  )}
                  
                  {product.is_featured && (
                    <div className="absolute top-3 right-3 badge gradient-bg text-white text-[10px]" style={{ border: 'none' }}>
                      Featured
                    </div>
                  )}
                  
                  {product.out_of_stock && (
                    <div className="absolute top-3 left-3 badge bg-red-600 text-white text-[10px]" style={{ border: 'none' }}>
                      Out of Stock
                    </div>
                  )}
                </div>

                <div style={{ padding: '20px 24px 28px' }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {product.categories && (
                      <span className="text-xs capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
                        {product.categories.name}
                      </span>
                    )}
                    {product.profile && (
                      <>
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>&middot;</span>
                        <span className="badge badge-accent capitalize text-[10px]">{product.profile}</span>
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
                      <span className="text-sm font-semibold gradient-text">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
