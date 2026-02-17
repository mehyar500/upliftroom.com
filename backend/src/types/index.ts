export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  BREVO_API_KEY: string
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
