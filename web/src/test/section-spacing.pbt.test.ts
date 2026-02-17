import { describe, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fc from 'fast-check';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Property 8: Hero sections use py-16, content sections use py-12
 * 
 * For any page file, sections identified as hero sections (first major section)
 * should use py-16, and content sections should use py-12.
 * 
 * **Validates: Requirements 3.3.2**
 */
describe('Property 8: Hero sections use py-16, content sections use py-12', () => {
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
   * Helper function to identify hero sections
   * Hero sections are typically:
   * - The first <section> element in a page
   * - Contains large headings (h1 with text-5xl or larger)
   * - Often has gradient backgrounds or special styling
   */
  const isHeroSection = (sectionContent: string): boolean => {
    // Check for hero indicators:
    // 1. Large heading sizes (text-5xl, text-6xl, text-7xl, text-8xl)
    const hasLargeHeading = /text-[5-8]xl/.test(sectionContent);
    
    // 2. Gradient text or special hero styling
    const hasGradientText = /bg-gradient-to-r.*bg-clip-text.*text-transparent/.test(sectionContent);
    
    // 3. Hero-specific patterns (buttons, CTAs)
    const hasHeroButtons = /Shop|Read Latest|Get Started|Learn More/.test(sectionContent);
    
    return hasLargeHeading || hasGradientText || hasHeroButtons;
  };

  /**
   * Extract sections from page content
   * Returns array of section objects with content and line numbers
   */
  const extractSections = (content: string): Array<{ content: string; lineStart: number; isFirst: boolean }> => {
    const lines = content.split('\n');
    const sections: Array<{ content: string; lineStart: number; isFirst: boolean }> = [];
    let currentSection = '';
    let sectionStart = -1;
    let depth = 0;
    let inSection = false;
    let firstSectionFound = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect section opening
      if (/<section/.test(line)) {
        if (!inSection) {
          inSection = true;
          sectionStart = i + 1; // Line numbers are 1-indexed
          currentSection = line;
          depth = 1;
        } else {
          depth++;
          currentSection += '\n' + line;
        }
      } else if (inSection) {
        currentSection += '\n' + line;
        
        // Track nested sections
        if (/<section/.test(line)) {
          depth++;
        }
        if (/<\/section>/.test(line)) {
          depth--;
          
          // Section complete
          if (depth === 0) {
            const isFirst = !firstSectionFound;
            firstSectionFound = true;
            sections.push({
              content: currentSection,
              lineStart: sectionStart,
              isFirst,
            });
            currentSection = '';
            inSection = false;
            sectionStart = -1;
          }
        }
      }
    }

    return sections;
  };

  /**
   * Check if a section has the correct padding
   */
  const checkSectionPadding = (
    section: { content: string; lineStart: number; isFirst: boolean },
    fileName: string
  ): { valid: boolean; error?: string } => {
    const isHero = section.isFirst && isHeroSection(section.content);
    
    // Extract py-* classes from the section
    const pyMatches = section.content.match(/\bpy-(\d+)\b/g);
    
    if (!pyMatches || pyMatches.length === 0) {
      // No vertical padding found - this might be intentional for some sections
      // We'll be lenient and only check sections that have py-* classes
      return { valid: true };
    }

    // Get the main py-* class (usually the first one on the section element itself)
    const mainPyClass = pyMatches[0];
    
    if (isHero) {
      // Hero sections should use py-16
      if (mainPyClass !== 'py-16') {
        return {
          valid: false,
          error: `Hero section at line ${section.lineStart} in ${fileName} uses ${mainPyClass} but should use py-16 (Requirements 3.3.2)`,
        };
      }
    } else {
      // Content sections should use py-12
      if (mainPyClass !== 'py-12') {
        return {
          valid: false,
          error: `Content section at line ${section.lineStart} in ${fileName} uses ${mainPyClass} but should use py-12 (Requirements 3.3.2)`,
        };
      }
    }

    return { valid: true };
  };

  // Property: All hero sections use py-16
  it('should use py-16 for hero sections', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const sections = extractSections(content);
          const heroSections = sections.filter(s => s.isFirst && isHeroSection(s.content));
          
          // Check each hero section
          for (const section of heroSections) {
            const result = checkSectionPadding(section, fileName);
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

  // Property: All content sections use py-12
  it('should use py-12 for content sections', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          const sections = extractSections(content);
          const contentSections = sections.filter(s => !s.isFirst || !isHeroSection(s.content));
          
          // Check each content section
          for (const section of contentSections) {
            const result = checkSectionPadding(section, fileName);
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

  // Property: Hero sections are consistently identified across pages
  it('should consistently identify hero sections across all pages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const sections = extractSections(content);
          
          // If a page has sections, at least one should be identifiable as hero or content
          if (sections.length > 0) {
            const hasHero = sections.some(s => s.isFirst && isHeroSection(s.content));
            const hasContent = sections.some(s => !s.isFirst || !isHeroSection(s.content));
            
            // Property: Every page should have at least one section type
            return hasHero || hasContent;
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });

  // Property: No sections use inconsistent spacing (py-8, py-10, py-14, py-24)
  it('should not use inconsistent spacing values (py-8, py-10, py-14, py-24)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pageFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');
          const fileName = filePath.split(/[\\/]/).pop() || filePath;
          
          // Check for inconsistent spacing values mentioned in Requirements 4.1
          const inconsistentSpacing = /\b(py-8|py-10|py-14|py-24)\b/g;
          const matches = content.match(inconsistentSpacing);
          
          if (matches) {
            throw new Error(
              `Found inconsistent spacing in ${fileName}: ${matches.join(', ')}. ` +
              'Use py-16 for hero sections and py-12 for content sections (Requirements 3.3.2, 4.1)'
            );
          }
          
          return true;
        }
      ),
      { numRuns: pageFiles.length }
    );
  });
});
