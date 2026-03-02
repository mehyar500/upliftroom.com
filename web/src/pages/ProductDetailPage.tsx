import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
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
  base_price: number | null
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

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useSEO({
    title: product ? product.name : 'Product',
    description: product?.short_description || 'View product details',
    canonical: `https://upliftroom.com/products/${slug}`,
    ogImage: product?.image_cover_path || undefined,
    ogType: 'product',
    productPrice: product?.base_price?.toString(),
    productAvailability: product?.out_of_stock ? 'out of stock' : 'in stock',
  })

  const fetchProduct = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/products/${slug}`)
      const data = await response.json()
      
      if (data.status === 'ok' && data.data) {
        setProduct(data.data)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug, fetchProduct])

  useEffect(() => {
    function handleClickOutside() {
      if (showShareMenu) {
        setShowShareMenu(false)
      }
    }
    
    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [slug, fetchProduct])

  useEffect(() => {
    function handleClickOutside() {
      if (showShareMenu) {
        setShowShareMenu(false)
      }
    }
    
    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showShareMenu])

  const shareUrl = `https://upliftroom.com/products/${slug}`
  const shareText = product ? `Check out ${product.name} on UpliftRoom` : 'Check out this product'

  function handleShare(method: string) {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)

    const shareUrls: Record<string, string> = {
      sms: `sms:?body=${encodedText} ${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
    }

    if (method === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    } else if (shareUrls[method]) {
      window.open(shareUrls[method], '_blank')
    }
    
    setShowShareMenu(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-border-strong)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading product...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link to="/products" className="btn-secondary text-sm">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="container max-w-5xl">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div
              className="aspect-square rounded-2xl overflow-hidden mb-4 relative"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              {product.image_cover_path ? (
                <img
                  src={product.image_cover_path}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/product-placeholder.svg' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img src="/product-placeholder.svg" alt={product.name} className="w-1/2 h-1/2 object-contain opacity-30" />
                </div>
              )}
              
              {product.out_of_stock && (
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: 'rgba(220, 38, 38, 0.95)' }}
                >
                  Out of Stock
                </div>
              )}
            </div>

            {product.image_gallery_paths && product.image_gallery_paths.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.image_gallery_paths.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden"
                    style={{ background: 'var(--color-bg-secondary)' }}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.categories && (
                <span className="badge badge-cyan capitalize">{product.categories.name}</span>
              )}
              {product.profile && (
                <span className="badge badge-accent capitalize">{product.profile}</span>
              )}
              {product.is_featured && (
                <span className="badge gradient-bg text-white" style={{ border: 'none' }}>Featured</span>
              )}
            </div>

            <h1
              className="text-3xl lg:text-4xl font-bold mb-3"
              style={{ color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}
            >
              {product.name}
            </h1>

            {product.price_text && (
              <p className="text-xl font-semibold mb-5 gradient-text">{product.price_text}</p>
            )}

            {product.out_of_stock && (
              <div
                className="mb-5 px-4 py-3 rounded-lg flex items-center gap-2"
                style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
              >
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-red-400">
                  This product is currently out of stock
                </span>
              </div>
            )}

            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {product.short_description}
            </p>

            {(product.intensity || product.strength || product.timing) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.intensity && (
                  <span className="pill capitalize">{product.intensity} Intensity</span>
                )}
                {product.strength && (
                  <span className="pill capitalize">{product.strength}</span>
                )}
                {product.timing && (
                  <span className="pill capitalize">{product.timing}</span>
                )}
              </div>
            )}

            {product.labels && product.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.labels.map((label, i) => (
                  <span key={i} className="badge badge-cyan">{label}</span>
                ))}
              </div>
            )}

            <div className="relative mb-6">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowShareMenu(!showShareMenu)
                }}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Product
              </button>

              {showShareMenu && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden z-10 animate-[slideUp_0.2s_ease-out]"
                  style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-lg)' }}
                >
                  <div style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-opacity-50"
                      style={{ background: copySuccess ? 'var(--color-success-bg)' : 'transparent' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span style={{ color: 'var(--color-text)' }}>
                        {copySuccess ? 'Copied!' : 'Copy Link'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleShare('sms')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={{ background: 'transparent' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span style={{ color: 'var(--color-text)' }}>SMS</span>
                    </button>

                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={{ background: 'transparent' }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span style={{ color: 'var(--color-text)' }}>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={{ background: 'transparent' }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span style={{ color: 'var(--color-text)' }}>Twitter</span>
                    </button>

                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={{ background: 'transparent' }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span style={{ color: 'var(--color-text)' }}>Facebook</span>
                    </button>

                    <button
                      onClick={() => handleShare('email')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={{ background: 'transparent' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span style={{ color: 'var(--color-text)' }}>Email</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {product.long_description_md && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  About This Product
                </h2>
                <div
                  className="text-base leading-relaxed space-y-3"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {product.long_description_md.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            <p
              className="text-xs mt-8 pt-6"
              style={{ color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)' }}
            >
              Effects may vary by person. This product is for informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
