import type { Env } from '../types'
import type { CreateProductRequest, UpdateProductRequest } from '../types/product'
import { getSupabaseClient } from '../utils/supabase'
import { jsonResponse } from '../utils/response'

// GET /admin/products/:id - Get single product by ID for editing (admin only)
export async function getProductById(id: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env)
  
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single()
  
  if (error || !data) {
    return jsonResponse(
      { status: 'error', message: 'Product not found' },
      404
    )
  }
  
  return jsonResponse({ status: 'ok', data })
}

// GET /products - List all active products (public)
export async function listProducts(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const featured = url.searchParams.get('featured')
  
  const supabase = getSupabaseClient(env)
  
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  if (category) {
    query = query.eq('categories.slug', category)
  }
  
  if (featured === 'true') {
    query = query.eq('is_featured', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Failed to fetch products', detail: error.message },
      500
    )
  }
  
  return jsonResponse({ status: 'ok', data })
}

// GET /products/:slug - Get single product by slug (public)
export async function getProduct(slug: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env)
  
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error || !data) {
    return jsonResponse(
      { status: 'error', message: 'Product not found' },
      404
    )
  }
  
  return jsonResponse({ status: 'ok', data })
}

// POST /admin/products - Create product (admin only)
export async function createProduct(request: Request, env: Env): Promise<Response> {
  let payload: CreateProductRequest
  
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ status: 'error', message: 'Invalid JSON body' }, 400)
  }
  
  // Validation
  if (!payload.name || !payload.slug || !payload.short_description) {
    return jsonResponse(
      { status: 'error', message: 'name, slug, and short_description are required' },
      400
    )
  }
  
  if (payload.short_description.length > 160) {
    return jsonResponse(
      { status: 'error', message: 'short_description must be 160 characters or less' },
      400
    )
  }
  
  const supabase = getSupabaseClient(env)
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...payload,
      is_active: false, // Always start as draft
    })
    .select()
    .single()
  
  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Failed to create product', detail: error.message },
      500
    )
  }
  
  return jsonResponse({ status: 'ok', data }, 201)
}

// PATCH /admin/products/:id - Update product (admin only)
export async function updateProduct(
  id: string,
  request: Request,
  env: Env
): Promise<Response> {
  let payload: UpdateProductRequest
  
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ status: 'error', message: 'Invalid JSON body' }, 400)
  }
  
  // Validation for publishing
  if (payload.is_active === true) {
    // Check required fields for publishing
    const supabase = getSupabaseClient(env)
    const { data: existing } = await supabase
      .from('products')
      .select('image_cover_path, profile, intensity, short_description')
      .eq('id', id)
      .single()
    
    if (!existing) {
      return jsonResponse({ status: 'error', message: 'Product not found' }, 404)
    }
    
    const errors: string[] = []
    
    if (!existing.image_cover_path && !payload.image_cover_path) {
      errors.push('Cover image is required')
    }
    
    if (!existing.profile && !payload.profile) {
      errors.push('Profile (day/night/balanced) is required')
    }
    
    if (!existing.intensity && !payload.intensity) {
      errors.push('Intensity is required')
    }
    
    const description = payload.short_description || existing.short_description
    if (description && description.length > 160) {
      errors.push('short_description must be 160 characters or less')
    }
    
    if (errors.length > 0) {
      return jsonResponse(
        { status: 'error', message: 'Validation failed', errors },
        400
      )
    }
  }
  
  const supabase = getSupabaseClient(env)
  
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Failed to update product', detail: error.message },
      500
    )
  }
  
  return jsonResponse({ status: 'ok', data })
}

// DELETE /admin/products/:id - Delete product (admin only)
export async function deleteProduct(id: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env)
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Failed to delete product', detail: error.message },
      500
    )
  }
  
  return jsonResponse({ status: 'ok', message: 'Product deleted' })
}

// GET /categories - List all categories (public)
export async function listCategories(env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env)
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Failed to fetch categories', detail: error.message },
      500
    )
  }
  
  return jsonResponse({ status: 'ok', data })
}
