import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 17: Minimal use of arbitrary Tailwind values
 * 
 * For any component file, the use of arbitrary values (square bracket notation like [16px])
 * should be minimal or non-existent, with preference for standard Tailwind classes.
 * 
 * **Validates: Requirements 3.8.2**
 * **Feature: design-system-overhaul, Property 17: Minimal use of arbitrary Tailwind values**
 */
describe('Property 17: Minimal use of arbitrary Tailwind values', () => {
  const pagesPath = join(__dirname, '..', 'pages');
  const componentsPath = join(__dirname, '..', 'components');

  // Get all .tsx files from a directory
  const getTsxFiles = (dir: string): string[] => {
    try {
      return readdirSync(dir)
        .filter((file: string) => file.endsWith('.tsx'))
        .filter((file: string) => !file.includes('Admin')) // Exclude admin pages
        .map((file: string) => join(dir, file));
    } catch {
      return [];
    }
  };

  const pageFiles = getTsxFiles(pagesPath);
  const componentFiles = getTsxFiles(componentsPath);
  const allFiles = [...pageFiles, ...componentFiles];

  /**
   * Extract arbitrary Tailwind values from content
   */
  const extractArbitraryValues = (content: string): Array<{ value: string; line: number; context: string }> => {
    const lines = content.split('\n');
    const values: Array<{ value: string; line: number; context: string }> = [];
    
    // Match arbitrary value patterns: [16px], [#fff], [1.5rem], etc.
    // But exclude: [0], [1], [2], etc. (array indices)
    const arbitraryRegex = /\[(?:\d+(?:px|rem|em|%|vh|vw)|#[0-9a-fA-F]+|[a-z-]+\([^)]+\))\]/g;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(arbitraryRegex);
      
      if (matches) {
        for (const match of matches) {
          values.push({
            value: match,
            line: i + 1,
            context: line.trim().substring(0, 100),
          });
        }
      }
    }
    
    return values;
  };

  /**
   * Check if an arbitrary value is acceptable
   */
  const isAcceptableArbitraryValue = (value: string, context: string): boolean => {
    // Some arbitrary values might be acceptable for very specific use cases
    // that can't be expressed with standard Tailwind classes
    
    // Example: Custom tracking values for specific typography
    if (/tracking-\[/.test(context) && /0\.\d+em/.test(value)) {
      return true;
    }
    
    // Example: Very specific z-index values for layering
    if (/z-\[/.test(context) && /^\[\d+\]$/.test(value)) {
      return true;
    }
    
    // Most arbitrary values should not be used
    return false;
  };

  // Property: No arbitrary spacing values
  it('should not use arbitrary spacing values like [16px] or [1.5rem]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary spacing patterns
          const spacingPatterns = [
            { pattern: /(?:p|m|px|py|pl|pr|pt|pb|mx|my|ml|mr|mt|mb)-\[\d+(?:px|rem|em)\]/g, type: 'padding/margin' },
            { pattern: /(?:w|h|min-w|min-h|max-w|max-h)-\[\d+(?:px|rem|em|%)\]/g, type: 'width/height' },
            { pattern: /gap-\[\d+(?:px|rem|em)\]/g, type: 'gap' },
            { pattern: /space-[xy]-\[\d+(?:px|rem|em)\]/g, type: 'space' },
          ];
          
          for (const { pattern, type } of spacingPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              throw new Error(
                `Found arbitrary ${type} value in ${fileName}: ${matches[0]}. ` +
                `Use standard Tailwind spacing classes (p-4, gap-6, etc.) instead (Requirements 3.8.2)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No arbitrary color values
  it('should not use arbitrary color values like [#fff] or [rgb(255,255,255)]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary color patterns
          const colorPatterns = [
            { pattern: /(?:text|bg|border)-\[#[0-9a-fA-F]+\]/g, type: 'hex color' },
            { pattern: /(?:text|bg|border)-\[rgb\([^)]+\)\]/g, type: 'rgb color' },
            { pattern: /(?:text|bg|border)-\[rgba\([^)]+\)\]/g, type: 'rgba color' },
            { pattern: /(?:text|bg|border)-\[hsl\([^)]+\)\]/g, type: 'hsl color' },
          ];
          
          for (const { pattern, type } of colorPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              throw new Error(
                `Found arbitrary ${type} value in ${fileName}: ${matches[0]}. ` +
                `Use standard Tailwind color classes (text-slate-900, bg-cyan-500, etc.) instead (Requirements 3.8.2)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No arbitrary font sizes
  it('should not use arbitrary font size values like [16px] or [1.5rem]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary font size patterns
          const fontSizePattern = /text-\[\d+(?:px|rem|em)\]/g;
          const matches = content.match(fontSizePattern);
          
          if (matches) {
            throw new Error(
              `Found arbitrary font size value in ${fileName}: ${matches[0]}. ` +
              `Use standard Tailwind text classes (text-base, text-xl, etc.) instead (Requirements 3.8.2)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No arbitrary border radius values
  it('should not use arbitrary border radius values like [16px]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary border radius patterns
          const borderRadiusPattern = /rounded(?:-[tlbr]{1,2})?-\[\d+(?:px|rem|em)\]/g;
          const matches = content.match(borderRadiusPattern);
          
          if (matches) {
            throw new Error(
              `Found arbitrary border radius value in ${fileName}: ${matches[0]}. ` +
              `Use standard Tailwind rounded classes (rounded-lg, rounded-2xl, etc.) instead (Requirements 3.8.2)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Minimal arbitrary values overall
  it('should have minimal or no arbitrary values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const values = extractArbitraryValues(content);
          
          // Filter out acceptable arbitrary values
          const unacceptableValues = values.filter(
            ({ value, context }) => !isAcceptableArbitraryValue(value, context)
          );
          
          if (unacceptableValues.length > 0) {
            const examples = unacceptableValues.slice(0, 3).map(
              ({ value, line }) => `${value} at line ${line}`
            ).join(', ');
            
            throw new Error(
              `Found ${unacceptableValues.length} arbitrary value(s) in ${fileName}: ${examples}. ` +
              `Use standard Tailwind classes for better maintainability (Requirements 3.8.2)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Prefer design tokens over arbitrary values
  it('should prefer design tokens and standard classes over arbitrary values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const values = extractArbitraryValues(content);
          
          // Count total arbitrary values
          const totalArbitrary = values.length;
          
          // Files should have very few (ideally 0) arbitrary values
          // Allow up to 2 for edge cases
          const maxAllowed = 2;
          
          if (totalArbitrary > maxAllowed) {
            throw new Error(
              `${fileName} has ${totalArbitrary} arbitrary values (max ${maxAllowed} allowed). ` +
              `Use standard Tailwind classes and design tokens instead (Requirements 3.8.2)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No arbitrary breakpoint values
  it('should not use arbitrary breakpoint values like min-[640px]:', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary breakpoint patterns
          const breakpointPattern = /(?:min|max)-\[[^\]]+\]:/g;
          const matches = content.match(breakpointPattern);
          
          if (matches) {
            throw new Error(
              `Found arbitrary breakpoint value in ${fileName}: ${matches[0]}. ` +
              `Use standard Tailwind breakpoints (sm:, md:, lg:, xl:, 2xl:) instead (Requirements 3.8.2, 3.6.3)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
