# Design System Overhaul - Design Document

## 1. Overview

This design document outlines the technical approach for transforming the UpliftRoom website from scattered, inconsistent styling to a cohesive, centralized design system. The implementation focuses on CSS custom properties, Tailwind CSS utility classes, and a Gen Z aesthetic featuring glassmorphism, muted gradients, and consistent spacing.

### 1.1 Design Goals

- Centralize all design tokens in `index.css` using CSS custom properties
- Eliminate color inconsistencies (gray → slate, green → cyan/indigo)
- Standardize spacing across all pages and components
- Implement proper glassmorphism effects on all cards
- Maintain dark mode support throughout
- Ensure mobile-first responsive design

### 1.2 Technology Stack

- **CSS Framework**: Tailwind CSS v4
- **Dark Mode Strategy**: Class-based (`.dark` on `<html>`)
- **Component Library**: React + TypeScript
- **Browser Support**: Modern browsers with backdrop-filter support

## 2. Architecture

### 2.1 Design Token System

All design tokens will be defined as CSS custom properties in `index.css`. This provides a single source of truth for all styling values and enables easy theming and maintenance.

**Token Categories**:
1. Colors (backgrounds, surfaces, text, borders, accents)
2. Spacing (sections, cards, gaps)
3. Typography (sizes, weights, line heights)
4. Effects (blur, shadows, transitions)
5. Layout (container widths, breakpoints)

### 2.2 Component Styling Strategy

Components will use Tailwind utility classes that reference the CSS custom properties. This approach combines the benefits of utility-first CSS with the maintainability of centralized tokens.

**Styling Layers**:
1. **Base Layer**: CSS custom properties in `index.css`
2. **Utility Layer**: Tailwind classes in components
3. **Component Layer**: Reusable component patterns

### 2.3 Dark Mode Implementation

Dark mode will be handled through CSS custom properties that automatically switch based on the `.dark` class on the `<html>` element. Each color token will have light and dark variants.

## 3. Components and Interfaces

### 3.1 CSS Custom Properties Structure

The design system will define the following CSS custom properties in `index.css`:

```css
:root {
  /* Color Tokens - Light Mode */
  --color-background: theme('colors.slate.50');
  --color-surface: theme('colors.white');
  --color-surface-glass: rgb(255 255 255 / 0.9);
  --color-text-primary: theme('colors.slate.900');
  --color-text-secondary: theme('colors.slate.600');
  --color-border: theme('colors.slate.200');
  --color-accent-from: theme('colors.cyan.500');
  --color-accent-to: theme('colors.indigo.500');
  --color-accent-hover: theme('colors.cyan.600');
  
  /* Spacing Tokens */
  --spacing-section: 3rem;        /* 48px - py-12 */
  --spacing-hero: 4rem;           /* 64px - py-16 */
  --spacing-card: 1.5rem;         /* 24px - p-6 */
  --spacing-card-mobile: 1rem;    /* 16px - p-4 */
  --spacing-gap: 1.5rem;          /* 24px - gap-6 */
  --spacing-container-x: 1rem;    /* 16px - px-4 */
  
  /* Typography Tokens */
  --text-h1: 3rem;                /* 48px - text-5xl */
  --text-h2: 1.875rem;            /* 30px - text-3xl */
  --text-h3: 1.25rem;             /* 20px - text-xl */
  --text-body: 1rem;              /* 16px - text-base */
  --text-small: 0.875rem;         /* 14px - text-sm */
  --font-weight-heading: 700;     /* font-bold */
  --font-weight-subheading: 600;  /* font-semibold */
  --font-weight-body: 400;        /* font-normal */
  
  /* Effect Tokens */
  --blur-glass: 16px;             /* backdrop-blur-lg */
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --transition-default: all 0.2s ease;
  --border-radius-card: 1rem;     /* rounded-2xl */
  
  /* Layout Tokens */
  --container-max-width: 80rem;   /* max-w-7xl */
  --container-narrow: 64rem;      /* max-w-5xl */
}

.dark {
  /* Color Tokens - Dark Mode */
  --color-background: theme('colors.slate.950');
  --color-surface: theme('colors.slate.900');
  --color-surface-glass: rgb(15 23 42 / 0.8);
  --color-text-primary: theme('colors.white');
  --color-text-secondary: theme('colors.slate.300');
  --color-border: theme('colors.slate.800');
  --color-accent-hover: theme('colors.cyan.400');
}
```

### 3.2 Tailwind Utility Class Mapping

To use the CSS custom properties with Tailwind, we'll create utility classes:

