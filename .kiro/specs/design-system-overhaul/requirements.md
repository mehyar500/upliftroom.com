# Design System Overhaul - Requirements

## 1. Overview

Transform the UpliftRoom website from scattered, inconsistent styling to a cohesive, Gen Z-focused design system with all CSS centralized in one place. The design must align with the business requirements: dark-first, glassmorphism, muted gradients, lifestyle-forward, and minimal.

## 2. User Stories

### 2.1 As a developer
I want all design tokens (colors, spacing, typography) defined in one central location so that I can maintain consistency and make global changes easily.

### 2.2 As a user
I want a visually consistent experience across all pages so that the site feels professional and cohesive.

### 2.3 As a designer
I want the Gen Z aesthetic (glassmorphism, muted gradients, rounded corners, large typography) properly implemented so that the brand identity is clear.

### 2.4 As a mobile user
I want consistent spacing and padding that works well on small screens so that the experience is comfortable and swipe-friendly.

## 3. Acceptance Criteria

### 3.1 Design Token System
- All colors defined as CSS custom properties in index.css
- All spacing values standardized (use 4px/8px grid system)
- All typography scales defined (heading sizes, weights, line heights)
- All border radius values standardized
- All shadow values defined as reusable tokens

### 3.2 Color Consistency
- Single dark color palette (slate-based, not gray)
- Single accent gradient (cyan → indigo, no green)
- Consistent hover states across all interactive elements
- Proper dark mode implementation using CSS custom properties

### 3.3 Spacing System
- Page containers: consistent max-width and horizontal padding
- Section spacing: consistent vertical padding (py-16 for hero, py-12 for sections)
- Card padding: consistent internal spacing (p-6 for desktop, p-4 for mobile)
- Grid gaps: consistent spacing between items (gap-6 standard)

### 3.4 Component Styling
- All cards use glassmorphism effect (backdrop-blur, semi-transparent backgrounds)
- All cards have consistent border radius (rounded-2xl)
- All hover states have consistent transitions and effects
- All buttons follow same style patterns

### 3.5 Typography
- Consistent heading hierarchy (h1: 4xl/5xl, h2: 3xl, h3: xl)
- Consistent body text sizes (base for body, sm for secondary)
- Consistent font weights (bold for headings, semibold for subheadings, normal for body)
- Consistent text colors (slate-900/white for primary, slate-600/slate-300 for secondary)

### 3.6 Layout Consistency
- All pages use same container structure
- All pages have consistent vertical rhythm
- All pages have consistent responsive breakpoints
- Navigation and footer spacing consistent across all pages

### 3.7 Glassmorphism Implementation
- Cards have backdrop-blur-lg effect
- Cards use semi-transparent backgrounds (white/90, slate-900/80)
- Subtle border colors that complement the blur effect
- Proper layering with gradients and overlays

### 3.8 Performance
- No inline styles in components
- Minimal use of arbitrary Tailwind values
- Reusable utility classes for common patterns
- CSS custom properties for dynamic theming

## 4. Current Issues to Fix

### 4.1 Spacing Inconsistencies
- HomePage: py-16, py-24, py-12, py-14
- MenuPage: py-10, py-12
- ProductsPage: py-8, py-12
- LatestPage: py-12
- **Fix**: Standardize to py-16 for hero sections, py-12 for content sections

### 4.2 Color Inconsistencies
- Mix of gray-50/gray-950 and slate-50/slate-950
- Mix of cyan/indigo and green accent colors
- Inconsistent border colors (gray-200, slate-200, gray-800, slate-800)
- **Fix**: Use only slate colors, only cyan/indigo gradients

### 4.3 Card Style Inconsistencies
- Some cards: rounded-2xl, others: rounded-xl
- Some cards: border + bg-white, others: gradient backgrounds
- Inconsistent hover effects
- **Fix**: All cards use rounded-2xl, glassmorphism, consistent hover

### 4.4 Typography Inconsistencies
- H1 sizes: 3xl, 4xl, 5xl, 6xl, 8xl
- Inconsistent font weights
- Inconsistent text colors
- **Fix**: Standardize heading scale and weights

### 4.5 Component-Specific Issues
- Navbar: Uses gray colors instead of slate
- Footer: Uses gray colors instead of slate
- Layout: Uses gray-50/gray-950 instead of slate
- ProductsPage: Uses green hover color (should be cyan)
- LatestPage: Uses gray-950 and green colors (should be slate and cyan)

## 5. Design Tokens to Define

### 5.1 Colors
```
--color-background-light: slate-50
--color-background-dark: slate-950
--color-surface-light: white
--color-surface-dark: slate-900
--color-text-primary-light: slate-900
--color-text-primary-dark: white
--color-text-secondary-light: slate-600
--color-text-secondary-dark: slate-300
--color-border-light: slate-200
--color-border-dark: slate-800
--color-accent-from: cyan-500
--color-accent-to: indigo-500
```

### 5.2 Spacing
```
--spacing-section: 3rem (py-12)
--spacing-hero: 4rem (py-16)
--spacing-card: 1.5rem (p-6)
--spacing-card-mobile: 1rem (p-4)
--spacing-gap: 1.5rem (gap-6)
```

### 5.3 Typography
```
--text-h1: 3rem (text-5xl)
--text-h2: 1.875rem (text-3xl)
--text-h3: 1.25rem (text-xl)
--text-body: 1rem (text-base)
--text-small: 0.875rem (text-sm)
```

### 5.4 Effects
```
--blur-glass: blur(16px)
--shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--transition-default: all 0.2s ease
```

## 6. Implementation Scope

### 6.1 Files to Modify
1. `web/src/index.css` - Add all design tokens and utility classes
2. `web/src/components/Layout.tsx` - Fix background colors
3. `web/src/components/Navbar.tsx` - Fix colors to use slate
4. `web/src/components/Footer.tsx` - Fix colors to use slate
5. `web/src/pages/HomePage.tsx` - Standardize spacing and colors
6. `web/src/pages/ProductsPage.tsx` - Fix spacing, colors, hover states
7. `web/src/pages/MenuPage.tsx` - Standardize spacing
8. `web/src/pages/LatestPage.tsx` - Fix colors and spacing

### 6.2 Out of Scope
- Admin dashboard components (separate design system)
- Backend API changes
- Database schema changes
- New features or functionality

## 7. Success Metrics

### 7.1 Visual Consistency
- All pages use same color palette (100% slate, 0% gray)
- All pages use same spacing system (standardized py values)
- All cards have same border radius and glassmorphism effect

### 7.2 Code Quality
- All design tokens defined in index.css
- No arbitrary Tailwind values in components
- Reduced CSS duplication across components

### 7.3 User Experience
- Smooth, consistent transitions across all interactions
- Clear visual hierarchy on all pages
- Comfortable spacing on mobile and desktop

## 8. Technical Constraints

### 8.1 Technology Stack
- Must use Tailwind CSS (existing)
- Must support dark mode via class strategy
- Must be responsive (mobile-first)

### 8.2 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Support for backdrop-filter (glassmorphism)

### 8.3 Performance
- No impact on page load times
- Maintain existing Lighthouse scores

## 9. Dependencies

- None - this is a pure CSS/styling refactor
- No new packages required
- No breaking changes to component APIs

## 10. Risks and Mitigations

### 10.1 Risk: Breaking existing layouts
**Mitigation**: Test all pages after changes, use consistent class names

### 10.2 Risk: Dark mode issues
**Mitigation**: Use CSS custom properties that work with Tailwind's dark mode

### 10.3 Risk: Mobile responsiveness issues
**Mitigation**: Test on multiple screen sizes, use mobile-first approach
