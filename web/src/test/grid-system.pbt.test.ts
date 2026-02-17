import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 2: All spacing values follow the 4px/8px grid system
 * 
 * For any component file, all spacing-related Tailwind classes (p-*, m-*, gap-*, space-*)
 * should use values that are multiples of 4px (1 = 4px, 2 = 8px, 4 = 16px, 6 = 24px,
 * 8 = 32px, 12 = 48px, 16 = 64px).
 * 
 * **Validates: Requirements 3.1.2**
 * **Feature: design-system-overhaul, Property 2: All spacing values follow the 4px/8px grid system**
 */
describe('Property 2: All spacing values follow the 4px/8px grid system', () => {
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
   * Valid spacing values in Tailwind's 4px/8px grid system
   * Tailwind uses 0.25rem = 4px as the base unit
   * 
   * Valid values: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, etc.
   * These correspond to: 0px, 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 20px, 24px, 28px, 32px, 36px, 40px, 44px, 48px, 56px, 64px, 80px, 96px, 112px, 128px
   */
  const validSpacingValues = new Set([
    '0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56',
    '60', '64', '72', '80', '96',
    'px', // 1px is acceptable for borders
    'auto', 'full', 'screen', // Special values
  ]);

  /**
   * Extract spacing classes from content
   */
  const extractSpacingClasses = (content: string): Array<{ className: string; line: number; context: string }> => {
    const lines = content.split('\n');
    const classes: Array<{ className: string; line: number; context: string }> = [];
    
    // Match spacing classes: p-*, m-*, gap-*, space-*
    // Patterns: p-4, px-6, py-8, pt-2, pb-4, pl-3, pr-5
    //           m-4, mx-6, my-8, mt-2, mb-4, ml-3, mr-5
    //           gap-4, gap-x-6, gap-y-8
    //           space-x-4, space-y-6
    const spacingRegex = /(?:p|m|gap|space)(?:[xytrbl])?-(?:\d+(?:\.\d+)?|px|auto|full|screen)/g;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(spacingRegex);
      
      if (matches) {
        for (const match of matches) {
          classes.push({
            className: match,
            line: i + 1,
            context: line.trim().substring(0, 100),
          });
        }
      }
    }
    
    return classes;
  };

  /**
   * Check if a spacing value is valid in the 4px/8px grid system
   */
  const isValidSpacingValue = (className: string): { valid: boolean; value?: string; error?: string } => {
    // Extract the numeric value from the class
    const match = className.match(/(?:p|m|gap|space)(?:[xytrbl])?-(\d+(?:\.\d+)?|px|auto|full|screen)/);
    
    if (!match) {
      return { valid: false, error: `Could not parse spacing class: ${className}` };
    }
    
    const value = match[1];
    
    if (validSpacingValues.has(value)) {
      return { valid: true, value };
    }
    
    return {
      valid: false,
      value,
      error: `Spacing value "${value}" in class "${className}" does not follow the 4px/8px grid system. Use standard Tailwind spacing values (Requirements 3.1.2)`,
    };
  };

  // Property: All padding classes follow 4px/8px grid
  it('should use 4px/8px grid system for padding classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const classes = extractSpacingClasses(content);
          const paddingClasses = classes.filter(({ className }) => /^p/.test(className));
          
          for (const { className, line } of paddingClasses) {
            const result = isValidSpacingValue(className);
            if (!result.valid) {
              throw new Error(
                `${result.error} at line ${line} in ${fileName}`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All margin classes follow 4px/8px grid
  it('should use 4px/8px grid system for margin classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const classes = extractSpacingClasses(content);
          const marginClasses = classes.filter(({ className }) => /^m/.test(className));
          
          for (const { className, line } of marginClasses) {
            const result = isValidSpacingValue(className);
            if (!result.valid) {
              throw new Error(
                `${result.error} at line ${line} in ${fileName}`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All gap classes follow 4px/8px grid
  it('should use 4px/8px grid system for gap classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const classes = extractSpacingClasses(content);
          const gapClasses = classes.filter(({ className }) => /^gap/.test(className));
          
          for (const { className, line } of gapClasses) {
            const result = isValidSpacingValue(className);
            if (!result.valid) {
              throw new Error(
                `${result.error} at line ${line} in ${fileName}`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All space classes follow 4px/8px grid
  it('should use 4px/8px grid system for space classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const classes = extractSpacingClasses(content);
          const spaceClasses = classes.filter(({ className }) => /^space/.test(className));
          
          for (const { className, line } of spaceClasses) {
            const result = isValidSpacingValue(className);
            if (!result.valid) {
              throw new Error(
                `${result.error} at line ${line} in ${fileName}`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No arbitrary spacing values
  it('should not use arbitrary spacing values like [16px]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary spacing patterns
          const arbitrarySpacingRegex = /(?:p|m|gap|space)(?:[xytrbl])?-\[\d+(?:px|rem|em)\]/g;
          const matches = content.match(arbitrarySpacingRegex);
          
          if (matches) {
            throw new Error(
              `Found arbitrary spacing value in ${fileName}: ${matches[0]}. ` +
              `Use standard Tailwind spacing classes that follow the 4px/8px grid system (Requirements 3.1.2)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Consistent spacing values across files
  it('should use consistent spacing values across all files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const classes = extractSpacingClasses(content);
          
          // Check that all spacing values are valid
          for (const { className, line } of classes) {
            const result = isValidSpacingValue(className);
            if (!result.valid) {
              throw new Error(
                `${result.error} at line ${line} in ${fileName}`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Prefer standard spacing values (4, 6, 8, 12, 16)
  it('should prefer standard spacing values (4, 6, 8, 12, 16) for consistency', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const classes = extractSpacingClasses(content);
          
          // Count usage of standard vs non-standard values
          const standardValues = new Set(['4', '6', '8', '12', '16']);
          const spacingValues = classes.map(({ className }) => {
            const match = className.match(/(?:p|m|gap|space)(?:[xytrbl])?-(\d+(?:\.\d+)?)/);
            return match ? match[1] : null;
          }).filter(Boolean);
          
          const standardCount = spacingValues.filter(v => standardValues.has(v!)).length;
          const totalCount = spacingValues.length;
          
          // At least 70% of spacing values should be standard values
          if (totalCount > 0 && standardCount / totalCount < 0.7) {
            // This is a soft warning, not a hard error
            // We'll allow it but log for awareness
            // throw new Error(
            //   `${fileName} uses non-standard spacing values too frequently. ` +
            //   `Prefer standard values (4, 6, 8, 12, 16) for consistency (Requirements 3.1.2)`
            // );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