```css
/* Background utilities */
.bg-surface {
  background-color: var(--color-surface);
}

.bg-surface-glass {
  background-color: var(--color-surface-glass);
}

/* Text utilities */
.text-primary {
  color: var(--color-text-primary);
}

.text-secondary {
  color: var(--color-text-secondary);
}

/* Border utilities */
.border-default {
  border-color: var(--color-border);
}

/* Glassmorphism card pattern */
.glass-card {
  background-color: var(--color-surface-glass);
  backdrop-filter: blur(var(--blur-glass));
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-card);
  transition: var(--transition-default);
}

.glass-card:hover {
  box-shadow: var(--shadow-card-hover);
}
```

### 3.3 Component Refactoring Patterns

#### 3.3.1 Layout Component

**Current Issues**:
- Uses `gray-50/gray-950` instead of `slate-50/slate-950`
- Hardcoded color values

**Refactored Pattern**:
```tsx
<div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
```

#### 3.3.2 Navbar Component

**Current Issues**:
- Mostly correct but could use design tokens
- Some inconsistent spacing

**Refactored Pattern**:
```tsx
<nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Content */}
    </div>
  </div>
</nav>
```

#### 3.3.3 Footer Component

**Current Issues**:
- Uses `gray` colors instead of `slate`
- Uses `green` accent instead of `cyan/indigo`
- Inconsistent with brand gradient

**Refactored Pattern**:
```tsx
<footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    {/* Brand with correct gradient */}
    <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
      UpliftRoom
    </h3>
    {/* Links with cyan hover */}
    <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
      Products
    </Link>
  </div>
</footer>
```

#### 3.3.4 Card Components

**Current Issues**:
- Inconsistent border radius (rounded-xl vs rounded-2xl)
- Inconsistent glassmorphism implementation
- Inconsistent padding

**Refactored Pattern**:
```tsx
<div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg p-6 hover:shadow-lg transition-all">
  {/* Card content */}
</div>
```

#### 3.3.5 Page Containers

**Current Issues**:
- Inconsistent max-width (max-w-7xl vs max-w-5xl)
- Inconsistent vertical padding (py-8, py-10, py-12, py-14, py-16, py-24)

**Refactored Patterns**:

**Hero Sections**:
```tsx
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  {/* Hero content */}
</section>
```

**Content Sections**:
```tsx
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {/* Content */}
</section>
```

**Narrow Content** (Menu, Blog):
```tsx
<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {/* Content */}
</section>
```

### 3.4 Responsive Design Strategy

#### 3.4.1 Breakpoint System

Use Tailwind's default breakpoints:
- `sm`: 640px (mobile landscape, small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)

#### 3.4.2 Mobile-First Approach

All base styles target mobile, with progressive enhancement:

```tsx
{/* Mobile: p-4, Desktop: p-6 */}
<div className="p-4 md:p-6">

{/* Mobile: text-3xl, Desktop: text-5xl */}
<h1 className="text-3xl md:text-5xl">

{/* Mobile: gap-4, Desktop: gap-6 */}
<div className="grid gap-4 md:gap-6">
```

#### 3.4.3 Container Padding

Consistent horizontal padding across all screen sizes:
- Mobile: `px-4` (16px)
- Tablet: `sm:px-6` (24px)
- Desktop: `lg:px-8` (32px)

## 4. Data Models

### 4.1 Design Token Schema

The design system doesn't require runtime data models, but the token structure follows this conceptual schema:

```typescript
interface DesignTokens {
  colors: {
    background: string
    surface: string
    surfaceGlass: string
    textPrimary: string
    textSecondary: string
    border: string
    accentFrom: string
    accentTo: string
    accentHover: string
  }
  spacing: {
    section: string
    hero: string
    card: string
    cardMobile: string
    gap: string
    containerX: string
  }
  typography: {
    h1: string
    h2: string
    h3: string
    body: string
    small: string
    weightHeading: number
    weightSubheading: number
    weightBody: number
  }
  effects: {
    blurGlass: string
    shadowCard: string
    shadowCardHover: string
    transitionDefault: string
    borderRadiusCard: string
  }
  layout: {
    containerMaxWidth: string
    containerNarrow: string
  }
}
```

### 4.2 Component Style Patterns

Each component type follows a consistent pattern:

```typescript
interface ComponentStylePattern {
  container: string[]      // Tailwind classes for outer container
  content: string[]        // Tailwind classes for content wrapper
  interactive: string[]    // Tailwind classes for hover/focus states
  responsive: {
    mobile: string[]
    tablet: string[]
    desktop: string[]
  }
}
```

