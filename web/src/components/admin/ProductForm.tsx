import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface ProductSize {
  size: string
  price: number
  unit: 'gram' | 'ounce' | 'pound'
  in_stock?: boolean
}

interface ProductFormData {
  name: string
  slug: string
  category_id: string
  short_description: string
  long_description: string
  profile: string
  intensity: string
  experience_notes: string
  tags: string
  base_price: string
  price_text: string
  sizes: ProductSize[]
  image_cover_path: string
  image_gallery_paths: string
  lab_report_url: string
  thc_percentage: string
  cbd_percentage: string
  content_warnings: string
  is_active: boolean
  is_featured: boolean
  sort_order: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormProps {
  productId?: string
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ productId, onSave, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    category_id: '',
    short_description: '',
    long_description: '',
    profile: '',
    intensity: '',
    experience_notes: '',
    tags: '',
    base_price: '',
    price_text: '',
    sizes: [],
    image_cover_path: '',
    image_gallery_paths: '',
    lab_report_url: '',
    thc_percentage: '',
    cbd_percentage: '',
    content_warnings: '',
    is_active: false,
    is_featured: false,
    sort_order: '0',
  })

  useEffect(() => {
    fetchCategories()
    if (productId) {
      fetchProduct()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  async function fetchCategories() {
    try {
      const response = await fetch(`${API_URL}/categories`)
      const data = await response.json()
      if (data.status === 'ok') {
        setCategories(data.data)
      }
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  async function fetchProduct() {
    if (!productId) return
    
    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`)
      const data = await response.json()
      
      if (data.status === 'ok' && data.data) {
        const product = data.data
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          category_id: product.category_id || '',
          short_description: product.short_description || '',
          long_description: product.long_description || '',
          profile: product.profile || '',
          intensity: product.intensity || '',
          experience_notes: product.experience_notes?.join(', ') || '',
          tags: product.tags?.join(', ') || '',
          base_price: product.base_price?.toString() || '',
          price_text: product.price_text || '',
          sizes: product.sizes || [],
          image_cover_path: product.image_cover_path || '',
          image_gallery_paths: product.image_gallery_paths?.join(', ') || '',
          lab_report_url: product.lab_report_url || '',
          thc_percentage: product.thc_percentage?.toString() || '',
          cbd_percentage: product.cbd_percentage?.toString() || '',
          content_warnings: product.content_warnings?.join(', ') || '',
          is_active: product.is_active || false,
          is_featured: product.is_featured || false,
          sort_order: product.sort_order?.toString() || '0',
        })
      }
    } catch (err) {
      console.error('Failed to load product:', err)
    }
  }

  function handleChange(field: keyof ProductFormData, value: string | boolean | string[]) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function generateSlug() {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    handleChange('slug', slug)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        slug: formData.slug,
        category_id: formData.category_id || null,
        short_description: formData.short_description,
        long_description: formData.long_description || null,
        profile: formData.profile || null,
        intensity: formData.intensity || null,
        experience_notes: formData.experience_notes 
          ? formData.experience_notes.split(',').map(t => t.trim()).filter(Boolean)
          : null,
        tags: formData.tags 
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : null,
        base_price: formData.base_price ? parseFloat(formData.base_price) : null,
        price_text: formData.price_text || null,
        sizes: formData.sizes.length > 0 ? formData.sizes : [],
        image_cover_path: formData.image_cover_path || null,
        image_gallery_paths: formData.image_gallery_paths
          ? formData.image_gallery_paths.split(',').map(t => t.trim()).filter(Boolean)
          : null,
        lab_report_url: formData.lab_report_url || null,
        thc_percentage: formData.thc_percentage ? parseFloat(formData.thc_percentage) : null,
        cbd_percentage: formData.cbd_percentage ? parseFloat(formData.cbd_percentage) : null,
        content_warnings: formData.content_warnings
          ? formData.content_warnings.split(',').map(t => t.trim()).filter(Boolean)
          : null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        sort_order: parseInt(formData.sort_order) || 0,
      }

      const url = productId 
        ? `${API_URL}/admin/products/${productId}`
        : `${API_URL}/admin/products`
      
      const method = productId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.status === 'ok') {
        onSave()
      } else {
        setError(data.message || 'Failed to save product')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {productId ? 'Edit Product' : 'New Product'}
      </h2>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 rounded p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={generateSlug}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <select
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Short Description * (max 160 chars)
          </label>
          <textarea
            value={formData.short_description}
            onChange={(e) => handleChange('short_description', e.target.value)}
            maxLength={160}
            rows={2}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.short_description.length}/160
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Long Description</label>
          <textarea
            value={formData.long_description}
            onChange={(e) => handleChange('long_description', e.target.value)}
            rows={4}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Profile</label>
            <select
              value={formData.profile}
              onChange={(e) => handleChange('profile', e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select profile</option>
              <option value="day">Day</option>
              <option value="night">Night</option>
              <option value="balanced">Balanced</option>
              <option value="anytime">Anytime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Intensity</label>
            <select
              value={formData.intensity}
              onChange={(e) => handleChange('intensity', e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select intensity</option>
              <option value="light">Light</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Experience Notes (comma-separated)
          </label>
          <input
            type="text"
            value={formData.experience_notes}
            onChange={(e) => handleChange('experience_notes', e.target.value)}
            placeholder="upbeat, calm, social, focus, unwind"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Suggested: upbeat, calm, social, focus, unwind, creative, energetic
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="relaxing, social, creative"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Base Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.base_price}
              onChange={(e) => handleChange('base_price', e.target.value)}
              placeholder="25.00"
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Price Text</label>
            <input
              type="text"
              value={formData.price_text}
              onChange={(e) => handleChange('price_text', e.target.value)}
              placeholder="Starting at $25"
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Cover Image Path</label>
          <input
            type="text"
            value={formData.image_cover_path}
            onChange={(e) => handleChange('image_cover_path', e.target.value)}
            placeholder="/images/products/product-name.jpg"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Gallery Images (comma-separated paths)
          </label>
          <input
            type="text"
            value={formData.image_gallery_paths}
            onChange={(e) => handleChange('image_gallery_paths', e.target.value)}
            placeholder="/images/products/img1.jpg, /images/products/img2.jpg"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Lab Report URL</label>
            <input
              type="url"
              value={formData.lab_report_url}
              onChange={(e) => handleChange('lab_report_url', e.target.value)}
              placeholder="https://..."
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">THC %</label>
            <input
              type="number"
              step="0.01"
              value={formData.thc_percentage}
              onChange={(e) => handleChange('thc_percentage', e.target.value)}
              placeholder="20.5"
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">CBD %</label>
            <input
              type="number"
              step="0.01"
              value={formData.cbd_percentage}
              onChange={(e) => handleChange('cbd_percentage', e.target.value)}
              placeholder="0.5"
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Content Warnings (comma-separated)
          </label>
          <input
            type="text"
            value={formData.content_warnings}
            onChange={(e) => handleChange('content_warnings', e.target.value)}
            placeholder="high potency, not for beginners"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">
              Active (Published)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => handleChange('is_featured', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-300">
              Featured
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded transition-colors"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
