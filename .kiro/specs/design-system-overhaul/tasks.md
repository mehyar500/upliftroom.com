# Implementation Plan: Design System Overhaul

## Overview

This implementation plan transforms the UpliftRoom website from scattered, inconsistent styling to a cohesive, centralized design system. The approach focuses on:

1. Centralizing all design tokens in `index.css` using CSS custom properties
2. Eliminating color inconsistencies (gray → slate, green → cyan/indigo)
3. Standardizing spacing across all pages (py-16 for heroes, py-12 for sections)
4. Implementing proper glassmorphism effects on all cards
5. Ensuring consistent typography hierarchy and responsive design

The implementation follows a systematic approach: define tokens first, then refactor shared components (Layout, Navbar, Footer), then update individual pages, and finally add comprehensive testing.

## Tasks

- [x] 1. Define design tokens and utility classes in index.css
  - Add CSS custom properties for colors (light and dark mode variants)
  - Add CSS custom properties for spacing (section, hero, card, gap)
  - Add CSS custom properties for typography (sizes, weights, line heights)
  - Add CSS custom properties for effects (blur, shadows, transitions, border radius)
  - Create utility classes for glassmorphism (.glass-card, .glass-navbar)
  - Create utility classes for common patterns (.bg-surface, .text-primary, .border-default)
  - _Requirements: 3.1 (all sub-requirements), 3.8.4_

- [x] 1.1 Write property test for design token completeness
  - **Property 1: All required design tokens are defined in index.css**
  - **Validates: Requirements 3.1.1, 3.1.3, 3.1.5, 3.8.4**

- [x] 1.2 Write property test for dark mode color variants
  - **Property 6: All color tokens have dark mode variants**
  - **Validates: Requirements 3.2.4**

- [x] 2. Refactor Layout component for color consistency
  - Replace gray-50/gray-950 with slate-50/slate-950
  - Ensure proper dark mode class structure
  - Verify background colors use design tokens
  - _Requirements: 4.5.3_

- [x] 2.1 Write property test for no gray colors in components
  - **Property 4: No gray colors are used, only slate**
  - **Validates: Requirements 3.2.1**

- [x] 3. Refactor Navbar component
  - Update colors to use slate palette consistently
  - Ensure glassmorphism effect (bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg)
  - Verify border uses slate-200/slate-800
  - Standardize spacing and padding
  - _Requirements: 4.5.1, 3.4.1, 3.7.1, 3.7.2_

- [x] 4. Refactor Footer component
  - Replace gray colors with slate colors
  - Update brand gradient from green to cyan-500 → indigo-500
  - Update link hover states to use cyan-600/cyan-400
  - Ensure consistent spacing (py-8 md:py-12)
  - _Requirements: 4.5.2, 3.2.2, 3.2.3_

- [x] 4.1 Write property test for no green colors in components
  - **Property 5: No green colors are used, only cyan and indigo**
  - **Validates: Requirements 3.2.2**

- [x] 4.2 Write property test for hover state transitions
  - **Property 7: All interactive elements have hover states with transitions**
  - **Validates: Requirements 3.2.3, 3.4.3**

- [x] 5. Checkpoint - Verify shared components
  - Ensure all tests pass
  - Manually verify Layout, Navbar, and Footer in light and dark mode
  - Check glassmorphism effects render correctly
  - Ask the user if questions arise

- [x] 6. Refactor HomePage spacing and colors
  - Standardize hero section to py-16
  - Standardize content sections to py-12
  - Update all cards to use rounded-2xl and glassmorphism
  - Ensure all cards use p-4 md:p-6 responsive padding
  - Update all gradients to cyan-500 → indigo-500
  - Verify all grids use gap-6
  - _Requirements: 4.1.1, 3.3.2, 3.3.3, 3.3.4, 3.4.1, 3.4.2, 3.4.3_

- [x] 6.1 Write property test for section spacing consistency
  - **Property 8: Hero sections use py-16, content sections use py-12**
  - **Validates: Requirements 3.3.2**

- [x] 6.2 Write property test for card padding consistency
  - **Property 9: All cards use responsive padding (p-4 md:p-6)**
  - **Validates: Requirements 3.3.3**

- [x] 6.3 Write property test for grid gap consistency
  - **Property 10: All grids use consistent gap spacing**
  - **Validates: Requirements 3.3.4**

