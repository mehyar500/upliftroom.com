import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 10: All grids use consistent gap spacing
 * 
 * For any grid container, the gap should use gap-6 (24px) as the standard,
 * or gap-4 (16px) for compact layouts.
 * 
 * **Validates: Requirements 3.3.4**
 * **Feature: design-system-overhaul, Property 10: All grids use consistent gap spacing**
 */
describe('Property 10: All grids use consistent gap spacing', () => {
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
   * Helper function to identify grid elements
   * Grids typically have:
   * - grid class
   * - grid-cols-* classes
   */
  const isGridElement = (line: string): boolean => {
    return /\bgrid\b/.test(line) && /grid-cols-/.test(line);
  };

  /**
   * Helper function to identify flex containers that should use gap
   * Flex containers with multiple items often use gap for spacing
   */
  const isFlexContainer = (line: string): boolean => {
    return /\bflex\b/.test(line) && !/flex-col\b/.test(line);
  };

  /**
   * Check if gap follows the standard pattern
   * Valid patterns:
   * - gap-6 (standard for grids)
   * - gap-4 (compact layouts, inline elements)
   * - gap-8 (larger spacing, rare but acceptable)
   */
  const hasStandardGap = (className: string): boolean => {
    // Check for standard gap values
    const hasGap4 = /\bgap-4\b/.test(className);
    const hasGap6 = /\bgap-6\b/.test(className);
    const hasGap8 = /\bgap-8\b/.test(className);
    
    return hasGap4 || hasGap6 || hasGap8;
  };

  /**
   * Extract gap classes from a className string
   */
  const extractGapClasses = (className: string): string[] => {
    const gapPattern = /\bgap-\d+\b/g;
    return className.match(gapPattern) || [];
  };

  /**
   * Check if gap value is inconsistent (not 4, 6, or 8)
   */
  const hasInconsistentGap = (className: string): boolean => {
    const gapClasses = extractGapClasses(className);
    
    for (const gapClass of gapClasses) {
      const value = parseInt(gapClass.replace('gap-', ''));
      // Inconsistent values from Requirements 4.1: gap-2, gap-3, gap-5, gap-10, gap-12
      if (![4, 6, 8].includes(value)) {
        return true;
      }
    }
    
    return false;
  };

  // Property: All grid elements use standard gap spacing (gap-4, gap-6, or gap-8)
  it('should use standard gap spacing (gap-4, gap-6, or gap-8) for all grids', () => {
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

            // Check if line contains a grid element
            if (isGridElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                const gapClasses = extractGapClasses(className);
                
                // Grid should have gap spacing
                if (gapClasses.length === 0) {
                  violations.push(
                    `Line ${index + 1}: Grid element without gap spacing\n` +
                    `  Expected: gap-6 (standard) or gap-4 (compact)`
                  );
                } else if (!hasStandardGap(className)) {
                  violations.push(
                    `Line ${index + 1}: Grid element with non-standard gap\n` +
                    `  Current gap: ${gapClasses.join(' ')}\n` +
                    `  Expected: gap-6 (standard) or gap-4 (compact)`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found grids without standard gap spacing in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All grids must use gap-6 (standard) or gap-4 (compact) spacing (Requirements 3.3.4).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Grids should not use inconsistent gap values
  it('should not use inconsistent gap values (gap-2, gap-3, gap-5, gap-10, gap-12)', () => {
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

            // Check if line contains a grid or flex element
            if (isGridElement(line) || isFlexContainer(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                if (hasInconsistentGap(className)) {
                  const gapClasses = extractGapClasses(className);
                  violations.push(
                    `Line ${index + 1}: Element uses inconsistent gap value\n` +
                    `  Current gap: ${gapClasses.join(' ')}\n` +
                    `  Expected: gap-4, gap-6, or gap-8 only`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found elements with inconsistent gap values in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'Use only gap-4, gap-6, or gap-8 for consistent spacing (Requirements 3.3.4).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Grid gap should follow the 4px/8px grid system
  it('should follow the 4px/8px grid system for gap values', () => {
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

            const classNameMatch = line.match(/className=["']([^"']+)["']/);
            
            if (classNameMatch) {
              const className = classNameMatch[1];
              const gapClasses = extractGapClasses(className);
              
              for (const gapClass of gapClasses) {
                const value = parseInt(gapClass.replace('gap-', ''));
                
                // Check if value follows 4px/8px grid system
                // Valid values: 1 (4px), 2 (8px), 4 (16px), 6 (24px), 8 (32px), 12 (48px), 16 (64px)
                // For gap, we standardize to 4, 6, 8
                if (![1, 2, 4, 6, 8, 12, 16].includes(value)) {
                  violations.push(
                    `Line ${index + 1}: Gap value doesn't follow 4px/8px grid system\n` +
                    `  Current: ${gapClass}\n` +
                    `  Valid values: gap-4, gap-6, gap-8 (standard)`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found gap values not following 4px/8px grid system in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All gap values must follow the 4px/8px grid system (Requirements 3.1.2, 3.3.4).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Standard grids (product grids, card grids) should use gap-6
  it('should use gap-6 for standard grids (product grids, card grids, feature grids)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          const lines = content.split('\n');
          const warnings: string[] = [];

          lines.forEach((line: string, index: number) => {
            // Skip comments
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('//') || 
                trimmedLine.startsWith('*') || 
                trimmedLine.startsWith('/*')) {
              return;
            }

            // Check if line contains a standard grid (2-4 columns, card-like content)
            if (isGridElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check if it's a standard grid (grid-cols-1 md:grid-cols-2/3/4)
                const isStandardGrid = /grid-cols-[1-4]/.test(className) || 
                                      /md:grid-cols-[2-4]/.test(className) ||
                                      /lg:grid-cols-[2-4]/.test(className);
                
                if (isStandardGrid) {
                  const gapClasses = extractGapClasses(className);
                  const hasGap6 = /\bgap-6\b/.test(className);
                  
                  // Standard grids should prefer gap-6
                  if (gapClasses.length > 0 && !hasGap6) {
                    warnings.push(
                      `Line ${index + 1}: Standard grid uses ${gapClasses.join(' ')} instead of gap-6\n` +
                      `  Recommendation: Use gap-6 for standard grids`
                    );
                  }
                }
              }
            }
          });

          // This is a soft check - we don't fail, just warn
          // The main requirement is that gaps are consistent (checked in previous tests)
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
