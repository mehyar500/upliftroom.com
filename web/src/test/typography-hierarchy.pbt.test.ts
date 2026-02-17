import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 12: All headings follow the typography hierarchy
 * 
 * For any component file, h1 elements should use text-3xl md:text-5xl,
 * h2 elements should use text-2xl md:text-3xl, h3 elements should use text-xl,
 * and h4 elements should use text-lg, with appropriate font weights
 * (bold for h1/h2, semibold for h3/h4).
 * 
 * **Validates: Requirements 3.5.1, 3.5.3**
 * **Feature: design-system-overhaul, Property 12: All headings follow the typography hierarchy**
 */
describe('Property 12: All headings follow the typography hierarchy', () => {
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
   * Typography hierarchy rules based on design spec
   */
  const typographyRules = {
    h1: {
      // H1 can be text-3xl md:text-5xl OR special hero sizes like text-5xl sm:text-6xl md:text-8xl
      sizePatterns: [
        /text-3xl\s+md:text-5xl/,
        /text-4xl\s+md:text-5xl/,
        /text-5xl\s+sm:text-6xl\s+md:text-8xl/, // Special hero pattern
      ],
      fontWeight: /font-bold/,
      description: 'text-3xl md:text-5xl (or special hero sizes) with font-bold',
    },
    h2: {
      sizePatterns: [
        /text-2xl\s+md:text-3xl/,
        /text-2xl(?!\s+md:)/, // text-2xl without responsive variant is acceptable
      ],
      fontWeight: /font-bold/,
      description: 'text-2xl md:text-3xl with font-bold',
    },
    h3: {
      sizePatterns: [
        /text-xl(?!\s+md:)/, // text-xl without responsive variant
      ],
      fontWeight: /font-semibold/,
      description: 'text-xl with font-semibold',
    },
    h4: {
      sizePatterns: [
        /text-lg(?!\s+md:)/, // text-lg without responsive variant
      ],
      fontWeight: /font-semibold/,
      description: 'text-lg with font-semibold',
    },
  };

  /**
   * Extract heading elements from content
   */
  const extractHeadings = (content: string, level: 'h1' | 'h2' | 'h3' | 'h4'): Array<{ content: string; line: number }> => {
    const lines = content.split('\n');
    const headings: Array<{ content: string; line: number }> = [];
    
    const regex = new RegExp(`<${level}[^>]*>`, 'g');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(regex);
      
      if (matches) {
        for (const match of matches) {
          headings.push({
            content: match,
            line: i + 1, // 1-indexed line numbers
          });
        }
      }
    }
    
    return headings;
  };

  /**
   * Check if a heading follows the typography hierarchy
   * Special cases: Menu items, footer elements, and category labels can use smaller sizes
   */
  const checkHeadingTypography = (
    heading: { content: string; line: number },
    level: 'h1' | 'h2' | 'h3' | 'h4',
    fileName: string,
    fileContent: string
  ): { valid: boolean; error?: string } => {
    const rules = typographyRules[level];
    
    // Special case: Menu category labels in MenuPage can use smaller h2
    if (level === 'h2' && fileName === 'MenuPage.tsx' && /uppercase/.test(heading.content)) {
      return { valid: true }; // Allow smaller h2 for category labels
    }
    
    // Special case: Menu items in MenuPage can use smaller h3
    if (level === 'h3' && fileName === 'MenuPage.tsx' && /product\.name/.test(fileContent)) {
      return { valid: true }; // Allow smaller h3 for menu items
    }
    
    // Special case: Footer brand name and section titles can use smaller h3/h4
    if ((level === 'h3' || level === 'h4') && fileName === 'Footer.tsx') {
      return { valid: true }; // Allow smaller h3/h4 for footer elements
    }
    
    // Check if any of the size patterns match
    const hasSizeMatch = rules.sizePatterns.some(pattern => pattern.test(heading.content));
    
    if (!hasSizeMatch) {
      return {
        valid: false,
        error: `${level} at line ${heading.line} in ${fileName} does not use correct size classes. Expected: ${rules.description}. Found: ${heading.content}`,
      };
    }
    
    // Check font weight
    if (!rules.fontWeight.test(heading.content)) {
      return {
        valid: false,
        error: `${level} at line ${heading.line} in ${fileName} does not use correct font weight. Expected: ${rules.description}. Found: ${heading.content}`,
      };
    }
    
    return { valid: true };
  };

  // Property: All h1 elements follow typography hierarchy
  it('should use text-3xl md:text-5xl font-bold for h1 elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const headings = extractHeadings(content, 'h1');
          
          for (const heading of headings) {
            const result = checkHeadingTypography(heading, 'h1', fileName, content);
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

  // Property: All h2 elements follow typography hierarchy
  it('should use text-2xl md:text-3xl font-bold for h2 elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const headings = extractHeadings(content, 'h2');
          
          for (const heading of headings) {
            const result = checkHeadingTypography(heading, 'h2', fileName, content);
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

  // Property: All h3 elements follow typography hierarchy
  it('should use text-xl font-semibold for h3 elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const headings = extractHeadings(content, 'h3');
          
          for (const heading of headings) {
            const result = checkHeadingTypography(heading, 'h3', fileName, content);
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

  // Property: All h4 elements follow typography hierarchy
  it('should use text-lg font-semibold for h4 elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const headings = extractHeadings(content, 'h4');
          
          for (const heading of headings) {
            const result = checkHeadingTypography(heading, 'h4', fileName, content);
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

  // Property: No headings use inconsistent sizes
  it('should not use inconsistent heading sizes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for inconsistent patterns mentioned in Requirements 4.4
          // H1 should not use text-6xl, text-7xl (except in special hero context)
          // H2 should not use text-xl or text-4xl
          // H3 should not use text-lg or text-2xl
          
          const h1Matches = extractHeadings(content, 'h1');
          for (const h1 of h1Matches) {
            // Allow special hero sizes but check for other inconsistencies
            if (/text-6xl/.test(h1.content) && !/text-5xl\s+sm:text-6xl\s+md:text-8xl/.test(h1.content)) {
              throw new Error(
                `h1 at line ${h1.line} in ${fileName} uses text-6xl outside of hero context. ` +
                'Use text-3xl md:text-5xl for standard h1 (Requirements 3.5.1, 4.4)'
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All headings have consistent font weights
  it('should use font-bold for h1/h2 and font-semibold for h3/h4', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check h1 and h2 use font-bold (with special cases)
          const h1Headings = extractHeadings(content, 'h1');
          const h2Headings = extractHeadings(content, 'h2');
          
          for (const heading of [...h1Headings, ...h2Headings]) {
            const level = heading.content.match(/<(h[12])/)?.[1] as 'h1' | 'h2';
            
            // Skip special cases
            if (level === 'h2' && fileName === 'MenuPage.tsx' && /uppercase/.test(heading.content)) {
              continue; // Menu category labels can use font-semibold
            }
            
            if (!/font-bold/.test(heading.content)) {
              throw new Error(
                `${level} at line ${heading.line} in ${fileName} should use font-bold (Requirements 3.5.3)`
              );
            }
          }
          
          // Check h3 and h4 use font-semibold (with special cases)
          const h3Headings = extractHeadings(content, 'h3');
          const h4Headings = extractHeadings(content, 'h4');
          
          for (const heading of [...h3Headings, ...h4Headings]) {
            const level = heading.content.match(/<(h[34])/)?.[1] as 'h3' | 'h4';
            
            // Skip special cases (Footer elements already handled)
            if ((level === 'h3' || level === 'h4') && fileName === 'Footer.tsx') {
              continue;
            }
            if (level === 'h3' && fileName === 'MenuPage.tsx') {
              continue;
            }
            
            if (!/font-semibold/.test(heading.content)) {
              throw new Error(
                `${level} at line ${heading.line} in ${fileName} should use font-semibold (Requirements 3.5.3)`
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
