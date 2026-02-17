import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface RSSItem {
  id: string
  title: string
  link: string
  summary: string | null
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
        setError('Failed to load news')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading latest news...</span>
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
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="section-title mb-3">Latest News</h1>
          <p className="section-subtitle mx-auto" style={{ maxWidth: '480px' }}>
            Stay updated with cannabis culture and industry news
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card group"
            >
              {item.image_url && (
                <div className="aspect-video overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>{item.rss_sources.name}</span>
                  <span>&middot;</span>
                  <span>{formatDate(item.published_at)}</span>
                </div>
                
                <h3
                  className="text-base font-semibold line-clamp-2 mb-2 transition-colors group-hover:opacity-80"
                  style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}
                >
                  {item.title}
                </h3>
                
                {item.summary && (
                  <p className="text-sm line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.summary}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'var(--color-text-tertiary)' }}>No news items available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
