import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Env {
    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
    ENVIRONMENT: string
}

const RATE_LIMIT_PER_DAY = 100

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

function getSupabase(env: Env): SupabaseClient {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
}

function jsonResponse(data: object, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
        },
    })
}

async function checkRateLimit(supabase: SupabaseClient, ip: string): Promise<{ allowed: boolean; count: number }> {
    const today = new Date().toISOString().split('T')[0]

    // Try to upsert the daily_users record
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
        // If upsert failed, try to increment
        const { data: existing, error: selectError } = await supabase
            .from('daily_users')
            .select('request_count')
            .eq('ip_address', ip)
            .eq('visit_date', today)
            .single()

        if (selectError || !existing) {
            // Table might not exist yet or first visit - allow
            return { allowed: true, count: 0 }
        }

        if (existing.request_count >= RATE_LIMIT_PER_DAY) {
            return { allowed: false, count: existing.request_count }
        }

        // Increment
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

    // Upsert worked but didn't increment - need to handle increment
    if (data && data.request_count > 1 && data.request_count > RATE_LIMIT_PER_DAY) {
        return { allowed: false, count: data.request_count }
    }

    // If this was an insert (count=1), we're good
    if (data && data.request_count === 1) {
        return { allowed: true, count: 1 }
    }

    // For existing records, increment
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

async function handleHealth(request: Request, env: Env): Promise<Response> {
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown'
    const supabase = getSupabase(env)

    // Check rate limit
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

    // Verify Supabase connection
    const { error } = await supabase.from('daily_users').select('count', { count: 'exact', head: true })

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

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS })
        }

        const url = new URL(request.url)

        switch (url.pathname) {
            case '/health':
                return handleHealth(request, env)
            default:
                return jsonResponse({ error: 'Not found' }, 404)
        }
    },
}
