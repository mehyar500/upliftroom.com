import type { Env } from '../types'
import { getSupabaseClient } from '../utils/supabase'
import { jsonResponse } from '../utils/response'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// POST /admin/upload - Upload product image
export async function uploadImage(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return jsonResponse({ status: 'error', message: 'No file provided' }, 400)
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonResponse(
        { status: 'error', message: 'Invalid file type. Only JPEG, PNG, and WebP allowed' },
        400
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse(
        { status: 'error', message: 'File too large. Maximum size is 5MB' },
        400
      )
    }

    const supabase = getSupabaseClient(env)
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const filename = `products/${timestamp}-${randomStr}.${extension}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return jsonResponse(
        { status: 'error', message: 'Upload failed', detail: error.message },
        500
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    return jsonResponse({
      status: 'ok',
      data: {
        path: data.path,
        url: urlData.publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error) {
    return jsonResponse(
      {
        status: 'error',
        message: 'Upload failed',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}

// DELETE /admin/upload/:path - Delete image
export async function deleteImage(path: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env)

  const { error } = await supabase.storage
    .from('product-images')
    .remove([path])

  if (error) {
    return jsonResponse(
      { status: 'error', message: 'Delete failed', detail: error.message },
      500
    )
  }

  return jsonResponse({ status: 'ok', message: 'Image deleted' })
}
