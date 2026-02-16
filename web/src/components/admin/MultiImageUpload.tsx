import { useState, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.upliftroom.com'

interface MultiImageUploadProps {
  value: string[] // Array of image URLs
  onChange: (urls: string[]) => void
  label: string
  maxImages?: number
}

export default function MultiImageUpload({ 
  value, 
  onChange, 
  label, 
  maxImages = 8 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed max
    if (value.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    setError(null)

    const uploadedUrls: string[] = []

    try {
      for (const file of files) {
        // Validate file type
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
          setError(`${file.name}: Only JPEG, PNG, and WebP images are allowed`)
          continue
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name}: File size must be less than 5MB`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${API_URL}/admin/upload`, {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (data.status === 'ok') {
          uploadedUrls.push(data.data.url)
        } else {
          setError(`${file.name}: ${data.message || 'Upload failed'}`)
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls])
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

  function handleRemove(index: number) {
    const newUrls = value.filter((_, i) => i !== index)
    onChange(newUrls)
  }

  function handleReorder(fromIndex: number, toIndex: number) {
    const newUrls = [...value]
    const [removed] = newUrls.splice(fromIndex, 1)
    newUrls.splice(toIndex, 0, removed)
    onChange(newUrls)
  }

  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label} ({value.length}/{maxImages})
      </label>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-3">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-800 rounded border border-gray-700 overflow-hidden"
            >
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                    title="Move left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-900/50 hover:bg-red-900 rounded"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                    title="Move right"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Image number badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {value.length < maxImages && (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-24 border-2 border-dashed border-gray-700 rounded bg-gray-800 hover:bg-gray-750 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-gray-400">Uploading...</span>
            ) : (
              <>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-gray-400">
                  Add {value.length > 0 ? 'more' : ''} images
                </span>
                <span className="text-xs text-gray-500">
                  JPEG, PNG, WebP (max 5MB each)
                </span>
              </>
            )}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="mt-2 text-sm text-red-300 bg-red-900/30 border border-red-800 rounded p-2">
          {error}
        </div>
      )}

      {value.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Tip: Hover over images to reorder or remove them
        </div>
      )}
    </div>
  )
}
