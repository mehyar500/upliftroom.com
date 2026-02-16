import type { SupabaseClient } from '@supabase/supabase-js'
import type { RateLimitResult } from '../types'
import { RATE_LIMIT_PER_DAY } from '../config/constants'

export async function checkRateLimit(
  supabase: SupabaseClient,
  ip: string
): Promise<RateLimitResult> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_users')
    .upsert(
      {
        ip_address: ip,
        visit_date: today,
        request_count: 1,
        last_seen: new Date().toISOString(),
      },
      {
        onConflict: 'ip_address,visit_date',
        ignoreDuplicates: false,
      }
    )
    .select('request_count')
    .single()

  if (error) {
    const { data: existing, error: selectError } = await supabase
      .from('daily_users')
      .select('request_count')
      .eq('ip_address', ip)
      .eq('visit_date', today)
      .single()

    if (selectError || !existing) {
      return { allowed: true, count: 0 }
    }

    if (existing.request_count >= RATE_LIMIT_PER_DAY) {
      return { allowed: false, count: existing.request_count }
    }

    await supabase
      .from('daily_users')
      .update({
        request_count: existing.request_count + 1,
        last_seen: new Date().toISOString(),
      })
      .eq('ip_address', ip)
      .eq('visit_date', today)

    return { allowed: true, count: existing.request_count + 1 }
  }

  if (data && data.request_count > 1 && data.request_count > RATE_LIMIT_PER_DAY) {
    return { allowed: false, count: data.request_count }
  }

  if (data && data.request_count === 1) {
    return { allowed: true, count: 1 }
  }

  const { data: updated } = await supabase
    .from('daily_users')
    .update({
      request_count: (data?.request_count || 0) + 1,
      last_seen: new Date().toISOString(),
    })
    .eq('ip_address', ip)
    .eq('visit_date', today)
    .select('request_count')
    .single()

  const count = updated?.request_count || 0
  return { allowed: count <= RATE_LIMIT_PER_DAY, count }
}

export function getClientIP(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    'unknown'
  )
}
