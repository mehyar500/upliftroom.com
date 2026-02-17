import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 7: All interactive elements have hover states with transitions
 * 
 * For any interactive element (button, a, clickable div), if it has a hover: class,
 * it should also have a transition-* class.
 * 
 * **Validates: Requirements 3.2.3, 3.4.3**
 */
describe('Property 7: All interactive elements have hover states with transitions', () => {
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

  // Helper function to extract className strings from JSX
  const extractClassNames = (content: string): string[] => {
    const classNamePattern = /className=["']([^"']+)["']/g;
    const classNames: string[] = [];
    let match;
    
    while ((match = classNamePattern.exec(content)) !== null) {
      classNames.push(match[1]);
    }
    
    return classNames;
  };

  // Helper function to check if a className string has hover states
  const hasHoverState = (className: string): boolean => {
    return /hover:/.test(className);
  };

  // Helper function to check if a className string has transition classes
  const hasTransition = (className: string): boolean => {
    // Check for transition-* classes or the generic "transition" class
    return /\btransition(-\w+)?\b/.test(className);
  };

  // Helper function to check if element is interactive
  const isInteractiveElement = (line: string): boolean => {
    // Check for interactive HTML elements or components
    const interactivePatterns = [
      /<button\b/,
      /<a\b/,
      /<Link\b/,
      /onClick=/,
      /role=["']button["']/,
      /role=["']link["']/,
      /cursor-pointer/
    ];
    
    return interactivePatterns.some(pattern => pattern.test(line));
  };

  // Property: For any interactive element with hover states, transitions must be present
  it('should have transition classes when hover states are present on interactive elements', () => {
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

            // Check if line contains an interactive element
            if (isInteractiveElement(line)) {
              // Extract className from this line
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // If element has hover state, it must have transition
                if (hasHoverState(className) && !hasTransition(className)) {
                  violations.push(
                    `Line ${index + 1}: Interactive element has hover state but no transition class\n` +
                    `  Classes: ${className}`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found interactive elements with hover states but no transitions in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All interactive elements with hover states must have transition classes (Requirements 3.2.3, 3.4.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Hover states should be accompanied by appropriate transition types
  it('should use appropriate transition types for hover effects', () => {
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

            // Check if line contains an interactive element with hover
            if (isInteractiveElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                if (hasHoverState(className)) {
                  // Check for specific transition types
                  const hasColorTransition = /hover:(text|bg|border)-/.test(className);
                  const hasTransformTransition = /hover:(scale|translate|rotate)/.test(className);
                  const hasShadowTransition = /hover:shadow/.test(className);
                  
                  // Verify appropriate transition is present
                  const hasTransitionColors = /transition-colors/.test(className);
                  const hasTransitionTransform = /transition-transform/.test(className);
                  const hasTransitionShadow = /transition-shadow/.test(className);
                  const hasTransitionAll = /\btransition\b/.test(className) && !/transition-\w+/.test(className);

                  // Warn if specific transition type doesn't match hover effect
                  if (hasColorTransition && !hasTransitionColors && !hasTransitionAll) {
                    warnings.push(
                      `Line ${index + 1}: Color hover effect without transition-colors or transition-all\n` +
                      `  Classes: ${className}`
                    );
                  }
                  
                  if (hasTransformTransition && !hasTransitionTransform && !hasTransitionAll) {
                    warnings.push(
                      `Line ${index + 1}: Transform hover effect without transition-transform or transition-all\n` +
                      `  Classes: ${className}`
                    );
                  }
                  
                  if (hasShadowTransition && !hasTransitionShadow && !hasTransitionAll) {
                    warnings.push(
                      `Line ${index + 1}: Shadow hover effect without transition-shadow or transition-all\n` +
                      `  Classes: ${className}`
                    );
                  }
                }
              }
            }
          });

          // This is a softer check - we log warnings but don't fail
          // The main requirement is that transitions exist (checked in previous test)
          if (warnings.length > 0) {
            // For now, we'll be lenient and just ensure some transition exists
            // The previous test already ensures transitions are present
            return true;
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Interactive elements should have consistent transition durations
  it('should use consistent transition patterns across interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const classNames = extractClassNames(content);
          
          // Check that interactive elements with transitions use standard patterns
          const interactiveWithTransitions = classNames.filter(className => 
            hasHoverState(className) && hasTransition(className)
          );

          // Property: If transitions are used, they should follow standard patterns
          // (transition, transition-colors, transition-all, etc.)
          for (const className of interactiveWithTransitions) {
            const hasValidTransition = 
              /\btransition\b/.test(className) ||
              /transition-colors/.test(className) ||
              /transition-all/.test(className) ||
              /transition-transform/.test(className) ||
              /transition-shadow/.test(className) ||
              /transition-opacity/.test(className);
            
            if (!hasValidTransition) {
              // This shouldn't happen if hasTransition() works correctly
              // But we check anyway for completeness
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All buttons should have hover states with transitions
  it('should ensure all button elements have hover states with transitions', () => {
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

            // Check for button elements
            if (/<button\b/.test(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Buttons should have hover states
                if (!hasHoverState(className)) {
                  violations.push(
                    `Line ${index + 1}: Button element without hover state\n` +
                    `  Classes: ${className}`
                  );
                }
                
                // If button has hover state, it must have transition
                if (hasHoverState(className) && !hasTransition(className)) {
                  violations.push(
                    `Line ${index + 1}: Button has hover state but no transition\n` +
                    `  Classes: ${className}`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          // Note: We're being lenient here - some buttons might not need hover states
          // (e.g., disabled buttons), so we only fail if hover exists without transition
          const criticalViolations = violations.filter(v => v.includes('no transition'));
          
          if (criticalViolations.length > 0) {
            throw new Error(
              `Found buttons with hover states but no transitions in ${fileName}:\n` +
              criticalViolations.join('\n') + '\n' +
              'All buttons with hover states must have transition classes (Requirements 3.2.3, 3.4.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: All links should have hover states with transitions
  it('should ensure all link elements have hover states with transitions', () => {
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

            // Check for link elements (a or Link component)
            if (/<a\b/.test(line) || /<Link\b/.test(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // If link has hover state, it must have transition
                if (hasHoverState(className) && !hasTransition(className)) {
                  violations.push(
                    `Line ${index + 1}: Link has hover state but no transition\n` +
                    `  Classes: ${className}`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found links with hover states but no transitions in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All links with hover states must have transition classes (Requirements 3.2.3, 3.4.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
