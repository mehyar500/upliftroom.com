import type { Env, AdminLoginRequest } from '../types'
import { getSupabaseClient } from '../utils/supabase'
import { jsonResponse } from '../utils/response'

export async function handleAdminLogin(request: Request, env: Env): Promise<Response> {
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
    return jsonResponse(
      { status: 'error', message: 'Username and password are required' },
      400
    )
  }

  const supabase = getSupabaseClient(env)
  const { data, error } = await supabase
    .from('admins')
    .select('username')
    .eq('username', username)
    .eq('password', password)
    .maybeSingle()

  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Authentication failed', detail: error.message },
      500
    )
  }

  if (!data) {
    return jsonResponse({ status: 'error', message: 'Invalid credentials' }, 401)
  }

  return jsonResponse({
    status: 'ok',
    authenticated: true,
    username: data.username,
  })
}
