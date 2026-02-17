import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  image_cover_path: string | null
  is_featured: boolean
  strength: string | null
  timing: string | null
  price_text: string | null
  categories: {
    name: string
    slug: string
  } | null
}

interface RSSItem {
  id: string
  title: string
  link: string
  summary: string | null
  image_url: string | null
  published_at: string
  rss_sources: {
    name: string
  }
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products`}
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
      </div>
      <div style={{ padding: '20px 24px 28px' }}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {product.categories && (
            <span className="text-xs capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
              {product.categories.name}
            </span>
          )}
          {product.timing && (
            <>
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>&middot;</span>
              <span className="badge badge-accent capitalize text-[10px]">{product.timing}</span>
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
          {product.strength && (
            <span className="text-xs capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
              {product.strength}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ article }: { article: RSSItem }) {
  function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card group cursor-pointer"
    >
      <div
        className="aspect-video overflow-hidden relative"
        style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
      >
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 opacity-15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ padding: '20px 24px 28px' }}>
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
          <span style={{ color: 'var(--color-accent)' }}>{article.rss_sources.name}</span>
          <span>&middot;</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
        <h3
          className="text-base font-semibold line-clamp-2 mb-2 transition-colors group-hover:opacity-80"
          style={{ color: 'var(--color-text)', letterSpacing: '-0.01em', lineHeight: 1.35 }}
        >
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
            {stripHtml(article.summary)}
          </p>
        )}
      </div>
    </a>
  )
}

export default function HomePage() {
  useSEO()

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [latestArticles, setLatestArticles] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [productsRes, articlesRes] = await Promise.all([
          fetch(`${API_URL}/products?limit=4`),
          fetch(`${API_URL}/rss/items?limit=6`)
        ])

        const productsData = await productsRes.json()
        const articlesData = await articlesRes.json()

        if (productsData.status === 'ok') {
          const featured = productsData.data.filter((p: Product) => p.is_featured).slice(0, 4)
          setFeaturedProducts(featured.length > 0 ? featured : productsData.data.slice(0, 4))
        }

        if (articlesData.status === 'ok') {
          setLatestArticles(articlesData.data.slice(0, 6))
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="absolute inset-0">
          <img
            src="/images/hero-gradient.png"
            alt=""
            className="w-full h-full object-cover opacity-40"
            style={{ mixBlendMode: 'screen' }}
          />
          <div className="absolute inset-0" style={{ background: 'var(--color-bg)', opacity: 0.6 }} />
        </div>

        <div
          className="relative"
          style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <img
              src="/upliftroom-logo.svg"
              alt="UpliftRoom"
              style={{ width: '96px', height: '96px' }}
            />
          </div>

          <h1
            className="gradient-text"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
            }}
          >
            UpliftRoom
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.375rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '540px',
              margin: '24px auto 0',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            Explore cannabis culture, learn about products, and find your vibe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ marginTop: '40px' }}>
            <Link to="/products" className="btn-primary w-full sm:w-auto">
              Explore Products
            </Link>
            <Link to="/latest" className="btn-secondary w-full sm:w-auto">
              Read &amp; Learn
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Featured Products</h2>
            <p className="section-subtitle mx-auto" style={{ maxWidth: '480px' }}>
              Handpicked products based on what people love right now.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/products"
                  className="text-sm font-semibold transition-opacity hover:opacity-70 inline-flex items-center gap-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  View all products &rarr;
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: 'var(--color-text-tertiary)' }}>No products available yet.</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '64px 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Latest Reads</h2>
            <p className="section-subtitle mx-auto" style={{ maxWidth: '500px' }}>
              Cannabis culture, wellness, and lifestyle articles curated for you.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : latestArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {latestArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/latest"
                  className="text-sm font-semibold transition-opacity hover:opacity-70 inline-flex items-center gap-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  View all articles &rarr;
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: 'var(--color-text-tertiary)' }}>No articles available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
