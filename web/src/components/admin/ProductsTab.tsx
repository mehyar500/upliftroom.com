import { useState } from 'react'
import ProductList from './ProductList'
import ProductForm from './ProductForm'

type ViewType = 'list' | 'form'

export default function ProductsTab() {
  const [view, setView] = useState<ViewType>('list')
  const [editingProductId, setEditingProductId] = useState<string | undefined>()

  function handleCreateNew() {
    setEditingProductId(undefined)
    setView('form')
  }

  function handleEdit(productId: string) {
    setEditingProductId(productId)
    setView('form')
  }

  function handleSave() {
    setView('list')
    setEditingProductId(undefined)
  }

  function handleCancel() {
    setView('list')
    setEditingProductId(undefined)
  }

  return (
    <>
      {view === 'list' && (
        <ProductList onEdit={handleEdit} onCreateNew={handleCreateNew} />
      )}
      
      {view === 'form' && (
        <ProductForm
          productId={editingProductId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
