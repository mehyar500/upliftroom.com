import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 11: All cards implement complete glassmorphism effect
 * 
 * For any card component, it should include all glassmorphism properties:
 * - backdrop-blur-lg
 * - semi-transparent background (bg-white/90 or bg-slate-900/80)
 * - border (border-slate-200 dark:border-slate-800)
 * - rounded-2xl
 * 
 * **Validates: Requirements 3.4.1, 3.4.2, 3.7.1, 3.7.2, 3.7.3**
 * **Feature: design-system-overhaul, Property 11: All cards implement complete glassmorphism effect**
 */
describe('Property 11: All cards implement complete glassmorphism effect', () => {
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
   * Helper function to identify card elements
   * Cards typically have:
   * - rounded-2xl or rounded-xl border radius
   * - border classes
   * - bg-white or bg-slate backgrounds
   * 
   * Excludes:
   * - Buttons (rounded-full)
   * - Navigation elements (<nav>, sticky top-0, z-50)
   */
  const isCardElement = (line: string): boolean => {
    // Exclude buttons (rounded-full is a strong indicator)
    if (/rounded-full/.test(line)) {
      return false;
    }
    
    // Exclude navigation bars and sticky elements
    if (/<nav|sticky\s+top-|z-50/.test(line)) {
      return false;
    }
    
    // Exclude if it's clearly a button or link with button styling
    if (/(to=|href=).*px-\d+\s+py-\d+/.test(line)) {
      return false;
    }
    
    const cardIndicators = [
      /rounded-(xl|2xl)/,
      /border\s+border-/,
      /bg-white|bg-slate-\d+/,
    ];
    
    // Must have at least 2 card indicators to be considered a card
    const matchCount = cardIndicators.filter(pattern => pattern.test(line)).length;
    return matchCount >= 2;
  };

  /**
   * Check if card has complete glassmorphism effect
   * Required properties:
   * - backdrop-blur-lg (or backdrop-blur)
   * - Semi-transparent background: bg-white/90, bg-white/80, bg-white/95, bg-slate-900/80, bg-slate-900/90
   *   OR gradient background (bg-gradient-to-br, bg-gradient-to-r, etc.)
   * - Border: border-slate-200 or border-slate-800 (with dark: variant) OR border-cyan-200 for gradient cards
   * - Rounded corners: rounded-2xl or rounded-xl
   */
  const hasGlassmorphism = (className: string): boolean => {
    const hasBackdropBlur = /backdrop-blur(-lg)?/.test(className);
    const hasSemiTransparentBg = /bg-(white|slate-\d+)\/(80|85|90|95)/.test(className);
    const hasGradientBg = /bg-gradient-to-(br|r|l|t|b|tr|tl|bl)/.test(className);
    const hasBorder = /border-(slate|cyan)-(200|800)/.test(className);
    const hasRoundedCorners = /rounded-(xl|2xl)/.test(className);
    
    // Either standard glassmorphism OR gradient background with border and rounded corners
    const hasValidBackground = hasSemiTransparentBg || hasGradientBg;
    
    return (hasBackdropBlur || hasGradientBg) && hasValidBackground && hasBorder && hasRoundedCorners;
  };

  // Property: All card elements have complete glassmorphism effect
  it('should have backdrop-blur, semi-transparent background, border, and rounded corners', () => {
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

            // Check if line contains a card element
            if (isCardElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check if card has complete glassmorphism
                if (!hasGlassmorphism(className)) {
                  const missingProperties: string[] = [];
                  
                  const hasBackdropBlur = /backdrop-blur(-lg)?/.test(className);
                  const hasSemiTransparentBg = /bg-(white|slate-\d+)\/(80|85|90|95)/.test(className);
                  const hasGradientBg = /bg-gradient-to-(br|r|l|t|b|tr|tl|bl)/.test(className);
                  const hasBorder = /border-(slate|cyan)-(200|800)/.test(className);
                  const hasRoundedCorners = /rounded-(xl|2xl)/.test(className);
                  
                  if (!hasBackdropBlur && !hasGradientBg) {
                    missingProperties.push('backdrop-blur-lg or gradient background');
                  }
                  if (!hasSemiTransparentBg && !hasGradientBg) {
                    missingProperties.push('semi-transparent background (bg-white/90 or bg-slate-900/80) or gradient');
                  }
                  if (!hasBorder) {
                    missingProperties.push('border-slate-200 dark:border-slate-800 or border-cyan-200');
                  }
                  if (!hasRoundedCorners) {
                    missingProperties.push('rounded-2xl');
                  }
                  
                  violations.push(
                    `Line ${index + 1}: Card missing glassmorphism properties\n` +
                    `  Missing: ${missingProperties.join(', ')}\n` +
                    `  Current classes: ${className.substring(0, 100)}${className.length > 100 ? '...' : ''}`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found cards without complete glassmorphism in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All cards must have backdrop-blur-lg, semi-transparent background, border, and rounded corners (Requirements 3.4.1, 3.4.2, 3.7.1, 3.7.2, 3.7.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Cards should use standard glassmorphism backgrounds
  it('should use bg-white/90 or bg-slate-900/80 for glassmorphism backgrounds', () => {
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

            // Check if line contains a card element with backdrop-blur
            if (isCardElement(line) && /backdrop-blur/.test(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check for non-standard glassmorphism backgrounds
                const hasSolidBg = /bg-(white|slate-\d+)\s/.test(className) && !/bg-(white|slate-\d+)\//.test(className);
                
                if (hasSolidBg) {
                  violations.push(
                    `Line ${index + 1}: Card with backdrop-blur uses solid background instead of semi-transparent\n` +
                    `  Expected: bg-white/90 or bg-slate-900/80\n` +
                    `  Found: solid background`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found cards with incorrect glassmorphism backgrounds in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'Cards with backdrop-blur should use semi-transparent backgrounds (Requirements 3.7.2).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });

  // Property: Cards should use rounded-2xl as standard
  it('should use rounded-2xl as the standard border radius for cards', () => {
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

            // Check if line contains a card element
            if (isCardElement(line)) {
              const classNameMatch = line.match(/className=["']([^"']+)["']/);
              
              if (classNameMatch) {
                const className = classNameMatch[1];
                
                // Check for rounded-xl instead of rounded-2xl
                if (/rounded-xl\b/.test(className) && !/rounded-2xl/.test(className)) {
                  violations.push(
                    `Line ${index + 1}: Card uses rounded-xl instead of rounded-2xl\n` +
                    `  Expected: rounded-2xl (standard for cards)\n` +
                    `  Found: rounded-xl`
                  );
                }
              }
            }
          });

          // Property holds if no violations are found
          if (violations.length > 0) {
            throw new Error(
              `Found cards with non-standard border radius in ${fileName}:\n` +
              violations.join('\n') + '\n' +
              'All cards should use rounded-2xl as the standard border radius (Requirements 3.4.3).'
            );
          }

          return true;
        }
      ),
      { numRuns: allFiles.length }
    );
  });
});
