import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 9: All cards use responsive padding (p-4 md:p-6)
 * 
 * For any card component, the padding should use the pattern p-4 md:p-6
 * or equivalent responsive padding.
 * 
 * **Validates: Requirements 3.3.3**
 * **Feature: design-system-overhaul, Property 9: All cards use responsive padding (p-4 md:p-6)**
 */
describe('Property 9: All cards use responsive padding (p-4 md:p-6)', () => {
  const componentsPath = join(__dirname, '..', 'components');
  const pagesPath = join(__dirname, '..', 'pages');

  // Get all .tsx files from components and pages directories
  const getComponentFiles = (dir: string): string[] => {
    try {
      return readdirSync(dir)
        .filter((file: string) => file.endsWith('.tsx'))
        .filter((file: string) => !file.includes('Admin')) // Exclude admin components
        .map((file: string) => join(dir, file));
    } catch {
      return [];
    }
  };

  const componentFiles = getComponentFiles(componentsPath);
  const pageFiles = getComponentFiles(pagesPath);
  const allFiles = [...componentFiles, ...pageFiles];

  /**
   * Helper function to identify card elements
   * Cards typically have:
   * - rounded-2xl or rounded-xl border radius
   * - border classes
   * - backdrop-blur or glassmorphism effects
   * - bg-white or bg-slate backgrounds
   * 
   * Excludes:
   * - Buttons (rounded-full, or has button/link text like "Shop", "Read", etc.)
   * - Navigation elements (<nav>, sticky top-0, z-50)
   * - Elements without rounded corners (navbars, footers)
   */
  const isCardElement = (line: string): boolean => {
    // Exclude buttons (rounded-full is a strong indicator)
    if (/rounded-full/.test(line)) {
      return false;
    }
    
    // Exclude navigation bars and sticky elements
    if (/<nav|sticky\s+top-|z-50/.test(line)) {
      return false;
    }
    
    // Exclude if it's clearly a button or link with button styling
    if (/(to=|href=).*px-\d+\s+py-\d+/.test(line)) {
      return false;
    }
    
    const cardIndicators = [
      /rounded-(xl|2xl)/,
      /backdrop-blur/,
      /border\s+border-/,
      /bg-white\/\d+/,
      /bg-slate-\d+\/\d+/,
    ];
    
    // Must have at least 2 card indicators to be considered a card
    const matchCount = cardIndicators.filter(pattern => pattern.test(line)).length;
    return matchCount >= 2;
  };

  /**
   * Check if padding follows the responsive pattern
   * Valid patterns:
   * - p-4 md:p-6 (standard)
   * - p-4 sm:p-5 md:p-6 (with intermediate breakpoint)
   * - px-4 py-4 md:px-6 md:py-6 (explicit x/y)
   * - No padding on outer div if it has overflow-hidden (image cards)
   */
  const hasCorrectPadding = (className: string, line: string): boolean => {
    // Special case: Cards with overflow-hidden (image cards) don't need padding on outer div
    // The padding is on the inner content div
    if (/overflow-hidden/.test(className)) {
      return true;
    }
    
    // Check for the standard pattern: p-4 and md:p-6
    const hasP4 = /\bp-4\b/.test(className);
    const hasMdP6 = /\bmd:p-6\b/.test(className);
    
    if (hasP4 && hasMdP6) {
      return true;
    }
    
    // Check for explicit x/y padding pattern
    const hasPx4 = /\bpx-4\b/.test(className);
    const hasPy4 = /\bpy-4\b/.test(className);
    const hasMdPx6 = /\bmd:px-6\b/.test(className);
    const hasMdPy6 = /\bmd:py-6\b/.test(className);
    
    if (hasPx4 && hasPy4 && hasMdPx6 && hasMdPy6) {
      return true;
    }
    
    return false;
  };

  /**
   * Extract padding classes from a className string
   */
  const extractPaddingClasses = (className: string): string[] => {
    const paddingPattern = /\b(p-\d+|px-\d+|py-\d+|md:p-\d+|md:px-\d+|md:py-\d+|sm:p-\d+)\b/g;
    return className.match(paddingPattern) || [];
  };

  // Property: All card elements use responsive padding (p-4 md:p-6)
  it('should use p-4 md:p-6 responsive padding for all cards', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          const lines = content.split('\n');
          const violations: string[] = [];

          lines.forEach((line: string, index: number) => {
            // Skip comments
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('//') || 
                trimmedLine.startsWith('*') || 
                trimmedLine.startsWith('/*')) {
              return;
            }

            // Check if line contains a card element
            if (isCardElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check if card has correct responsive padding
                if (!hasCorrectPadding(className, line)) {
                  const paddingClasses = extractPaddingClasses(className);
                  violations.push(
                    `Line ${index + 1}: Card element without correct responsive padding\n` +
                    `  Current padding: ${paddingClasses.length > 0 ? paddingClasses.join(' ') : 'none'}\n` +
                    `  Expected: p-4 md:p-6`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found cards without correct responsive padding in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All cards must use p-4 md:p-6 responsive padding (Requirements 3.3.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Cards should not use fixed padding without responsive variants
  it('should not use fixed padding (p-6 only) without mobile variant', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          const lines = content.split('\n');
          const violations: string[] = [];

          lines.forEach((line: string, index: number) => {
            // Skip comments
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('//') || 
                trimmedLine.startsWith('*') || 
                trimmedLine.startsWith('/*')) {
              return;
            }

            // Check if line contains a card element
            if (isCardElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check for p-6 without p-4 (fixed padding without mobile variant)
                const hasP6 = /\bp-6\b/.test(className);
                const hasP4 = /\bp-4\b/.test(className);
                const hasMdP6 = /\bmd:p-6\b/.test(className);
                
                if (hasP6 && !hasP4 && !hasMdP6) {
                  violations.push(
                    `Line ${index + 1}: Card uses fixed p-6 without mobile variant\n` +
                    `  Expected: p-4 md:p-6 for responsive design`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found cards with fixed padding in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'Cards should use responsive padding (p-4 md:p-6) for mobile-first design (Requirements 3.3.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All card padding should follow mobile-first approach
  it('should follow mobile-first approach with base padding before responsive variants', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          const lines = content.split('\n');
          const violations: string[] = [];

          lines.forEach((line: string, index: number) => {
            // Skip comments
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('//') || 
                trimmedLine.startsWith('*') || 
                trimmedLine.startsWith('/*')) {
              return;
            }

            // Check if line contains a card element
            if (isCardElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check for md:p-* without base p-*
                const hasMdPadding = /\bmd:p-\d+\b/.test(className);
                const hasBasePadding = /\bp-\d+\b/.test(className);
                
                if (hasMdPadding && !hasBasePadding) {
                  violations.push(
                    `Line ${index + 1}: Card has md:p-* without base p-* (not mobile-first)\n` +
                    `  Expected: p-4 md:p-6 pattern`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found cards not following mobile-first approach in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'Cards must have base padding before responsive variants (Requirements 3.3.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
