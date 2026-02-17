import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 1: All required design tokens are defined in index.css
 * 
 * For any design token category (colors, spacing, typography, effects),
 * all required tokens for that category should be defined as CSS custom
 * properties in index.css with both light and dark mode variants where applicable.
 * 
 * **Validates: Requirements 3.1.1, 3.1.3, 3.1.5, 3.8.4**
 */
describe('Design Token Completeness', () => {
  const indexCssPath = join(__dirname, '..', 'index.css');
  const indexCssContent = readFileSync(indexCssPath, 'utf-8');

  describe('Color Tokens', () => {
    const requiredColorTokens = [
      '--color-background',
      '--color-surface',
      '--color-surface-glass',
      '--color-text-primary',
      '--color-text-secondary',
      '--color-border',
      '--color-accent-from',
      '--color-accent-to',
      '--color-accent-hover',
    ];

    it('should define all required color tokens in :root', () => {
      requiredColorTokens.forEach(token => {
        expect(indexCssContent).toContain(token);
      });
    });
  });

  describe('Spacing Tokens', () => {
    const requiredSpacingTokens = [
      '--spacing-section',
      '--spacing-hero',
      '--spacing-card',
      '--spacing-card-mobile',
      '--spacing-gap',
      '--spacing-container-x',
    ];

    it('should define all required spacing tokens', () => {
      requiredSpacingTokens.forEach(token => {
        expect(indexCssContent).toContain(token);
      });
    });

    it('should use 4px/8px grid system for spacing values', () => {
      // Verify spacing values are multiples of 4px (0.25rem)
      const spacingPatterns = [
        /--spacing-section:\s*3rem/,      // 48px = 12 * 4px
        /--spacing-hero:\s*4rem/,         // 64px = 16 * 4px
        /--spacing-card:\s*1\.5rem/,      // 24px = 6 * 4px
        /--spacing-card-mobile:\s*1rem/,  // 16px = 4 * 4px
        /--spacing-gap:\s*1\.5rem/,       // 24px = 6 * 4px
        /--spacing-container-x:\s*1rem/,  // 16px = 4 * 4px
      ];

      spacingPatterns.forEach(pattern => {
        expect(indexCssContent).toMatch(pattern);
      });
    });
  });

  describe('Typography Tokens', () => {
    const requiredTypographyTokens = [
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
    ];

    it('should define all required typography tokens', () => {
      requiredTypographyTokens.forEach(token => {
        expect(indexCssContent).toContain(token);
      });
    });
  });

  describe('Effect Tokens', () => {
    const requiredEffectTokens = [
      '--blur-glass',
      '--shadow-card',
      '--shadow-card-hover',
      '--transition-default',
      '--border-radius-card',
    ];

    it('should define all required effect tokens', () => {
      requiredEffectTokens.forEach(token => {
        expect(indexCssContent).toContain(token);
      });
    });

    it('should define border radius as 1rem (rounded-2xl)', () => {
      expect(indexCssContent).toMatch(/--border-radius-card:\s*1rem/);
    });
  });

  describe('Layout Tokens', () => {
    const requiredLayoutTokens = [
      '--container-max-width',
      '--container-narrow',
    ];

    it('should define all required layout tokens', () => {
      requiredLayoutTokens.forEach(token => {
        expect(indexCssContent).toContain(token);
      });
    });
  });

  describe('Utility Classes', () => {
    const requiredUtilityClasses = [
      '.bg-surface',
      '.bg-surface-glass',
      '.text-primary',
      '.text-secondary',
      '.border-default',
    ];

    it('should define all required utility classes', () => {
      requiredUtilityClasses.forEach(className => {
        expect(indexCssContent).toContain(className);
      });
    });
  });

  describe('Glassmorphism Patterns', () => {
    const requiredGlassClasses = [
      '.glass-card',
      '.glass-navbar',
      '.glass-hero-overlay',
    ];

    it('should define all required glassmorphism utility classes', () => {
      requiredGlassClasses.forEach(className => {
        expect(indexCssContent).toContain(className);
      });
    });

    it('should implement complete glassmorphism effect in .glass-card', () => {
      // Verify .glass-card has all required properties
      expect(indexCssContent).toContain('backdrop-filter: blur(var(--blur-glass))');
      expect(indexCssContent).toContain('border: 1px solid var(--color-border)');
      expect(indexCssContent).toContain('border-radius: var(--border-radius-card)');
      expect(indexCssContent).toContain('box-shadow: var(--shadow-card)');
    });

    it('should provide fallback for browsers without backdrop-filter support', () => {
      expect(indexCssContent).toContain('@supports not (backdrop-filter: blur(16px))');
    });
  });
});

/**
 * Property 6: All color tokens have dark mode variants
 * 
 * For any color CSS custom property defined in :root, there should be
 * a corresponding definition in the .dark selector.
 * 
 * **Validates: Requirements 3.2.4**
 */
