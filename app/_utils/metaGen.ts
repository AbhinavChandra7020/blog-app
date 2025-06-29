// app/_utils/metaGenerator.ts

/**
 * Generates a meta title from the original title
 * @param title - The original post title
 * @returns SEO-optimized meta title (under 60 characters)
 */
export function generateMetaTitle(title: string): string {
  // If title is already short enough, use it as-is
  if (title.length <= 55) {
    return title;
  }
  
  // Truncate to 55 characters and add "..."
  return title.substring(0, 55).trim() + '...';
}

/**
 * Generates a meta description from post content
 * @param content - HTML content of the post
 * @returns SEO-optimized meta description (under 160 characters)
 */
export function generateMetaDescription(content: string): string {
  // Remove HTML tags to get plain text
  const plainText = content
    .replace(/<[^>]*>/g, '')        // Remove HTML tags
    .replace(/&[^;]+;/g, ' ')       // Remove HTML entities
    .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
    .trim();
  
  // If content is short enough, use it as-is
  if (plainText.length <= 155) {
    return plainText;
  }
  
  // Truncate to 155 characters and add "..."
  return plainText.substring(0, 155).trim() + '...';
}

/**
 * Generates both meta title and description for a post
 * @param title - The post title
 * @param content - The post content (HTML)
 * @returns Object with metaTitle and metaDescription
 */
export function generateMetaFields(title: string, content: string) {
  return {
    metaTitle: generateMetaTitle(title),
    metaDescription: generateMetaDescription(content)
  };
}

// Example usage for testing
if (process.env.NODE_ENV === 'development') {
  const testTitle = "How to Learn React and Next.js in 2024: A Complete Beginner's Guide";
  const testContent = "<p>React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we'll explore everything you need to know to get started with React development.</p>";
  
  console.log('Meta generation examples:');
  console.log('Original title:', testTitle);
  console.log('Meta title:', generateMetaTitle(testTitle));
  console.log('Meta description:', generateMetaDescription(testContent));
}