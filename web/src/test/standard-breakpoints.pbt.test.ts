import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 15: All pages use standard responsive breakpoints
 * 
 * For any component file, responsive classes should only use Tailwind's standard breakpoints
 * (sm:, md:, lg:, xl:, 2xl:), with no arbitrary breakpoint values.
 * 
 * **Validates: Requirements 3.6.3**
 * **Feature: design-system-overhaul, Property 15: All pages use standard responsive breakpoints**
 */
describe('Property 15: All pages use standard responsive breakpoints', () => {
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
   * Standard Tailwind breakpoints
   */
  const standardBreakpoints = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];

  /**
   * Extract all responsive class prefixes from content
   */
  const extractBreakpoints = (content: string): Array<{ breakpoint: string; line: number; context: string }> => {
    const lines = content.split('\n');
    const breakpoints: Array<{ breakpoint: string; line: number; context: string }> = [];
    
    // Match any breakpoint pattern (standard or arbitrary)
    // Standard: sm:, md:, lg:, xl:, 2xl:
    // Arbitrary: min-[640px]:, max-[768px]:, etc.
    const breakpointRegex = /((?:min|max)-\[[^\]]+\]:|(?:sm|md|lg|xl|2xl):)/g;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(breakpointRegex);
      
      if (matches) {
        for (const match of matches) {
          breakpoints.push({
            breakpoint: match,
            line: i + 1,
            context: line.trim().substring(0, 100),
          });
        }
      }
    }
    
    return breakpoints;
  };

  /**
   * Check if a breakpoint is a standard Tailwind breakpoint
   */
  const isStandardBreakpoint = (breakpoint: string): boolean => {
    return standardBreakpoints.includes(breakpoint);
  };

  // Property: No arbitrary breakpoint values
  it('should not use arbitrary breakpoint values like min-[640px]: or max-[768px]:', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const breakpoints = extractBreakpoints(content);
          
          for (const { breakpoint, line, context } of breakpoints) {
            if (!isStandardBreakpoint(breakpoint)) {
              throw new Error(
                `Found arbitrary breakpoint "${breakpoint}" at line ${line} in ${fileName}. ` +
                `Use standard Tailwind breakpoints (sm:, md:, lg:, xl:, 2xl:) instead (Requirements 3.6.3)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All responsive classes use standard breakpoints
  it('should only use standard Tailwind breakpoints (sm:, md:, lg:, xl:, 2xl:)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const breakpoints = extractBreakpoints(content);
          
          // Check that all breakpoints are standard
          const nonStandardBreakpoints = breakpoints.filter(
            ({ breakpoint }) => !isStandardBreakpoint(breakpoint)
          );
          
          if (nonStandardBreakpoints.length > 0) {
            const examples = nonStandardBreakpoints.slice(0, 3).map(
              ({ breakpoint, line }) => `${breakpoint} at line ${line}`
            ).join(', ');
            
            throw new Error(
              `Found ${nonStandardBreakpoints.length} non-standard breakpoint(s) in ${fileName}: ${examples}. ` +
              `Use standard Tailwind breakpoints only (Requirements 3.6.3)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Breakpoints are used consistently across files
  it('should use breakpoints consistently across all files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const breakpoints = extractBreakpoints(content);
          
          // If file uses breakpoints, they should all be standard
          if (breakpoints.length > 0) {
            const allStandard = breakpoints.every(({ breakpoint }) => 
              isStandardBreakpoint(breakpoint)
            );
            
            if (!allStandard) {
              throw new Error(
                `${fileName} mixes standard and non-standard breakpoints. ` +
                `Use only standard Tailwind breakpoints (Requirements 3.6.3)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Mobile-first approach (sm: before md: before lg:)
  it('should follow mobile-first approach with breakpoints in order', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const lines = content.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if line has multiple breakpoints
            const breakpointMatches = line.match(/(sm:|md:|lg:|xl:|2xl:)/g);
            
            if (breakpointMatches && breakpointMatches.length > 1) {
              // Verify they appear in order
              const breakpointOrder = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
              const indices = breakpointMatches.map(bp => breakpointOrder.indexOf(bp));
              
              // Check if indices are in ascending order
              for (let j = 1; j < indices.length; j++) {
                if (indices[j] < indices[j - 1]) {
                  throw new Error(
                    `Breakpoints out of order at line ${i + 1} in ${fileName}. ` +
                    `Use mobile-first approach: sm: before md: before lg: before xl: before 2xl: (Requirements 3.6.3)`
                  );
                }
              }
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No screen() function usage
  it('should not use screen() function for custom breakpoints', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for screen() function usage
          if (/screen\(/.test(content)) {
            throw new Error(
              `Found screen() function usage in ${fileName}. ` +
              `Use standard Tailwind breakpoints instead (Requirements 3.6.3)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