- [x] 7. Refactor ProductsPage spacing and colors
  - Standardize hero section to py-16
  - Standardize content sections to py-12
  - Replace green hover colors with cyan-600/cyan-400
  - Update all cards to use rounded-2xl and glassmorphism
  - Ensure responsive card padding (p-4 md:p-6)
  - Verify grid uses gap-6
  - _Requirements: 4.1.2, 4.5.4, 3.3.2, 3.3.3, 3.3.4, 3.4.1_

- [x] 7.1 Write property test for glassmorphism completeness
  - **Property 11: All cards implement complete glassmorphism effect**
  - **Validates: Requirements 3.4.1, 3.4.2, 3.7.1, 3.7.2, 3.7.3**

- [x] 8. Refactor MenuPage spacing
  - Standardize all sections to py-12
  - Verify container uses max-w-5xl (narrow content)
  - Ensure consistent horizontal padding (px-4 sm:px-6 lg:px-8)
  - Update cards to use glassmorphism and rounded-2xl
  - _Requirements: 4.1.2, 3.3.2, 3.6.1_

- [x] 9. Refactor LatestPage colors and spacing
  - Replace gray-950 with slate-950
  - Replace green colors with cyan/indigo
  - Standardize sections to py-12
  - Update cards to use glassmorphism and rounded-2xl
  - Ensure responsive card padding
  - _Requirements: 4.1.3, 4.5.5, 3.3.2, 3.4.1_

- [x] 10. Checkpoint - Verify all pages
  - Ensure all tests pass
  - Manually test all pages (HomePage, ProductsPage, MenuPage, LatestPage)
  - Verify in light and dark mode
  - Test at mobile (375px), tablet (768px), and desktop (1440px) breakpoints
  - Ask the user if questions arise

- [x] 11. Update typography across all components
  - Verify h1 uses text-3xl md:text-5xl font-bold
  - Verify h2 uses text-2xl md:text-3xl font-bold
  - Verify h3 uses text-xl font-semibold
  - Verify h4 uses text-lg font-semibold
  - Ensure primary text uses text-slate-900 dark:text-white
  - Ensure secondary text uses text-slate-600 dark:text-slate-300
  - _Requirements: 3.5.1, 3.5.3, 3.5.4_

- [x] 11.1 Write property test for typography hierarchy
  - **Property 12: All headings follow the typography hierarchy**
  - **Validates: Requirements 3.5.1, 3.5.3**

- [x] 11.2 Write property test for text color consistency
  - **Property 13: All text uses correct color classes**
  - **Validates: Requirements 3.5.4**

- [x] 12. Verify layout consistency across all pages
  - Check all page containers use max-w-7xl or max-w-5xl
  - Verify all containers use px-4 sm:px-6 lg:px-8
  - Ensure all responsive classes use standard breakpoints (sm:, md:, lg:, xl:)
  - Remove any arbitrary Tailwind values ([16px], etc.)
  - _Requirements: 3.6.1, 3.6.3, 3.8.2_

- [x] 12.1 Write property test for container structure consistency
  - **Property 14: All page containers use consistent structure**
  - **Validates: Requirements 3.3.1, 3.6.1**

- [x] 12.2 Write property test for standard breakpoints
  - **Property 15: All pages use standard responsive breakpoints**
  - **Validates: Requirements 3.6.3**

- [x] 12.3 Write property test for no inline styles
  - **Property 16: No inline styles in components**
  - **Validates: Requirements 3.8.1**

- [x] 12.4 Write property test for minimal arbitrary values
  - **Property 17: Minimal use of arbitrary Tailwind values**
  - **Validates: Requirements 3.8.2**

- [x] 13. Add spacing standardization tests
  - [x] 13.1 Write property test for 4px/8px grid system
    - **Property 2: All spacing values follow the 4px/8px grid system**
    - **Validates: Requirements 3.1.2**
  
  - [x] 13.2 Write property test for border radius standardization
    - **Property 3: All border radius values are standardized**
    - **Validates: Requirements 3.1.4**

- [x] 14. Final checkpoint and comprehensive testing
  - Run all property-based tests (minimum 100 iterations each)
  - Run all unit tests
  - Perform visual regression testing on all pages
  - Test in Chrome, Firefox, Safari, and Edge
  - Test at all responsive breakpoints (375px, 768px, 1024px, 1440px)
  - Verify glassmorphism effects in all browsers
  - Check color contrast for accessibility (WCAG AA)
  - Verify keyboard navigation and focus states
  - Ensure no performance regressions (Lighthouse scores)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests should run with minimum 100 iterations due to randomization
- All property tests should be tagged with: **Feature: design-system-overhaul, Property {number}: {property_text}**
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation is purely CSS/styling - no API or database changes required
- All changes maintain backward compatibility with existing component APIs
