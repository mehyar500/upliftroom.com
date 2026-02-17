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
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'ok') {
        setItems(data.data || [])
      } else {
        setError(data.message || 'Failed to load news')
      }
    } catch (err) {
      console.error('RSS fetch error:', err)
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading latest news...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Latest News</h1>
          <p className="text-slate-400">Stay updated with cannabis culture and industry news</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all"
            >
              {item.image_url && (
                <div className="aspect-video bg-slate-800 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="text-cyan-400">{item.rss_sources.name}</span>
                  <span>•</span>
                  <span>{formatDate(item.published_at)}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                
                {item.summary && (
                  <p className="text-sm text-slate-400 line-clamp-3">
                    {item.summary}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No news items available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

