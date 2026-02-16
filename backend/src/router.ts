import type { Env } from './types'
import { jsonResponse, corsResponse } from './utils/response'
import { handleHealth } from './routes/health'
import { handleAdminLogin } from './routes/admin'
import {
  listProducts,
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
} from './routes/products'
import { uploadImage, deleteImage } from './routes/upload'
import { getRSSItems, fetchRSS } from './routes/rss'

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return corsResponse()
  }

  const url = new URL(request.url)
  const path = url.pathname

  // Route matching
  // Health check
  if (path === '/health') {
    return handleHealth(request, env)
  }

  // Admin login
  if (path === '/admin/login') {
    return handleAdminLogin(request, env)
  }

  // Image upload
  if (path === '/admin/upload' && request.method === 'POST') {
    return uploadImage(request, env)
  }

  // Image delete
  const deleteMatch = path.match(/^\/admin\/upload\/(.+)$/)
  if (deleteMatch && request.method === 'DELETE') {
    return deleteImage(decodeURIComponent(deleteMatch[1]), env)
  }

  // Categories
  if (path === '/categories' && request.method === 'GET') {
    return listCategories(env)
  }

  // Products - Public
  if (path === '/products' && request.method === 'GET') {
    return listProducts(request, env)
  }

  // Product by slug - Public
  const productMatch = path.match(/^\/products\/([^/]+)$/)
  if (productMatch && request.method === 'GET') {
    return getProduct(productMatch[1], env)
  }

  // Admin Products - Create
  if (path === '/admin/products' && request.method === 'POST') {
    return createProduct(request, env)
  }

  // Admin Products - Update
  const adminProductMatch = path.match(/^\/admin\/products\/([^/]+)$/)
  if (adminProductMatch && request.method === 'GET') {
    return getProductById(adminProductMatch[1], env)
  }
  
  if (adminProductMatch && request.method === 'PATCH') {
    return updateProduct(adminProductMatch[1], request, env)
  }

  // Admin Products - Delete
  if (adminProductMatch && request.method === 'DELETE') {
    return deleteProduct(adminProductMatch[1], env)
  }

  // RSS Items - Public
  if (path === '/rss/items' && request.method === 'GET') {
    return getRSSItems(request, env)
  }

  // Admin RSS - Fetch
  if (path === '/admin/rss/fetch' && request.method === 'POST') {
    return fetchRSS(env)
  }

  return jsonResponse({ error: 'Not found', path }, 404)
}
