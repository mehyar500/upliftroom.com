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
  labels: string[] | null
  strength: string | null
  timing: string | null
  tags: string[] | null
  categories: {
    name: string
    slug: string
  } | null
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey) }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[560px] rounded-3xl overflow-hidden animate-[slideUp_0.3s_ease-out] relative"
        style={{ background: 'var(--color-bg-elevated)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', boxShadow: 'var(--shadow-md)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div
          className="aspect-[16/9] overflow-hidden relative flex items-center justify-center"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          {product.image_cover_path ? (
            <img
              src={product.image_cover_path}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-30">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-tertiary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {product.categories && (
              <span className="badge badge-cyan capitalize">{product.categories.name}</span>
            )}
            {product.profile && (
              <span className="badge badge-accent capitalize">{product.profile}</span>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {product.price_text && (
            <p className="text-lg font-semibold mb-4 gradient-text">{product.price_text}</p>
          )}

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            {product.short_description}
          </p>

          {(product.intensity || product.strength || product.timing) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {product.intensity && <span className="pill text-xs capitalize">{product.intensity} Intensity</span>}
              {product.strength && <span className="pill text-xs capitalize">{product.strength}</span>}
              {product.timing && <span className="pill text-xs capitalize">{product.timing}</span>}
            </div>
          )}

          {product.labels && product.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {product.labels.map((label, i) => (
                <span key={i} className="badge badge-cyan">{label}</span>
              ))}
            </div>
          )}

          {product.long_description_md && (
            <div
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {product.long_description_md.split('\n').map((line, i) => (
                <p key={i} className="mb-2.5">{line}</p>
              ))}
            </div>
          )}

          {product.image_gallery_paths && product.image_gallery_paths.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {product.image_gallery_paths.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
                  <img src={img} alt={`${product.name} gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] mt-5 pt-4" style={{ color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)' }}>
            Effects may vary by person. This product is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  )
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
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

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
              <div
                key={product.id}
                className="card group cursor-pointer"
                onClick={() => setActiveProduct(product)}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {activeProduct && (
        <ProductDetailModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </div>
  )
}
