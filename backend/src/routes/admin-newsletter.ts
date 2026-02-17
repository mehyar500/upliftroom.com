import type { Env } from '../types'
import { jsonResponse } from '../utils/response'
import { getSupabaseClient } from '../utils/supabase'

export async function listNewsletterSignups(request: Request, env: Env): Promise<Response> {
  try {
    const supabase = getSupabaseClient(env)

    // Get query parameters
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''

    let query = supabase
      .from('newsletter_signups')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply search filter if provided
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,zip.ilike.%${search}%`
      )
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch newsletter signups:', error)
      return jsonResponse(
        { status: 'error', message: 'Failed to fetch signups', detail: error.message },
        500
      )
    }

    return jsonResponse({
      status: 'ok',
      data: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error('List newsletter signups error:', error)
    return jsonResponse(
      {
        status: 'error',
        message: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}

export async function deleteNewsletterSignup(signupId: string, env: Env): Promise<Response> {
  try {
    const supabase = getSupabaseClient(env)

    const { error } = await supabase
      .from('newsletter_signups')
      .delete()
      .eq('id', signupId)

    if (error) {
      console.error('Failed to delete newsletter signup:', error)
      return jsonResponse(
        { status: 'error', message: 'Failed to delete signup', detail: error.message },
        500
      )
    }

    return jsonResponse({
      status: 'ok',
      message: 'Signup deleted successfully',
    })
  } catch (error) {
    console.error('Delete newsletter signup error:', error)
    return jsonResponse(
      {
        status: 'error',
        message: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}
