import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  profile: string | null
  intensity: string | null
  price_text: string | null
  is_active: boolean
  is_featured: boolean
  created_at: string
}

interface ProductListProps {
  onEdit: (productId: string) => void
  onCreateNew: () => void
}

export default function ProductList({ onEdit, onCreateNew }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      
      if (data.status === 'ok') {
        setProducts(data.data)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    try {
      const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      alert('Error deleting product')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
        >
          + New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No products yet</p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Profile</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Intensity</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Price</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-400">{product.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    {product.profile ? (
                      <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs">
                        {product.profile}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.intensity ? (
                      <span className="text-sm text-gray-300">{product.intensity}</span>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {product.price_text || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {product.is_active ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                          Draft
                        </span>
                      )}
                      {product.is_featured && (
                        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded mr-2 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="px-3 py-1 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