## 5. Glassmorphism Implementation

### 5.1 Core Glassmorphism Effect

Glassmorphism requires three key properties:
1. **Semi-transparent background**: `bg-white/90` or `bg-slate-900/80`
2. **Backdrop blur**: `backdrop-blur-lg` (16px blur)
3. **Subtle border**: `border border-slate-200 dark:border-slate-800`

### 5.2 Glassmorphism Variants

#### 5.2.1 Standard Glass Card
```css
.glass-card-standard {
  background-color: rgb(255 255 255 / 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid theme('colors.slate.200');
  border-radius: 1rem;
}

.dark .glass-card-standard {
  background-color: rgb(15 23 42 / 0.8);
  border-color: theme('colors.slate.800');
}
```

#### 5.2.2 Navbar Glass
```css
.glass-navbar {
  background-color: rgb(255 255 255 / 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid theme('colors.slate.200');
}

.dark .glass-navbar {
  background-color: rgb(15 23 42 / 0.8);
  border-bottom-color: theme('colors.slate.800');
}
```

#### 5.2.3 Hero Glass Overlay
```css
.glass-hero-overlay {
  background: linear-gradient(
    to bottom,
    rgb(255 255 255 / 0.95),
    rgb(255 255 255 / 0.85)
  );
  backdrop-filter: blur(8px);
}

.dark .glass-hero-overlay {
  background: linear-gradient(
    to bottom,
    rgb(15 23 42 / 0.9),
    rgb(15 23 42 / 0.8)
  );
}
```

### 5.3 Layering and Z-Index

Proper layering ensures glassmorphism works correctly:

```css
/* Z-index scale */
.z-navbar { z-index: 50; }
.z-modal { z-index: 100; }
.z-tooltip { z-index: 200; }

/* Ensure backdrop-filter works */
.glass-card {
  position: relative;
  isolation: isolate;
}
```

## 6. Color System Refactoring

### 6.1 Color Migration Map

| Current (Incorrect) | New (Correct) | Usage |
|---------------------|---------------|-------|
| `gray-50` | `slate-50` | Light background |
| `gray-950` | `slate-950` | Dark background |
| `gray-100` | `slate-100` | Light surface |
| `gray-900` | `slate-900` | Dark surface |
| `gray-200` | `slate-200` | Light border |
| `gray-800` | `slate-800` | Dark border |
| `gray-600` | `slate-600` | Light secondary text |
| `gray-400` | `slate-400` | Dark secondary text |
| `gray-300` | `slate-300` | Dark secondary text (alt) |
| `green-500` | `cyan-500` | Accent start |
| `blue-500` | `indigo-500` | Accent end |
| `green-*` hover | `cyan-*` hover | Interactive states |

### 6.2 Gradient Standardization

All gradients must use the cyan → indigo palette:

```tsx
{/* Brand gradient (text) */}
<span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">

{/* Background gradient */}
<div className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10">

{/* Button gradient */}
<button className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600">
```

### 6.3 Hover State Consistency

All interactive elements must use consistent hover states:

```tsx
{/* Text links */}
<a className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">

{/* Buttons */}
<button className="bg-cyan-500 hover:bg-cyan-600 transition-colors">

{/* Cards */}
<div className="hover:shadow-lg hover:scale-[1.02] transition-all">
```

## 7. Spacing Standardization

### 7.1 Vertical Spacing Rules

**Hero Sections**: Always use `py-16` (64px)
- HomePage hero
- ProductsPage hero
- Any full-width hero section

**Content Sections**: Always use `py-12` (48px)
- Standard page sections
- MenuPage
- LatestPage
- Footer

**Card Internal Padding**:
- Desktop: `p-6` (24px)
- Mobile: `p-4` (16px)
- Use responsive: `p-4 md:p-6`

### 7.2 Horizontal Spacing Rules

**Container Padding**: Always use `px-4 sm:px-6 lg:px-8`
- Consistent across all pages
- Provides comfortable margins on all screen sizes

**Grid Gaps**: Always use `gap-6` (24px) for standard grids
- Product grids
- Card grids
- Feature grids

**Flex Gaps**: Use `gap-4` (16px) for inline elements
- Navigation links
- Button groups
- Icon lists

### 7.3 Section Spacing

Between major sections, use `space-y-12` or `space-y-16`:

```tsx
<div className="space-y-12">
  <section>{/* Section 1 */}</section>
  <section>{/* Section 2 */}</section>
  <section>{/* Section 3 */}</section>
</div>
```

## 8. Typography System

### 8.1 Heading Hierarchy

