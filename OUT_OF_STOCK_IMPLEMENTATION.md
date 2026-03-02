# Out of Stock Feature Implementation

## Overview
Added comprehensive out-of-stock functionality for products, allowing admins to mark products as unavailable and displaying clear indicators to users.

## Changes Made

### 1. Database Migration
**File:** `backend/supabase/migrations/20260301000000_add_out_of_stock.sql`
- Added `out_of_stock` BOOLEAN column to products table (defaults to FALSE)
- Created index for efficient filtering
- Added documentation comment

**To apply this migration:**
```bash
cd backend
supabase db reset  # For local development
# OR
supabase db push   # For production
```

### 2. Backend Types
**File:** `backend/src/types/product.ts`
- Added `out_of_stock: boolean` to Product interface
- Added `out_of_stock?: boolean` to UpdateProductRequest interface

### 3. Admin Panel
**File:** `web/src/components/admin/ProductForm.tsx`
- Added "Out of Stock" checkbox in the admin form
- Positioned alongside "Active" and "Featured" toggles
- Automatically saves/loads the out_of_stock status when editing products

### 4. User-Facing Display

#### Products List Page
**File:** `web/src/pages/ProductsPage.tsx`
- Added `out_of_stock` to Product interface
- Displays red "Out of Stock" badge on product card thumbnails (top-left corner)
- Badge appears alongside "Featured" badge if both apply

#### Product Detail Page
**File:** `web/src/pages/ProductDetailPage.tsx`
- Added `out_of_stock` to Product interface
- Shows "Out of Stock" badge overlay on main product image
- Displays prominent warning banner below price with icon and message
- Warning banner uses red color scheme for visibility

## Visual Design

### Product Card Badge
- Position: Top-left corner of product image
- Style: Red background (bg-red-600), white text
- Size: Small (text-[10px])

### Product Detail Badge
- Position: Top-left of main product image
- Style: Semi-transparent red background (rgba(220, 38, 38, 0.95))
- Size: Medium (text-sm), with padding

### Warning Banner
- Position: Below product price, above description
- Style: Red tinted background with border
- Icon: Warning triangle icon
- Message: "This product is currently out of stock"

## Testing

1. Start both servers (already running):
   - Backend: http://127.0.0.1:8787
   - Frontend: http://localhost:5000

2. Apply the database migration:
   ```bash
   cd backend
   supabase db reset
   ```

3. Test admin functionality:
   - Go to http://localhost:5000/admin
   - Login with admin credentials
   - Edit a product
   - Toggle "Out of Stock" checkbox
   - Save and verify

4. Test user view:
   - Go to http://localhost:5000/products
   - Verify out-of-stock badge appears on product cards
   - Click on an out-of-stock product
   - Verify badge and warning banner appear on detail page

## API Compatibility
The backend API automatically includes the `out_of_stock` field in all product responses. No additional API changes needed.
