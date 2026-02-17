import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
}

const SITE_NAME = 'UpliftRoom'
const DEFAULT_DESCRIPTION = 'Explore cannabis culture, learn about products, and find your vibe. UpliftRoom is your curated guide to cannabis lifestyle and education.'
const DEFAULT_KEYWORDS = 'cannabis, cannabis culture, cannabis education, cannabis products, cannabis lifestyle, weed, marijuana, edibles, flower, vapes, concentrates'
const BASE_URL = 'https://upliftroom.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = url
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Cannabis Culture & Education`
    document.title = fullTitle

    setMeta('description', description)
    setMeta('keywords', keywords)

    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:image', ogImage, 'property')
    setMeta('og:type', ogType, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:url', canonical || `${BASE_URL}${window.location.pathname}`, 'property')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    setCanonical(canonical || `${BASE_URL}${window.location.pathname}`)
  }, [title, description, keywords, canonical, ogImage, ogType])
}
