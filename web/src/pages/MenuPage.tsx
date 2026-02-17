import { useEffect, useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface Product {
  id: string
  name: string
  short_description: string
  price_text: string | null
  categories: {
    name: string
    slug: string
  } | null
}

export default function MenuPage() {
  useSEO({
    title: 'Menu',
    description: 'Browse the UpliftRoom menu. View cannabis products by category with details on profile, intensity, and more.',
    canonical: 'https://upliftroom.com/menu',
  })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/products`)
        const data = await response.json()

        if (data.status === 'ok') {
          setProducts(data.data)
        } else {
          setError('Failed to load menu items')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu items')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const groupedProducts = useMemo(() => {
    return products.reduce<Record<string, Product[]>>((acc, item) => {
      const key = item.categories?.name || 'other'
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {})
  }, [products])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading menu...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="page-section" style={{ minHeight: 'calc(100vh - var(--nav-height))' }}>
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">Menu</h1>
          <p className="section-subtitle mx-auto" style={{ maxWidth: '480px' }}>
            Full menu with product name, price, and a quick note.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="card" style={{ padding: '32px 32px 24px' }}>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color: 'var(--color-accent)', letterSpacing: '0.15em' }}
              >
                {category}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="last:border-0"
                    style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 0' }}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div style={{ flex: 1 }}>
                        <h3 className="text-base font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          {product.short_description}
                        </p>
                      </div>
                      <span
                        className="shrink-0 text-sm font-bold"
                        style={{ color: 'var(--color-accent)', marginTop: '2px' }}
                      >
                        {product.price_text || '\u2014'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
