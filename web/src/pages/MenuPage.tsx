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
    <div className="page-section">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <h1 className="section-title mb-3">Menu</h1>
          <p className="section-subtitle">
            Full menu with product name, price, and a quick note.
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="card p-6 md:p-8">
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'var(--color-accent)' }}
              >
                {category}
              </h2>

              <ul className="space-y-4">
                {items.map((product) => (
                  <li
                    key={product.id}
                    className="pb-4 last:pb-0 last:border-0"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm md:text-base font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
                        {product.name}
                      </h3>
                      <span
                        className="shrink-0 text-sm font-semibold"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {product.price_text || '\u2014'}
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {product.short_description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