describe('Dark Mode Variants', () => {
  const indexCssPath = join(__dirname, '..', 'index.css');
  const indexCssContent = readFileSync(indexCssPath, 'utf-8');

  const colorTokensRequiringDarkMode = [
    '--color-background',
    '--color-surface',
    '--color-surface-glass',
    '--color-text-primary',
    '--color-text-secondary',
    '--color-border',
    '--color-accent-hover',
  ];

  it('should have .dark selector defined', () => {
    expect(indexCssContent).toContain('.dark {');
  });

  it('should define dark mode variants for all color tokens', () => {
    // Extract the .dark block
    const darkBlockMatch = indexCssContent.match(/\.dark\s*\{([^}]+)\}/s);
    expect(darkBlockMatch).toBeTruthy();
    
    if (darkBlockMatch) {
      const darkBlockContent = darkBlockMatch[1];
      
      colorTokensRequiringDarkMode.forEach(token => {
        expect(darkBlockContent).toContain(token);
      });
    }
  });

  it('should not require dark mode variants for non-color tokens', () => {
    // Spacing, typography, effect, and layout tokens should NOT be in .dark
    const nonColorTokens = [
      '--spacing-section',
      '--text-h1',
      '--blur-glass',
      '--container-max-width',
    ];

    const darkBlockMatch = indexCssContent.match(/\.dark\s*\{([^}]+)\}/s);
    if (darkBlockMatch) {
      const darkBlockContent = darkBlockMatch[1];
      
      nonColorTokens.forEach(token => {
        expect(darkBlockContent).not.toContain(token);
      });
    }
  });

  it('should use slate colors in dark mode (not gray)', () => {
    const darkBlockMatch = indexCssContent.match(/\.dark\s*\{([^}]+)\}/s);
    if (darkBlockMatch) {
      const darkBlockContent = darkBlockMatch[1];
      
      // Should use slate colors
      expect(darkBlockContent).toMatch(/slate\.950|slate\.900|slate\.800|slate\.300/);
      
      // Should NOT use gray colors
      expect(darkBlockContent).not.toMatch(/gray\.950|gray\.900|gray\.800|gray\.300/);
    }
  });
});

/**
 * Property 4: No gray colors are used, only slate
 * 
 * For any component file, there should be no occurrences of gray-* color classes
 * (gray-50, gray-100, etc.), only slate-* color classes.
 * 
 * **Validates: Requirements 3.2.1**
 */
describe('Color Consistency - No Gray Colors', () => {
  const componentsPath = join(__dirname, '..', 'components');

  const checkFileForGrayColors = (filePath: string, fileName: string) => {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for gray-* color classes
    const grayColorPattern = /\bgray-\d+\b/g;
    const matches = content.match(grayColorPattern);
    
    if (matches) {
      throw new Error(
        `Found gray color classes in ${fileName}: ${matches.join(', ')}. ` +
        'All gray colors should be replaced with slate colors.'
      );
    }
  };

  it('Footer component should not use gray colors', () => {
    const footerPath = join(componentsPath, 'Footer.tsx');
    checkFileForGrayColors(footerPath, 'Footer.tsx');
  });

  it('Navbar component should not use gray colors', () => {
    const navbarPath = join(componentsPath, 'Navbar.tsx');
    checkFileForGrayColors(navbarPath, 'Navbar.tsx');
  });

  it('Layout component should not use gray colors', () => {
    const layoutPath = join(componentsPath, 'Layout.tsx');
    checkFileForGrayColors(layoutPath, 'Layout.tsx');
  });
});

/**
 * Property 5: No green colors are used, only cyan and indigo
 * 
 * For any component file, there should be no occurrences of green-* color classes
 * in gradients or accent colors, only cyan-* and indigo-* classes.
 * 
 * **Validates: Requirements 3.2.2**
 */
describe('Color Consistency - No Green Accents', () => {
  const componentsPath = join(__dirname, '..', 'components');

  const checkFileForGreenAccents = (filePath: string, fileName: string) => {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for green-* color classes (excluding comments)
    const lines = content.split('\n');
    const greenColorPattern = /\bgreen-\d+\b/g;
    
    lines.forEach((line: string, index: number) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
        return;
      }
      
      const matches = line.match(greenColorPattern);
      if (matches) {
        throw new Error(
          `Found green color classes in ${fileName} at line ${index + 1}: ${matches.join(', ')}. ` +
          'All green colors should be replaced with cyan/indigo colors.'
        );
      }
    });
  };

  it('Footer component should not use green accent colors', () => {
    const footerPath = join(componentsPath, 'Footer.tsx');
    checkFileForGreenAccents(footerPath, 'Footer.tsx');
  });

  it('Navbar component should not use green accent colors', () => {
    const navbarPath = join(componentsPath, 'Navbar.tsx');
    checkFileForGreenAccents(navbarPath, 'Navbar.tsx');
  });

  it('Footer should use cyan-indigo gradient for brand', () => {
    const footerPath = join(componentsPath, 'Footer.tsx');
    const content = readFileSync(footerPath, 'utf-8');
    
    // Check for the correct gradient pattern
    expect(content).toMatch(/from-cyan-\d+\s+to-indigo-\d+/);
  });

  it('Footer links should use cyan hover states', () => {
    const footerPath = join(componentsPath, 'Footer.tsx');
    const content = readFileSync(footerPath, 'utf-8');
    
    // Check for cyan hover states on links
    expect(content).toMatch(/hover:text-cyan-\d+/);
  });
});
