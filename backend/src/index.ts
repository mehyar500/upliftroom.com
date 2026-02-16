import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Env {
    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
    ENVIRONMENT: string
}

interface AdminLoginRequest {
    username?: string
    password?: string
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

async function handleHealth(request: Request, env: Env): Promise<Response> {
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown'
    const supabase = getSupabase(env)

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

async function handleAdminLogin(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return jsonResponse({ status: 'error', message: 'Method not allowed' }, 405)
    }

    let payload: AdminLoginRequest
    try {
        payload = await request.json()
    } catch {
        return jsonResponse({ status: 'error', message: 'Invalid JSON body' }, 400)
    }

    const username = payload.username?.trim()
    const password = payload.password

    if (!username || !password) {
        return jsonResponse({ status: 'error', message: 'Username and password are required' }, 400)
    }

    const supabase = getSupabase(env)
    const { data, error } = await supabase
        .from('admins')
        .select('username')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle()

    if (error) {
        return jsonResponse({ status: 'error', message: 'Authentication failed', detail: error.message }, 500)
    }

    if (!data) {
        return jsonResponse({ status: 'error', message: 'Invalid credentials' }, 401)
    }

    return jsonResponse({ status: 'ok', authenticated: true, username: data.username })
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS })
        }

        const url = new URL(request.url)

        switch (url.pathname) {
            case '/health':
                return handleHealth(request, env)
            case '/admin/login':
                return handleAdminLogin(request, env)
            default:
                return jsonResponse({ error: 'Not found' }, 404)
        }
    },
}
