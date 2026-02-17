import { useState, useEffect } from 'react'
import ArticleReader from '../components/ArticleReader'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface RSSItem {
  id: string
  title: string
  link: string
  summary: string | null
  content: string | null
  image_url: string | null
  published_at: string
  rss_sources: {
    name: string
    homepage_url: string
  }
}

export default function LatestPage() {
  const [items, setItems] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<RSSItem | null>(null)

  useEffect(() => {
    fetchRSSItems()
  }, [])

  async function fetchRSSItems() {
    try {
      const response = await fetch(`${API_URL}/rss/items?limit=30`)
      const data = await response.json()
      
      if (data.status === 'ok') {
        setItems(data.data)
      } else {
        setError('Failed to load articles')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

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

  function handleArticleClick(e: React.MouseEvent, item: RSSItem) {
    if (item.content && item.content.trim().length > 100) {
      e.preventDefault()
      setActiveArticle(item)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading articles...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchRSSItems() }} className="btn-secondary text-sm">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const featured = items[0]
  const rest = items.slice(1)

  return (
    <div className="page-section">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">Latest Reads</h1>
          <p className="section-subtitle mx-auto" style={{ maxWidth: '520px' }}>
            Cannabis culture, industry news, and lifestyle reads — curated for you.
          </p>
        </div>

        {featured && (
          <a
            href={featured.link}
            target={featured.content && featured.content.trim().length > 100 ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={(e) => handleArticleClick(e, featured)}
            className="card group mb-8 grid grid-cols-1 md:grid-cols-2 overflow-hidden cursor-pointer"
          >
            {featured.image_url ? (
              <div className="aspect-video md:aspect-auto overflow-hidden" style={{ background: 'var(--color-bg-secondary)', minHeight: '280px', borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)' }}>
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            ) : (
              <div className="hidden md:flex items-center justify-center" style={{ background: 'var(--color-bg-secondary)', minHeight: '280px' }}>
                <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            )}
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                <span className="badge badge-accent">{featured.rss_sources.name}</span>
                <span>&middot;</span>
                <span>{formatDate(featured.published_at)}</span>
              </div>
              <h2
                className="text-xl md:text-2xl font-bold mb-3 transition-colors group-hover:opacity-80"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.25 }}
              >
                {featured.title}
              </h2>
              {featured.summary && (
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                  {stripHtml(featured.summary)}
                </p>
              )}
              <span className="mt-4 text-sm font-semibold gradient-text inline-flex items-center gap-2">
                {featured.content && featured.content.trim().length > 100 ? 'Read article' : 'View on source'} <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>
          </a>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target={item.content && item.content.trim().length > 100 ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => handleArticleClick(e, item)}
              className="card group cursor-pointer"
            >
              <div
                className="aspect-video overflow-hidden relative"
                style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement
                      e.currentTarget.style.display = 'none'
                      if (parent) {
                        const placeholder = document.createElement('div')
                        placeholder.className = 'w-full h-full flex items-center justify-center'
                        placeholder.innerHTML = '<svg class="w-10 h-10 opacity-15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>'
                        parent.appendChild(placeholder)
                      }
                    }}
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
                  <span style={{ color: 'var(--color-accent)' }}>{item.rss_sources.name}</span>
                  <span>&middot;</span>
                  <span>{formatDate(item.published_at)}</span>
                </div>
                
                <h3
                  className="text-base font-semibold line-clamp-2 mb-2 transition-colors group-hover:opacity-80"
                  style={{ color: 'var(--color-text)', letterSpacing: '-0.01em', lineHeight: 1.35 }}
                >
                  {item.title}
                </h3>
                
                {item.summary && (
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {stripHtml(item.summary)}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'var(--color-text-tertiary)' }}>No articles available yet. Check back soon.</p>
          </div>
        )}
      </div>

      {activeArticle && (
        <ArticleReader
          title={activeArticle.title}
          source={activeArticle.rss_sources.name}
          sourceUrl={activeArticle.rss_sources.homepage_url}
          date={formatDate(activeArticle.published_at)}
          imageUrl={activeArticle.image_url}
          content={activeArticle.content || activeArticle.summary || ''}
          link={activeArticle.link}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </div>
  )
}
