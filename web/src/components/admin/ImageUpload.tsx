import { useState, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/admin/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.status === 'ok') {
        onChange(data.data.url)
      } else {
        setError(data.message || 'Upload failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleRemove() {
    onChange('')
    setError(null)
  }

  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      
      {value ? (
        <div className="space-y-2">
          <div className="relative w-full h-48 bg-gray-800 rounded border border-gray-700 overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-32 border-2 border-dashed border-gray-700 rounded bg-gray-800 hover:bg-gray-750 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-gray-400">Uploading...</span>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-gray-400">Click to upload image</span>
                <span className="text-xs text-gray-500">JPEG, PNG, WebP (max 5MB)</span>
              </>
            )}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="mt-2 text-sm text-red-300 bg-red-900/30 border border-red-800 rounded p-2">
          {error}
        </div>
      )}
    </div>
  )
}
