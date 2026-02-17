import type { Env } from './types'
import { handleRequest } from './router'
import { fetchRSS } from './routes/rss'

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

  // Cron trigger handler - runs every 6 hours
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Cron trigger fired:', new Date(event.scheduledTime).toISOString())
    
    ctx.waitUntil(
      (async () => {
        try {
          const response = await fetchRSS(env)
          const result = await response.json()
          console.log('RSS fetch completed:', result)
        } catch (error) {
          console.error('Cron RSS fetch failed:', error)
        }
      })()
    )
  },
}

export type { Env }
