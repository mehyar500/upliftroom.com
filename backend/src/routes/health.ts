import type { Env } from '../types'
import { getSupabaseClient } from '../utils/supabase'
import { jsonResponse } from '../utils/response'
import { checkRateLimit, getClientIP } from '../middleware/rateLimit'
import { RATE_LIMIT_PER_DAY } from '../config/constants'

export async function handleHealth(request: Request, env: Env): Promise<Response> {
  const ip = getClientIP(request)
  const supabase = getSupabaseClient(env)

  const { allowed, count } = await checkRateLimit(supabase, ip)

  if (!allowed) {
    return jsonResponse(
      {
        status: 'rate_limited',
        message: 'Too many requests today',
        requests_today: count,
        limit: RATE_LIMIT_PER_DAY,
      },
      429
    )
  }

  const { error } = await supabase
    .from('daily_users')
    .select('count', { count: 'exact', head: true })

  if (error) {
    return jsonResponse(
      {
        status: 'error',
        message: 'Database connection failed',
        detail: error.message,
      },
      500
    )
  }

  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    requests_today: count,
    supabase: 'connected',
  })
}
