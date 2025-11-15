/**
 * PhraseBank Parser Utility
 * Extracts structured data from the Manchester Academic PhraseBank markdown content
 */

export interface PhraseSubcategory {
  title: string;
  phrases: string[];
}

export interface PhraseCategory {
  title: string;
  description?: string;
  subcategories: PhraseSubcategory[];
}

export interface PhraseBankData {
  categories: PhraseCategory[];
}

/**
 * Parse the PhraseBank markdown content into structured data
 */
export function parsePhraseBankMarkdown(content: string): PhraseBankData {
  const lines = content.split('\n');
  const categories: PhraseCategory[] = [];
  
  let currentCategory: PhraseCategory | null = null;
  let currentSubcategory: PhraseSubcategory | null = null;
  let inCategory = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and metadata
    if (!line || line.startsWith('#### Contact') || line.startsWith('#### Find') || 
        line.startsWith('#### Connect') || line.startsWith('Source:') || 
        line.startsWith('Total pages') || line.startsWith('===') ||
        line.startsWith('---') || line.startsWith('[') || line.startsWith('![') ||
        line.startsWith('>') || line.startsWith('*') || line.startsWith('An enhanced')) {
      continue;
    }
    
    // Main category (starts with # followed by text, not URL)
    if (line.startsWith('# ') && !line.startsWith('# http')) {
      // Save previous category if exists
      if (currentCategory && currentSubcategory) {
        currentCategory.subcategories.push(currentSubcategory);
        currentSubcategory = null;
      }
      if (currentCategory) {
        categories.push(currentCategory);
      }
      
      const categoryTitle = line.replace(/^#+\s*/, '').trim();
      // Skip if it's just "Home page" or similar
      if (categoryTitle.toLowerCase().includes('home page') || 
          categoryTitle.toLowerCase().includes('about') ||
          categoryTitle.toLowerCase().includes('accessibility')) {
        currentCategory = null;
        inCategory = false;
        continue;
      }
      
      currentCategory = {
        title: categoryTitle,
        subcategories: []
      };
      inCategory = true;
      continue;
    }
    
    // Subcategory (starts with #####)
    if (line.startsWith('##### ')) {
      // Save previous subcategory if exists
      if (currentSubcategory && currentCategory) {
        currentCategory.subcategories.push(currentSubcategory);
      }
      
      const subcategoryTitle = line.replace(/^#+\s*/, '').trim();
      currentSubcategory = {
        title: subcategoryTitle,
        phrases: []
      };
      continue;
    }
    
    // Regular phrase line (contains text, possibly with | separator)
    if (inCategory && currentSubcategory && line.length > 0) {
      // Handle table format (with | separator)
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p && p !== '---');
        // If it's a table header separator, skip
        if (parts.every(p => p === '---' || p === '')) {
          continue;
        }
        // Extract phrases from table cells
        parts.forEach(part => {
          if (part && part.length > 3 && !part.match(/^---+$/)) {
            currentSubcategory.phrases.push(part);
          }
        });
      } else {
        // Regular phrase line
        // Skip if it's just formatting or metadata
        if (!line.startsWith('_') || line.endsWith('_') || line.includes('http')) {
          // Clean up the phrase
          const cleaned = line
            .replace(/^[-*]\s*/, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleaned.length > 5 && !cleaned.match(/^(Contact|Find|Connect)/)) {
            currentSubcategory.phrases.push(cleaned);
          }
        }
      }
    }
  }
  
  // Save last category and subcategory
  if (currentSubcategory && currentCategory) {
    currentCategory.subcategories.push(currentSubcategory);
  }
  if (currentCategory) {
    categories.push(currentCategory);
  }
  
  // Filter out categories with no subcategories or phrases
  return {
    categories: categories.filter(cat => 
      cat.subcategories.length > 0 && 
      cat.subcategories.some(sub => sub.phrases.length > 0)
    )
  };
}

/**
 * Get phrases for a specific category and subcategory
 */
export function getPhrases(
  data: PhraseBankData,
  categoryTitle: string,
  subcategoryTitle?: string
): string[] {
  const category = data.categories.find(
    cat => cat.title.toLowerCase() === categoryTitle.toLowerCase()
  );
  
  if (!category) {
    return [];
  }
  
  if (!subcategoryTitle) {
    // Return all phrases from all subcategories
    return category.subcategories.flatMap(sub => sub.phrases);
  }
  
  const subcategory = category.subcategories.find(
    sub => sub.title.toLowerCase() === subcategoryTitle.toLowerCase()
  );
  
  return subcategory ? subcategory.phrases : [];
}

/**
 * Get all category titles
 */
export function getCategoryTitles(data: PhraseBankData): string[] {
  return data.categories.map(cat => cat.title);
}

/**
 * Get subcategories for a specific category
 */
export function getSubcategories(
  data: PhraseBankData,
  categoryTitle: string
): PhraseSubcategory[] {
  const category = data.categories.find(
    cat => cat.title.toLowerCase() === categoryTitle.toLowerCase()
  );
  
  return category ? category.subcategories : [];
}

