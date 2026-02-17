import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 4: No gray colors are used, only slate
 * 
 * For any component file, there should be no occurrences of gray-* color classes
 * (gray-50, gray-100, etc.), only slate-* color classes.
 * 
 * **Validates: Requirements 3.2.1**
 */
describe('Property 4: No gray colors are used, only slate', () => {
  const componentsPath = join(__dirname, '..', 'components');
  const pagesPath = join(__dirname, '..', 'pages');

  // Get all .tsx files from components and pages directories
  // Exclude admin components as they are out of scope (Requirements 6.2)
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

  // Property: For any file in the codebase, no gray-* color classes should exist
  it('should not contain gray-* color classes in any component or page file', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Pattern to match gray-* color classes (e.g., gray-50, gray-100, etc.)
          // We use word boundaries to avoid matching things like "grayish" or "grayscale"
          const grayColorPattern = /\bgray-\d+\b/g;
          const matches = content.match(grayColorPattern);
          
          // Property holds if no gray colors are found
          if (matches) {
            // Provide detailed failure message
            throw new Error(
              `Found gray color classes in ${fileName}: ${matches.join(', ')}. ` +
              'All gray colors should be replaced with slate colors (Requirements 3.2.1).'
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length } // Run once for each file
    );
  });

  // Additional property: If slate colors exist, verify they're used consistently
  it('should use slate colors consistently when color classes are present', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          
          // Check if file uses any color classes
          const hasColorClasses = /\b(slate|gray)-\d+\b/.test(content);
          
          if (hasColorClasses) {
            // If color classes exist, they should be slate, not gray
            const hasGray = /\bgray-\d+\b/.test(content);
            const hasSlate = /\bslate-\d+\b/.test(content);
            
            // Property: If using colors, must use slate (not gray)
            return !hasGray && hasSlate;
          }
          
          // If no color classes, property trivially holds
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
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
describe('Property 5: No green colors are used, only cyan and indigo', () => {
  const componentsPath = join(__dirname, '..', 'components');
  const pagesPath = join(__dirname, '..', 'pages');

  // Get all .tsx files from components and pages directories
  // Exclude admin components as they are out of scope (Requirements 6.2)
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

  // Property: For any file in the codebase, no green-* color classes should exist
  it('should not contain green-* color classes in any component or page file', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Split content into lines to check each line
          const lines = content.split('\n');
          const violations: string[] = [];
          
          lines.forEach((line: string, index: number) => {
            // Skip comments (both single-line and multi-line comment markers)
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('//') || 
                trimmedLine.startsWith('*') || 
                trimmedLine.startsWith('/*')) {
              return;
            }
            
            // Pattern to match green-* color classes
            const greenColorPattern = /\bgreen-\d+\b/g;
            const matches = line.match(greenColorPattern);
            
            if (matches) {
              violations.push(`Line ${index + 1}: ${matches.join(', ')}`);
            }
          });
          
          // Property holds if no green colors are found
          if (violations.length > 0) {
            throw new Error(
              `Found green color classes in ${fileName}:\n${violations.join('\n')}\n` +
              'All green colors should be replaced with cyan/indigo colors (Requirements 3.2.2).'
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Gradients should use cyan-to-indigo pattern, not green
  it('should use cyan-to-indigo gradients instead of green gradients', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for gradient patterns
          const hasGradient = /from-\w+-\d+\s+to-\w+-\d+/.test(content);
          
          if (hasGradient) {
            // If gradients exist, they should not use green
            const hasGreenGradient = /from-green-\d+|to-green-\d+/.test(content);
            
            if (hasGreenGradient) {
              throw new Error(
                `Found green gradient in ${fileName}. ` +
                'All gradients should use cyan-to-indigo pattern (Requirements 3.2.2).'
              );
            }
            
            // If it's an accent gradient (not other colors), it should be cyan-indigo
            return true; // We already checked no green, which is the main requirement
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Hover states should use cyan, not green
  it('should use cyan hover states instead of green hover states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for hover state patterns
          const hasHoverStates = /hover:/.test(content);
          
          if (hasHoverStates) {
            // If hover states exist, they should not use green for accent colors
            const hasGreenHover = /hover:(text-green|bg-green|border-green)-\d+/.test(content);
            
            if (hasGreenHover) {
              throw new Error(
                `Found green hover state in ${fileName}. ` +
                'All accent hover states should use cyan (Requirements 3.2.2).'
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Accent colors should be cyan or indigo, not green
  it('should use cyan/indigo for accent colors, not green', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          
          // Check if file uses accent colors (text, bg, border with color)
          const accentColorPattern = /(text|bg|border)-(green|cyan|indigo)-\d+/g;
          const matches = content.match(accentColorPattern);
          
          if (matches) {
            // Filter out green accent colors
            const greenAccents = matches.filter((match: string) => match.includes('green'));
            
            // Property: No green accent colors should exist
            return greenAccents.length === 0;
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
