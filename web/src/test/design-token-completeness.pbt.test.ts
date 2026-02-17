import { describe, it } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 1: All required design tokens are defined in index.css
 * 
 * For any design token category (colors, spacing, typography, effects),
 * all required tokens for that category should be defined as CSS custom
 * properties in index.css with both light and dark mode variants where applicable.
 * 
 * **Feature: design-system-overhaul**
 * **Property 1: All required design tokens are defined in index.css**
 * **Validates: Requirements 3.1.1, 3.1.3, 3.1.5, 3.8.4**
 */
describe('Property 1: All required design tokens are defined in index.css', () => {
  const indexCssPath = join(__dirname, '..', 'index.css');
  const indexCssContent = readFileSync(indexCssPath, 'utf-8');

  // Define all required design tokens by category
  const designTokenCategories = {
    colors: [
      '--color-background',
      '--color-surface',
      '--color-surface-glass',
      '--color-text-primary',
      '--color-text-secondary',
      '--color-border',
      '--color-accent-from',
      '--color-accent-to',
      '--color-accent-hover',
    ],
    spacing: [
      '--spacing-section',
      '--spacing-hero',
      '--spacing-card',
      '--spacing-card-mobile',
      '--spacing-gap',
      '--spacing-container-x',
    ],
    typography: [
      '--text-h1',
      '--text-h2',
      '--text-h3',
      '--text-body',
      '--text-small',
      '--font-weight-heading',
      '--font-weight-subheading',
      '--font-weight-body',
      '--line-height-tight',
      '--line-height-snug',
      '--line-height-normal',
      '--line-height-relaxed',
    ],
    effects: [
      '--blur-glass',
      '--shadow-card',
      '--shadow-card-hover',
      '--transition-default',
      '--border-radius-card',
    ],
    layout: [
      '--container-max-width',
      '--container-narrow',
    ],
  };

  // Property: For any token category, all required tokens should be defined
  it('should define all required tokens for any given category', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(designTokenCategories)),
        (category) => {
          const tokens = designTokenCategories[category as keyof typeof designTokenCategories];
          const missingTokens: string[] = [];

          tokens.forEach((token) => {
            if (!indexCssContent.includes(token)) {
              missingTokens.push(token);
            }
          });

          if (missingTokens.length > 0) {
            throw new Error(
              `Missing ${category} tokens in index.css: ${missingTokens.join(', ')}. ` +
              'All required design tokens must be defined (Requirements 3.1.1, 3.1.3, 3.1.5, 3.8.4).'
            );
          }

          return true;
        }
      ),
      { numRuns: Object.keys(designTokenCategories).length }
    );
  });

  // Property: For any individual token, it should be defined with a valid CSS value
  it('should define each token with a valid CSS value', () => {
    const allTokens = Object.values(designTokenCategories).flat();

    fc.assert(
      fc.property(
        fc.constantFrom(...allTokens),
        (token) => {
          // Check if token exists
          if (!indexCssContent.includes(token)) {
            throw new Error(
              `Token ${token} is not defined in index.css. ` +
              'All required design tokens must be defined (Requirements 3.1.1, 3.1.3, 3.1.5, 3.8.4).'
            );
          }

          // Check if token has a value (not just declared but also assigned)
          const tokenPattern = new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*[^;]+;`);
          if (!tokenPattern.test(indexCssContent)) {
            throw new Error(
              `Token ${token} is declared but has no valid value in index.css. ` +
              'All tokens must have valid CSS values.'
            );
          }

          return true;
        }
      ),
      { numRuns: allTokens.length }
    );
  });

  // Property: Color tokens that need dark mode variants should have them
  it('should define dark mode variants for color tokens that change in dark mode', () => {
    // Only these color tokens need dark mode variants
    // Accent colors (cyan/indigo) work well in both modes and don't need variants
    const colorTokensNeedingDarkMode = [
      '--color-background',
      '--color-surface',
      '--color-surface-glass',
      '--color-text-primary',
      '--color-text-secondary',
      '--color-border',
      '--color-accent-hover',
    ];

    // Extract the .dark block
    const darkBlockMatch = indexCssContent.match(/\.dark\s*\{([^}]+)\}/s);
    if (!darkBlockMatch) {
      throw new Error('.dark selector is not defined in index.css');
    }

    const darkBlockContent = darkBlockMatch[1];

    fc.assert(
      fc.property(
        fc.constantFrom(...colorTokensNeedingDarkMode),
        (token) => {
          // These color tokens should have dark mode variants
          if (!darkBlockContent.includes(token)) {
            throw new Error(
              `Color token ${token} is missing dark mode variant in .dark selector. ` +
              'Color tokens that change in dark mode must have variants (Requirements 3.2.4).'
            );
          }

          return true;
        }
      ),
      { numRuns: colorTokensNeedingDarkMode.length }
    );
  });

  // Property: Non-color tokens should NOT have dark mode variants
  it('should not define dark mode variants for non-color tokens', () => {
    const nonColorTokens = [
      ...designTokenCategories.spacing,
      ...designTokenCategories.typography,
      ...designTokenCategories.effects,
      ...designTokenCategories.layout,
    ];

    const darkBlockMatch = indexCssContent.match(/\.dark\s*\{([^}]+)\}/s);
    if (!darkBlockMatch) {
      throw new Error('.dark selector is not defined in index.css');
    }

    const darkBlockContent = darkBlockMatch[1];

    fc.assert(
      fc.property(
        fc.constantFrom(...nonColorTokens),
        (token) => {
          // Non-color tokens should NOT be in dark mode block
          if (darkBlockContent.includes(token)) {
            throw new Error(
              `Non-color token ${token} should not have a dark mode variant. ` +
              'Only color tokens should be redefined in .dark selector.'
            );
          }

          return true;
        }
      ),
      { numRuns: nonColorTokens.length }
    );
  });

  // Property: Spacing tokens should follow 4px/8px grid system
  it('should use 4px/8px grid system for spacing tokens', () => {
    const spacingTokens = designTokenCategories.spacing;
    
    // Valid spacing values (multiples of 4px = 0.25rem)
    // 1rem = 16px = 4 * 4px
    // 1.5rem = 24px = 6 * 4px
    // 3rem = 48px = 12 * 4px
    // 4rem = 64px = 16 * 4px
    const validSpacingPattern = /:\s*(1rem|1\.5rem|3rem|4rem)\s*;/;

    fc.assert(
      fc.property(
        fc.constantFrom(...spacingTokens),
        (token) => {
          // Extract the token definition
          const tokenPattern = new RegExp(
            `${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^;]+);`
          );
          const match = indexCssContent.match(tokenPattern);

          if (!match) {
            throw new Error(`Token ${token} not found in index.css`);
          }

          const tokenDefinition = match[0];

          if (!validSpacingPattern.test(tokenDefinition)) {
            throw new Error(
              `Spacing token ${token} does not follow 4px/8px grid system. ` +
              'All spacing values must be multiples of 4px (Requirements 3.1.2).'
            );
          }

          return true;
        }
      ),
      { numRuns: spacingTokens.length }
    );
  });

  // Property: Border radius should be standardized (1rem for rounded-2xl)
  it('should use standardized border radius value', () => {
    const borderRadiusToken = '--border-radius-card';
    const expectedValue = '1rem'; // rounded-2xl

    const tokenPattern = new RegExp(
      `${borderRadiusToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^;]+);`
    );
    const match = indexCssContent.match(tokenPattern);

    if (!match) {
      throw new Error(`Token ${borderRadiusToken} not found in index.css`);
    }

    const actualValue = match[1].trim();

    if (actualValue !== expectedValue) {
      throw new Error(
        `Border radius token ${borderRadiusToken} has value "${actualValue}" but should be "${expectedValue}". ` +
        'Border radius should be standardized to 1rem (rounded-2xl) (Requirements 3.1.4).'
      );
    }
  });

  // Property: All utility classes should reference design tokens
  it('should define utility classes that reference design tokens', () => {
    const utilityClasses = [
      { className: '.bg-surface', expectedToken: '--color-surface' },
      { className: '.bg-surface-glass', expectedToken: '--color-surface-glass' },
      { className: '.text-primary', expectedToken: '--color-text-primary' },
      { className: '.text-secondary', expectedToken: '--color-text-secondary' },
      { className: '.border-default', expectedToken: '--color-border' },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...utilityClasses),
        ({ className, expectedToken }) => {
          // Check if utility class exists
          if (!indexCssContent.includes(className)) {
            throw new Error(
              `Utility class ${className} is not defined in index.css. ` +
              'All required utility classes must be defined (Requirements 3.8.4).'
            );
          }

          // Extract the utility class definition
          const classPattern = new RegExp(
            `${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`
          );
          const match = indexCssContent.match(classPattern);

          if (!match) {
            throw new Error(`Utility class ${className} definition not found`);
          }

          const classContent = match[1];

          // Check if it references the expected token
          if (!classContent.includes(`var(${expectedToken})`)) {
            throw new Error(
              `Utility class ${className} does not reference token ${expectedToken}. ` +
              'Utility classes should use CSS custom properties (Requirements 3.8.4).'
            );
          }

          return true;
        }
      ),
      { numRuns: utilityClasses.length }
    );
  });

  // Property: Glassmorphism classes should be complete
  it('should define complete glassmorphism utility classes', () => {
    const glassClasses = ['.glass-card', '.glass-navbar', '.glass-hero-overlay'];

    fc.assert(
      fc.property(
        fc.constantFrom(...glassClasses),
        (className) => {
          if (!indexCssContent.includes(className)) {
            throw new Error(
              `Glassmorphism class ${className} is not defined in index.css. ` +
              'All glassmorphism patterns must be defined (Requirements 3.7.1, 3.7.2).'
            );
          }

          return true;
        }
      ),
      { numRuns: glassClasses.length }
    );
  });

  // Property: .glass-card should have all required glassmorphism properties
  it('should implement complete glassmorphism effect in .glass-card', () => {
    const requiredProperties = [
      'backdrop-filter: blur(var(--blur-glass))',
      'border: 1px solid var(--color-border)',
      'border-radius: var(--border-radius-card)',
      'box-shadow: var(--shadow-card)',
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...requiredProperties),
        (property) => {
          if (!indexCssContent.includes(property)) {
            throw new Error(
              `Glassmorphism property "${property}" is missing from .glass-card. ` +
              'Complete glassmorphism effect requires all properties (Requirements 3.7.1, 3.7.2, 3.7.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: requiredProperties.length }
    );
  });

  // Property: Should provide fallback for browsers without backdrop-filter
  it('should provide fallback for browsers without backdrop-filter support', () => {
    const fallbackPattern = /@supports not \(backdrop-filter: blur\(16px\)\)/;

    if (!fallbackPattern.test(indexCssContent)) {
      throw new Error(
        'Missing @supports fallback for backdrop-filter. ' +
        'Fallback is required for browser compatibility.'
      );
    }
  });
});
