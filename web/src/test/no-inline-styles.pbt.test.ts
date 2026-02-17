import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 16: No inline styles in components
 * 
 * For any component file, there should be no style={{}} attributes or inline style strings.
 * 
 * **Validates: Requirements 3.8.1**
 * **Feature: design-system-overhaul, Property 16: No inline styles in components**
 */
describe('Property 16: No inline styles in components', () => {
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
   * Extract inline style attributes from content
   */
  const extractInlineStyles = (content: string): Array<{ style: string; line: number; context: string }> => {
    const lines = content.split('\n');
    const styles: Array<{ style: string; line: number; context: string }> = [];
    
    // Match style={{...}} or style="..." patterns
    const styleRegex = /style=(?:\{\{[^}]+\}\}|"[^"]+")/g;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(styleRegex);
      
      if (matches) {
        for (const match of matches) {
          styles.push({
            style: match,
            line: i + 1,
            context: line.trim().substring(0, 100),
          });
        }
      }
    }
    
    return styles;
  };

  /**
   * Check if an inline style is acceptable (e.g., for dynamic values)
   */
  const isAcceptableInlineStyle = (style: string, context: string): boolean => {
    // Allow inline styles for dynamic values that can't be expressed in Tailwind
    // Examples:
    // - Dynamic background images: style={{ backgroundImage: `url(${image})` }}
    // - Dynamic transforms: style={{ transform: `translateX(${x}px)` }}
    // - Dynamic opacity/colors from props
    
    // Check for dynamic background images
    if (/backgroundImage.*url\(/.test(style)) {
      return true;
    }
    
    // Check for dynamic transforms
    if (/transform.*translate|rotate|scale/.test(style)) {
      return true;
    }
    
    // Check for display: none (common for conditional rendering)
    if (/display:\s*['"]none['"]/.test(style)) {
      return true;
    }
    
    // Check for error handling (e.g., hiding broken images)
    if (/onError/.test(context) && /display/.test(style)) {
      return true;
    }
    
    return false;
  };

  // Property: No inline style attributes
  it('should not use inline style attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const styles = extractInlineStyles(content);
          
          for (const { style, line, context } of styles) {
            if (!isAcceptableInlineStyle(style, context)) {
              throw new Error(
                `Found inline style at line ${line} in ${fileName}: ${style}. ` +
                `Use Tailwind utility classes instead (Requirements 3.8.1)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No style={{}} with static values
  it('should not use style={{}} with static CSS values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for common static style patterns that should use Tailwind
          const staticStylePatterns = [
            { pattern: /style=\{\{[^}]*color:\s*['"][^'"]+['"]/g, message: 'Use Tailwind text-* or bg-* classes' },
            { pattern: /style=\{\{[^}]*padding:\s*['"][^'"]+['"]/g, message: 'Use Tailwind p-* classes' },
            { pattern: /style=\{\{[^}]*margin:\s*['"][^'"]+['"]/g, message: 'Use Tailwind m-* classes' },
            { pattern: /style=\{\{[^}]*width:\s*['"][^'"]+['"]/g, message: 'Use Tailwind w-* classes' },
            { pattern: /style=\{\{[^}]*height:\s*['"][^'"]+['"]/g, message: 'Use Tailwind h-* classes' },
            { pattern: /style=\{\{[^}]*fontSize:\s*['"][^'"]+['"]/g, message: 'Use Tailwind text-* classes' },
            { pattern: /style=\{\{[^}]*fontWeight:\s*['"][^'"]+['"]/g, message: 'Use Tailwind font-* classes' },
            { pattern: /style=\{\{[^}]*borderRadius:\s*['"][^'"]+['"]/g, message: 'Use Tailwind rounded-* classes' },
          ];
          
          for (const { pattern, message } of staticStylePatterns) {
            const matches = content.match(pattern);
            if (matches) {
              throw new Error(
                `Found static inline style in ${fileName}: ${matches[0]}. ${message} (Requirements 3.8.1)`
              );
            }
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No style="" string attributes
  it('should not use style="" string attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for style="..." patterns (string-based inline styles)
          const stringStyleRegex = /style="[^"]+"/g;
          const matches = content.match(stringStyleRegex);
          
          if (matches) {
            throw new Error(
              `Found string-based inline style in ${fileName}: ${matches[0]}. ` +
              `Use Tailwind utility classes instead (Requirements 3.8.1)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Prefer Tailwind classes over inline styles
  it('should prefer Tailwind utility classes over inline styles', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const styles = extractInlineStyles(content);
          
          // Count inline styles (excluding acceptable ones)
          const unacceptableStyles = styles.filter(
            ({ style, context }) => !isAcceptableInlineStyle(style, context)
          );
          
          if (unacceptableStyles.length > 0) {
            const examples = unacceptableStyles.slice(0, 2).map(
              ({ style, line }) => `${style} at line ${line}`
            ).join(', ');
            
            throw new Error(
              `Found ${unacceptableStyles.length} inline style(s) in ${fileName}: ${examples}. ` +
              `Use Tailwind utility classes for better maintainability (Requirements 3.8.1)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No <style> tags in components
  it('should not use <style> tags in component files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for <style> tags
          if (/<style[^>]*>/.test(content)) {
            throw new Error(
              `Found <style> tag in ${fileName}. ` +
              `Use Tailwind utility classes or CSS custom properties in index.css instead (Requirements 3.8.1)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: No styled-components or CSS-in-JS
  it('should not use styled-components or CSS-in-JS libraries', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for styled-components patterns
          if (/styled\.[a-z]+`/.test(content) || /styled\([^)]+\)`/.test(content)) {
            throw new Error(
              `Found styled-components usage in ${fileName}. ` +
              `Use Tailwind utility classes instead (Requirements 3.8.1)`
            );
          }
          
          // Check for emotion/CSS-in-JS patterns
          if (/css`/.test(content) || /css\([^)]+\)/.test(content)) {
            throw new Error(
              `Found CSS-in-JS usage in ${fileName}. ` +
              `Use Tailwind utility classes instead (Requirements 3.8.1)`
            );
          }
          
          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
