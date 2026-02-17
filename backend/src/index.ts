import type { Env } from './types'
import { handleRequest } from './router'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env)
    } catch (error) {
      console.error('Worker error:', error)
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Internal server error',
          detail: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }
  },
}

export type { Env }
