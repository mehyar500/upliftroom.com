import { useEffect, useRef } from 'react'

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const scripts = doc.querySelectorAll('script, style, iframe, object, embed, form, input, textarea, link')
  scripts.forEach(el => el.remove())
  doc.querySelectorAll('*').forEach(el => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on') || attr.name === 'srcdoc' || (attr.name === 'href' && attr.value.startsWith('javascript:'))) {
        el.removeAttribute(attr.name)
      }
    }
  })
  return doc.body.innerHTML
}

interface ArticleReaderProps {
  title: string
  source: string
  sourceUrl: string
  date: string
  imageUrl: string | null
  content: string
  link: string
  onClose: () => void
}

export default function ArticleReader({
  title,
  source,
  sourceUrl,
  date,
  imageUrl,
  content,
  link,
  onClose,
}: ArticleReaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-[720px] my-8 mx-4 rounded-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]"
        style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-xl)' }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-accent)' }}
            >
              {source}
            </a>
            <span>&middot;</span>
            <span>{date}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {imageUrl && (
          <div className="aspect-video overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}

        <div className="px-6 py-8 md:px-10 md:py-10">
          <h1
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}
          >
            {title}
          </h1>

          <div
            className="article-content text-sm leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex"
            >
              Read on {source} &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