```tsx
{/* H1 - Page titles */}
<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">

{/* H2 - Section titles */}
<h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">

{/* H3 - Subsection titles */}
<h3 className="text-xl font-semibold text-slate-900 dark:text-white">

{/* H4 - Card titles */}
<h4 className="text-lg font-semibold text-slate-900 dark:text-white">
```

### 8.2 Body Text

```tsx
{/* Primary body text */}
<p className="text-base text-slate-900 dark:text-white">

{/* Secondary body text */}
<p className="text-base text-slate-600 dark:text-slate-300">

{/* Small text (captions, labels) */}
<p className="text-sm text-slate-600 dark:text-slate-300">

{/* Extra small text (legal, footnotes) */}
<p className="text-xs text-slate-500 dark:text-slate-400">
```

### 8.3 Font Weight Usage

- **Bold (700)**: H1, H2 headings
- **Semibold (600)**: H3, H4, subheadings, button text
- **Medium (500)**: Navigation links, emphasized text
- **Normal (400)**: Body text, descriptions

### 8.4 Line Height

```tsx
{/* Tight - for large headings */}
<h1 className="leading-tight">

{/* Snug - for smaller headings */}
<h3 className="leading-snug">

{/* Normal - for body text */}
<p className="leading-normal">

{/* Relaxed - for long-form content */}
<article className="leading-relaxed">
```

## 9. Error Handling

### 9.1 CSS Fallbacks

Provide fallbacks for browsers that don't support modern CSS features:

```css
.glass-card {
  /* Fallback for browsers without backdrop-filter */
  background-color: rgb(255 255 255 / 0.95);
  
  /* Modern glassmorphism */
  @supports (backdrop-filter: blur(16px)) {
    background-color: rgb(255 255 255 / 0.9);
    backdrop-filter: blur(16px);
  }
}
```

### 9.2 Dark Mode Fallbacks

Ensure all color tokens have both light and dark variants:

```css
:root {
  --color-text-primary: theme('colors.slate.900');
}

.dark {
  --color-text-primary: theme('colors.white');
}

/* Usage always works in both modes */
.text-primary {
  color: var(--color-text-primary);
}
```

### 9.3 Missing Token Handling

If a CSS custom property is not defined, Tailwind classes provide fallback:

```tsx
{/* Preferred: using custom property */}
<div className="bg-surface">

{/* Fallback: direct Tailwind class */}
<div className="bg-white dark:bg-slate-900">
```

## 10. Testing Strategy

### 10.1 Visual Regression Testing

**Manual Testing Checklist**:
1. Test all pages in light mode
2. Test all pages in dark mode
3. Test all pages at mobile (375px), tablet (768px), desktop (1440px)
4. Verify glassmorphism effects render correctly
5. Verify all hover states work consistently
6. Verify all gradients use cyan → indigo
7. Verify all spacing is consistent

**Pages to Test**:
- HomePage
- ProductsPage
- MenuPage
- LatestPage
- AboutPage
- PrivacyPage
- TermsPage

### 10.2 Cross-Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Specific Checks**:
- Backdrop-filter support (glassmorphism)
- CSS custom properties
- Dark mode class switching
- Gradient rendering

### 10.3 Responsive Testing

Test at breakpoints:
- 375px (iPhone SE)
- 390px (iPhone 12/13/14)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)
- 1920px (Large Desktop)

**Specific Checks**:
- Container padding scales correctly
- Card padding switches at md breakpoint
- Typography scales appropriately
- Grid layouts adapt correctly

### 10.4 Accessibility Testing

**Color Contrast**:
- Verify all text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Test with browser DevTools contrast checker
- Verify in both light and dark modes

**Focus States**:
- All interactive elements have visible focus states
- Focus states use cyan accent color
- Keyboard navigation works correctly

### 10.5 Performance Testing

**Metrics to Monitor**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

**Specific Checks**:
- No layout shift from CSS custom property loading
- Backdrop-filter doesn't cause performance issues
- Dark mode switching is instant (no flash)



## 11. Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

For this design system overhaul, properties focus on static code analysis—verifying that CSS and component files follow the design system rules consistently.

### 11.1 Design Token Completeness

**Property 1: All required design tokens are defined in index.css**

*For any* design token category (colors, spacing, typography, effects), all required tokens for that category should be defined as CSS custom properties in index.css with both light and dark mode variants where applicable.

**Validates: Requirements 3.1.1, 3.1.3, 3.1.5, 3.8.4**

### 11.2 Spacing Standardization

**Property 2: All spacing values follow the 4px/8px grid system**

