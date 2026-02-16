export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  ENVIRONMENT: string
}

export interface AdminLoginRequest {
  username?: string
  password?: string
}

export interface RateLimitResult {
  allowed: boolean
  count: number
}

export * from './product'
