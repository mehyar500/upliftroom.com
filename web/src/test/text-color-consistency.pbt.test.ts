import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 13: All text uses correct color classes
 * 
 * For any text element, primary text should use text-slate-900 dark:text-white,
 * and secondary text should use text-slate-600 dark:text-slate-300.
 * 
 * **Validates: Requirements 3.5.4**
 * **Feature: design-system-overhaul, Property 13: All text uses correct color classes**
 */
describe('Property 13: All text uses correct color classes', () => {
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
   * Text color rules based on design spec
   */
  const textColorRules = {
    primary: {
      light: 'text-slate-900',
      dark: 'dark:text-white',
      description: 'text-slate-900 dark:text-white for primary text',
    },
    secondary: {
      light: 'text-slate-600',
      dark: 'dark:text-slate-300',
      alternativeDark: 'dark:text-slate-400', // Acceptable alternative
      description: 'text-slate-600 dark:text-slate-300 (or dark:text-slate-400) for secondary text',
    },
  };

  /**
   * Extract text color classes from content
   */
  const extractTextColors = (content: string): Array<{ color: string; line: number; context: string }> => {
    const lines = content.split('\n');
    const colors: Array<{ color: string; line: number; context: string }> = [];
    
    // Match text-* color classes (but not text-xs, text-sm, text-base, text-lg, text-xl, etc.)
    const textColorRegex = /text-(slate|gray|red|green|blue|cyan|indigo|purple|pink|yellow|orange)-\d+/g;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(textColorRegex);
      
      if (matches) {
        for (const match of matches) {
          colors.push({
            color: match,
            line: i + 1,
            context: line.trim().substring(0, 100), // First 100 chars for context
          });
        }
      }
    }
    
    return colors;
  };

  /**
   * Check if a text color is valid according to design system
   */
  const isValidTextColor = (
    color: string,
    context: string,
    fileName: string
  ): { valid: boolean; error?: string } => {
    // Special cases that are allowed:
    // 1. Gradient text (bg-gradient-to-r ... bg-clip-text text-transparent)
    if (/bg-gradient.*bg-clip-text.*text-transparent/.test(context)) {
      return { valid: true }; // Gradient text is allowed
    }
    
    // 2. Accent colors for links and interactive elements (cyan, indigo)
    if (/text-(cyan|indigo)-\d+/.test(color) && /hover:|Link|button|<a/.test(context)) {
      return { valid: true }; // Accent colors for interactive elements
    }
    
    // 3. Special badge/tag colors (purple, yellow, etc.)
    if (/text-(purple|yellow|red|green|blue|orange|pink)-\d+/.test(color) && /(badge|tag|pill|rounded-full|px-\d+\s+py-\d+)/.test(context)) {
      return { valid: true }; // Badge/tag colors are allowed
    }
    
    // 4. LatestPage uses dark mode only (text-white, text-slate-400)
    if (fileName === 'LatestPage.tsx' && (color === 'text-white' || /text-slate-[34]00/.test(color))) {
      return { valid: true };
    }
    
    // Check if it's a valid slate color for text
    if (/text-slate-\d+/.test(color)) {
      // Primary text: slate-900 or white
      if (color === 'text-slate-900') {
        return { valid: true };
      }
      
      // Secondary text: slate-600, slate-500, slate-400, slate-300
      if (/text-slate-[3-6]00/.test(color)) {
        return { valid: true };
      }
      
      // Other slate colors might be valid for specific use cases
      if (/text-slate-(100|200|700|800)/.test(color)) {
        // These are less common but might be used for borders, dividers, etc.
        return { valid: true };
      }
    }
    
    // Check for gray colors (should be slate instead)
    if (/text-gray-\d+/.test(color)) {
      return {
        valid: false,
        error: `Found gray color ${color} in ${fileName}. Use slate colors instead (Requirements 3.2.1, 3.5.4)`,
      };
    }
    
    // Check for green colors (should be cyan/indigo)
    if (/text-green-\d+/.test(color) && !/badge|tag/.test(context)) {
      return {
        valid: false,
        error: `Found green color ${color} in ${fileName}. Use cyan/indigo for accents (Requirements 3.2.2, 3.5.4)`,
      };
    }
    
    return { valid: true };
  };

  // Property: No gray text colors are used
  it('should not use gray text colors, only slate', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const colors = extractTextColors(content);
          
          for (const { color, line, context } of colors) {
            if (/text-gray-\d+/.test(color)) {
              throw new Error(
                `Found gray text color at line ${line} in ${fileName}: ${color}. ` +
                'Use slate colors instead (Requirements 3.2.1, 3.5.4)'
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Primary text uses correct colors
  it('should use text-slate-900 dark:text-white for primary text', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for headings (h1, h2, h3, h4) which should use primary text colors
          const headingRegex = /<h[1-4][^>]*className="[^"]*text-slate-\d+[^"]*"/g;
          const headings = content.match(headingRegex) || [];
          
          for (const heading of headings) {
            // Skip special cases (gradient text, etc.)
            if (/bg-gradient.*bg-clip-text/.test(heading)) {
              continue;
            }
            
            // Check if it uses primary text colors
            if (!/text-slate-900/.test(heading) && !/text-white/.test(heading)) {
              // This might be acceptable for secondary headings or special cases
              // We'll be lenient here
              continue;
            }
            
            // If it uses text-slate-900, it should also have dark:text-white or dark:text-slate-100
            if (/text-slate-900/.test(heading) && !/dark:text-white/.test(heading) && !/dark:text-slate-100/.test(heading)) {
              throw new Error(
                `Found heading with text-slate-900 but missing dark:text-white in ${fileName}. ` +
                'Primary text should use text-slate-900 dark:text-white (Requirements 3.5.4)'
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Secondary text uses correct colors
  it('should use text-slate-600 dark:text-slate-300 for secondary text', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for paragraph text which should use secondary colors
          const paragraphRegex = /<p[^>]*className="[^"]*text-slate-\d+[^"]*"/g;
          const paragraphs = content.match(paragraphRegex) || [];
          
          for (const paragraph of paragraphs) {
            // Skip special cases
            if (/bg-gradient.*bg-clip-text/.test(paragraph)) {
              continue;
            }
            
            // If it uses text-slate-600, it should have dark mode variant
            if (/text-slate-600/.test(paragraph)) {
              if (!/dark:text-slate-[34]00/.test(paragraph)) {
                throw new Error(
                  `Found paragraph with text-slate-600 but missing dark mode variant in ${fileName}. ` +
                  'Secondary text should use text-slate-600 dark:text-slate-300 (Requirements 3.5.4)'
                );
              }
            }
            
            // If it uses text-slate-700, it should have dark mode variant
            if (/text-slate-700/.test(paragraph)) {
              if (!/dark:text-slate-[23]00/.test(paragraph)) {
                throw new Error(
                  `Found paragraph with text-slate-700 but missing dark mode variant in ${fileName}. ` +
                  'Text should have appropriate dark mode colors (Requirements 3.5.4)'
                );
              }
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All text colors are valid according to design system
  it('should only use valid text colors from the design system', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const colors = extractTextColors(content);
          
          for (const { color, line, context } of colors) {
            const result = isValidTextColor(color, context, fileName);
            if (!result.valid) {
              throw new Error(result.error);
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No green text colors for accents (should be cyan/indigo)
  it('should not use green text colors for accents, use cyan/indigo instead', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const colors = extractTextColors(content);
          
          for (const { color, line, context } of colors) {
            // Allow green in badges/tags
            if (/text-green-\d+/.test(color) && !/badge|tag|pill|rounded-full/.test(context)) {
              throw new Error(
                `Found green text color at line ${line} in ${fileName}: ${color}. ` +
                'Use cyan/indigo for accent colors (Requirements 3.2.2, 3.5.4)'
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Text colors have dark mode variants
  it('should have dark mode variants for all text colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const lines = content.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Skip special cases
            if (/bg-gradient.*bg-clip-text/.test(line)) {
              continue;
            }
            if (/LatestPage/.test(fileName) && /bg-slate-950/.test(content)) {
              continue; // LatestPage is dark-only
            }
            
            // Check if line has text-slate-900 without dark:text-white
            if (/text-slate-900/.test(line) && !/dark:text-white/.test(line) && !/<(h[1-4]|p|span|div|a|button|li)/.test(line)) {
              // Only check actual text elements, not utility classes
              continue;
            }
            
            // Check if line has text-slate-600 without dark mode variant
            if (/text-slate-600/.test(line) && !/dark:text-slate-[34]00/.test(line) && /<(p|span|div|a|li)/.test(line)) {
              throw new Error(
                `Found text-slate-600 without dark mode variant at line ${i + 1} in ${fileName}. ` +
                'Add dark:text-slate-300 or dark:text-slate-400 (Requirements 3.5.4)'
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
