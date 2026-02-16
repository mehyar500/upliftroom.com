import type { Env } from '../types'
import { getSupabaseClient } from '../utils/supabase'
import { jsonResponse } from '../utils/response'

interface RSSItem {
  title: string
  link: string
  description?: string
  content?: string
  pubDate?: string
  author?: string
  'media:content'?: { $: { url: string } }
  enclosure?: { $: { url: string } }
}

// GET /rss/items - Get latest RSS items (public)
export async function getRSSItems(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const category = url.searchParams.get('category')
  
  const supabase = getSupabaseClient(env)
  
  let query = supabase
    .from('rss_items')
    .select('*, rss_sources(name, homepage_url, category)')
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (category) {
    query = query.eq('rss_sources.category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Failed to fetch RSS items', detail: error.message },
      500
    )
  }
  
  return jsonResponse({ status: 'ok', data })
}

// POST /admin/rss/fetch - Manually trigger RSS fetch (admin only)
export async function fetchRSS(env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env)
  
  // Get active sources that need updating
  const { data: sources, error: sourcesError } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true)
  
  if (sourcesError || !sources) {
    return jsonResponse(
      { status: 'error', message: 'Failed to fetch sources', detail: sourcesError?.message },
      500
    )
  }
  
  const results = []
  
  for (const source of sources) {
    try {
      // Fetch RSS feed
      const response = await fetch(source.feed_url, {
        headers: {
          'User-Agent': 'UpliftRoom RSS Fetcher/1.0',
        },
      })
      
      if (!response.ok) {
        results.push({ source: source.name, status: 'error', message: 'Failed to fetch feed' })
        continue
      }
      
      const xml = await response.text()
      const items = parseRSSFeed(xml)
      
      let inserted = 0
      let skipped = 0
      
      // Insert items into database
      for (const item of items) {
        const { error: insertError } = await supabase
          .from('rss_items')
          .upsert({
            source_id: source.id,
            title: item.title,
            link: item.link,
            summary: item.description?.substring(0, 500) || null,
            content: item.content || item.description || null,
            author: item.author || null,
            image_url: extractImageUrl(item) || null,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          }, {
            onConflict: 'link',
            ignoreDuplicates: true,
          })
        
        if (insertError) {
          skipped++
        } else {
          inserted++
        }
      }
      
      // Update last_fetched_at
      await supabase
        .from('rss_sources')
        .update({ last_fetched_at: new Date().toISOString() })
        .eq('id', source.id)
      
      results.push({
        source: source.name,
        status: 'success',
        inserted,
        skipped,
        total: items.length,
      })
    } catch (error) {
      results.push({
        source: source.name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
  
  return jsonResponse({
    status: 'ok',
    message: 'RSS fetch completed',
    results,
  })
}

// Simple RSS XML parser
function parseRSSFeed(xml: string): RSSItem[] {
  const items: RSSItem[] = []
  
  // Extract items using regex (simple approach for RSS 2.0)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const matches = xml.matchAll(itemRegex)
  
  for (const match of matches) {
    const itemXml = match[1]
    
    const title = extractTag(itemXml, 'title')
    const link = extractTag(itemXml, 'link')
    const description = extractTag(itemXml, 'description')
    const content = extractTag(itemXml, 'content:encoded') || extractTag(itemXml, 'content')
    const pubDate = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'published')
    const author = extractTag(itemXml, 'author') || extractTag(itemXml, 'dc:creator')
    
    if (title && link) {
      items.push({
        title: cleanText(title),
        link: cleanText(link),
        description: description ? cleanText(description) : undefined,
        content: content ? cleanText(content) : undefined,
        pubDate: pubDate ? cleanText(pubDate) : undefined,
        author: author ? cleanText(author) : undefined,
      })
    }
  }
  
  return items.slice(0, 20) // Limit to 20 items per source
}

function extractTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1] : null
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function extractImageUrl(item: RSSItem): string | null {
  // Try to extract image from various RSS formats
  if (item['media:content']?.$.url) {
    return item['media:content'].$.url
  }
  if (item.enclosure?.$.url) {
    return item.enclosure.$.url
  }
  
  // Try to extract from description/content
  const content = item.content || item.description || ''
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i)
  return imgMatch ? imgMatch[1] : null
}
