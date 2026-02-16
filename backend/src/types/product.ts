export interface ProductSize {
  size: string // "3.5g", "7g", "14g", "28g", "1/2 lb", "1 lb"
  price: number
  unit: 'gram' | 'ounce' | 'pound'
  in_stock?: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  
  // Descriptions
  short_description: string
  long_description: string | null
  
  // Compliance-friendly attributes
  profile: 'day' | 'night' | 'balanced' | 'anytime' | null
  intensity: 'light' | 'mild' | 'moderate' | 'strong' | 'bold' | null
  experience_notes: string[] | null // ['upbeat', 'calm', 'social', 'focus', 'unwind']
  
  // Tags
  tags: string[] | null
  
  // Pricing
  base_price: number | null
  price_text: string | null
  sizes: ProductSize[]
  
  // Images
  image_cover_path: string | null
  image_gallery_paths: string[] | null
  
  // Lab data
  lab_report_url: string | null
  thc_percentage: number | null
  cbd_percentage: number | null
  
  // Warnings
  content_warnings: string[] | null
  
  // Publishing
  is_active: boolean
  is_featured: boolean
  sort_order: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreateProductRequest {
  name: string
  slug: string
  category_id?: string
  short_description: string
  long_description?: string
  profile?: 'day' | 'night' | 'balanced' | 'anytime'
  intensity?: 'light' | 'mild' | 'moderate' | 'strong' | 'bold'
  experience_notes?: string[]
  tags?: string[]
  base_price?: number
  price_text?: string
  sizes?: ProductSize[]
  image_cover_path?: string
  image_gallery_paths?: string[]
  lab_report_url?: string
  thc_percentage?: number
  cbd_percentage?: number
  content_warnings?: string[]
  is_featured?: boolean
  sort_order?: number
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  is_active?: boolean
}
