import { CORS_HEADERS } from '../config/constants'

export function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  })
}

export function corsResponse(): Response {
  return new Response(null, { headers: CORS_HEADERS })
}
