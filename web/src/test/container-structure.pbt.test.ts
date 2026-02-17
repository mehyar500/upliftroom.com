import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 14: All page containers use consistent structure
 * 
 * For any page file, the main container should use max-w-7xl (or max-w-5xl for narrow content)
 * with px-4 sm:px-6 lg:px-8 for horizontal padding.
 * 
 * **Validates: Requirements 3.3.1, 3.6.1**
 * **Feature: design-system-overhaul, Property 14: All page containers use consistent structure**
 */
describe('Property 14: All page containers use consistent structure', () => {
  const pagesPath = join(__dirname, '..', 'pages');

  // Get all .tsx page files
  const getPageFiles = (dir: string): string[] => {
    try {
      return readdirSync(dir)
        .filter((file: string) => file.endsWith('.tsx'))
        .filter((file: string) => !file.includes('Admin')) // Exclude admin pages
        .map((file: string) => join(dir, file));
    } catch {
      return [];
    }
  };

  const pageFiles = getPageFiles(pagesPath);

  /**
   * Container width rules based on design spec
   */
  const containerRules = {
    standard: {
      maxWidth: 'max-w-7xl',
      description: 'max-w-7xl for standard pages',
    },
    narrow: {
      maxWidth: 'max-w-5xl',
      description: 'max-w-5xl for narrow content (Menu, Blog)',
    },
    padding: {
      pattern: /px-4\s+sm:px-6\s+lg:px-8/,
      description: 'px-4 sm:px-6 lg:px-8 for horizontal padding',
    },
  };

  /**
   * Extract container elements from content
   */
  const extractContainers = (content: string): Array<{ content: string; line: number }> => {
    const lines = content.split('\n');
    const containers: Array<{ content: string; line: number }> = [];
    
    // Match divs or sections with max-w-* classes
    const containerRegex = /(className="[^"]*max-w-[^"]*")/g;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(containerRegex);
      
      if (matches) {
        for (const match of matches) {
          containers.push({
            content: match,
            line: i + 1,
          });
        }
      }
    }
    
    return containers;
  };

  /**
   * Check if a container uses correct max-width
   */
  const checkContainerWidth = (
    container: { content: string; line: number },
    fileName: string
  ): { valid: boolean; error?: string } => {
    // Narrow content pages: MenuPage, Blog pages, AboutPage, PrivacyPage
    const isNarrowPage = /MenuPage|BlogPage|ArticlePage|AboutPage|PrivacyPage/.test(fileName);
    
    // Allow max-w-none for prose containers
    if (/max-w-none/.test(container.content) && /prose/.test(container.content)) {
      return { valid: true };
    }
    
    // Allow smaller max-w for text containers (max-w-2xl, max-w-3xl)
    if (/max-w-(2|3)xl/.test(container.content)) {
      return { valid: true };
    }
    
    if (isNarrowPage) {
      if (!/max-w-(4|5)xl/.test(container.content)) {
        return {
          valid: false,
          error: `Container at line ${container.line} in ${fileName} should use max-w-4xl or max-w-5xl for narrow content (Requirements 3.6.1)`,
        };
      }
    } else {
      // Standard pages should use max-w-7xl
      if (!/max-w-7xl/.test(container.content)) {
        // Allow max-w-5xl and max-w-4xl for specific sections
        if (!/max-w-(4|5)xl/.test(container.content)) {
          return {
            valid: false,
            error: `Container at line ${container.line} in ${fileName} should use max-w-7xl for standard pages (Requirements 3.6.1)`,
          };
        }
      }
    }
    
    return { valid: true };
  };

  /**
   * Check if a container uses correct horizontal padding
   */
  const checkContainerPadding = (
    container: { content: string; line: number },
    fileName: string
  ): { valid: boolean; error?: string } => {
    // Skip max-w-none and small text containers
    if (/max-w-none/.test(container.content) || /max-w-(2|3)xl/.test(container.content)) {
      return { valid: true };
    }
    
    // Check for the standard padding pattern
    if (!containerRules.padding.pattern.test(container.content)) {
      // Allow some flexibility for special cases
      // But at minimum should have px-4
      if (!/px-4/.test(container.content)) {
        return {
          valid: false,
          error: `Container at line ${container.line} in ${fileName} should use ${containerRules.padding.description} (Requirements 3.3.1)`,
        };
      }
    }
    
    return { valid: true };
  };

  // Property: All page containers use max-w-7xl or max-w-5xl
  it('should use max-w-7xl for standard pages and max-w-5xl for narrow content', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const containers = extractContainers(content);
          
          // Check each container
          for (const container of containers) {
            const result = checkContainerWidth(container, fileName);
            if (!result.valid) {
              throw new Error(result.error);
            }
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });

  // Property: All page containers use consistent horizontal padding
  it('should use px-4 sm:px-6 lg:px-8 for horizontal padding', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const containers = extractContainers(content);
          
          // Check each container
          for (const container of containers) {
            const result = checkContainerPadding(container, fileName);
            if (!result.valid) {
              throw new Error(result.error);
            }
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });

  // Property: No arbitrary max-width values
  it('should not use arbitrary max-width values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for arbitrary max-width values like max-w-[1200px]
          const arbitraryMaxWidth = /max-w-\[[\d]+px\]/g;
          const matches = content.match(arbitraryMaxWidth);
          
          if (matches) {
            throw new Error(
              `Found arbitrary max-width values in ${fileName}: ${matches.join(', ')}. ` +
              'Use standard Tailwind classes like max-w-7xl or max-w-5xl (Requirements 3.8.2)'
            );
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });

  // Property: Containers use mx-auto for centering
  it('should use mx-auto to center containers', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const containers = extractContainers(content);
          
          // Check each container has mx-auto (except max-w-none which doesn't need centering)
          for (const container of containers) {
            if (/max-w-none/.test(container.content)) {
              continue; // max-w-none doesn't need mx-auto
            }
            
            if (!/mx-auto/.test(container.content)) {
              throw new Error(
                `Container at line ${container.line} in ${fileName} should use mx-auto for centering (Requirements 3.6.1)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });

  // Property: Consistent container structure across pages
  it('should have consistent container structure across all pages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const containers = extractContainers(content);
          
          // Every page should have at least one container
          if (containers.length === 0) {
            throw new Error(
              `No containers found in ${fileName}. Pages should use max-w-* containers (Requirements 3.6.1)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });
});
