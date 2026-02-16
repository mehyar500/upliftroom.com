import type { Env } from './types'
import { jsonResponse, corsResponse } from './utils/response'
import { handleHealth } from './routes/health'
import { handleAdminLogin } from './routes/admin'

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return corsResponse()
  }

  const url = new URL(request.url)

  // Route matching
  switch (url.pathname) {
    case '/health':
      return handleHealth(request, env)

    case '/admin/login':
      return handleAdminLogin(request, env)

    default:
      return jsonResponse({ error: 'Not found', path: url.pathname }, 404)
  }
}