*For any* component file, all spacing-related Tailwind classes (p-*, m-*, gap-*, space-*) should use values that are multiples of 4px (1 = 4px, 2 = 8px, 4 = 16px, 6 = 24px, 8 = 32px, 12 = 48px, 16 = 64px).

**Validates: Requirements 3.1.2**

**Property 3: All border radius values are standardized**

*For any* component file, all border radius classes should use only standardized values (rounded-lg, rounded-xl, rounded-2xl), with rounded-2xl being the standard for cards.

**Validates: Requirements 3.1.4**

### 11.3 Color Consistency

**Property 4: No gray colors are used, only slate**

*For any* component file, there should be no occurrences of gray-* color classes (gray-50, gray-100, etc.), only slate-* color classes.

**Validates: Requirements 3.2.1**

**Property 5: No green colors are used, only cyan and indigo**

*For any* component file, there should be no occurrences of green-* color classes in gradients or accent colors, only cyan-* and indigo-* classes.

**Validates: Requirements 3.2.2**

**Property 6: All color tokens have dark mode variants**

*For any* color CSS custom property defined in :root, there should be a corresponding definition in the .dark selector.

**Validates: Requirements 3.2.4**

### 11.4 Interactive Element Consistency

**Property 7: All interactive elements have hover states with transitions**

*For any* interactive element (button, a, clickable div), if it has a hover: class, it should also have a transition-* class.

**Validates: Requirements 3.2.3, 3.4.3**

### 11.5 Section Spacing Consistency

**Property 8: Hero sections use py-16, content sections use py-12**

*For any* page file, sections identified as hero sections (first major section) should use py-16, and content sections should use py-12.

**Validates: Requirements 3.3.2**

**Property 9: All cards use responsive padding (p-4 md:p-6)**

*For any* card component, the padding should use the pattern p-4 md:p-6 or equivalent responsive padding.

**Validates: Requirements 3.3.3**

**Property 10: All grids use consistent gap spacing**

*For any* grid container, the gap should use gap-6 (24px) as the standard, or gap-4 (16px) for compact layouts.

**Validates: Requirements 3.3.4**

### 11.6 Glassmorphism Implementation

**Property 11: All cards implement complete glassmorphism effect**

*For any* card component, it should include all glassmorphism properties: backdrop-blur-lg, semi-transparent background (bg-white/90 or bg-slate-900/80), border (border-slate-200 dark:border-slate-800), and rounded-2xl.

**Validates: Requirements 3.4.1, 3.4.2, 3.7.1, 3.7.2, 3.7.3**

### 11.7 Typography Consistency

**Property 12: All headings follow the typography hierarchy**

*For any* component file, h1 elements should use text-3xl md:text-5xl, h2 elements should use text-2xl md:text-3xl, h3 elements should use text-xl, and h4 elements should use text-lg, with appropriate font weights (bold for h1/h2, semibold for h3/h4).

**Validates: Requirements 3.5.1, 3.5.3**

**Property 13: All text uses correct color classes**

*For any* text element, primary text should use text-slate-900 dark:text-white, and secondary text should use text-slate-600 dark:text-slate-300.

**Validates: Requirements 3.5.4**

### 11.8 Layout Consistency

**Property 14: All page containers use consistent structure**

*For any* page file, the main container should use max-w-7xl (or max-w-5xl for narrow content) with px-4 sm:px-6 lg:px-8 for horizontal padding.

**Validates: Requirements 3.3.1, 3.6.1**

**Property 15: All pages use standard responsive breakpoints**

*For any* component file, responsive classes should only use Tailwind's standard breakpoints (sm:, md:, lg:, xl:, 2xl:), with no arbitrary breakpoint values.

**Validates: Requirements 3.6.3**

### 11.9 Code Quality

**Property 16: No inline styles in components**

*For any* component file, there should be no style={{}} attributes or inline style strings.

**Validates: Requirements 3.8.1**

**Property 17: Minimal use of arbitrary Tailwind values**

*For any* component file, the use of arbitrary values (square bracket notation like [16px]) should be minimal or non-existent, with preference for standard Tailwind classes.

**Validates: Requirements 3.8.2**

### 11.10 Testing Notes

These properties are designed for static code analysis and can be implemented as:

1. **Unit tests**: Parse specific files and check for specific patterns
2. **Property-based tests**: Generate random component structures and verify they follow the rules
3. **Linting rules**: Custom ESLint or Stylelint rules to enforce design system compliance
4. **Visual regression tests**: Screenshot comparison to ensure visual consistency

The properties focus on verifiable, objective criteria that can be automatically checked, excluding subjective design decisions that require human judgment.
