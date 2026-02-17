import { useEffect, useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface Product {
  id: string
  name: string
  short_description: string
  price_text: string | null
  image_cover_path: string | null
  categories: {
    name: string
    slug: string
  } | null
}

export default function MenuPage() {
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <p className="text-slate-600 dark:text-slate-300">Loading menu...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Menu</h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2">
          Long vertical menu with thumbnails, name, price, and a compact description.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div
            key={category}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-4 md:p-5"
          >
            <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-4">
              {category}
            </h2>

            <ul className="space-y-3">
              {items.map((product) => (
                <li key={product.id} className="border-b border-slate-200/80 dark:border-slate-700/80 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={product.image_cover_path || '/product-placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/product-placeholder.svg'
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate pr-2">
                          {product.name}
                        </h3>
                        <span className="shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {product.price_text || '—'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-snug line-clamp-2">
                        {product.short_description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
