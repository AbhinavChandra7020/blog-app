import slugifyLib from 'slugify';

/**
 * Generates a URL-friendly slug from a string (e.g., blog post title).
 * Converts spaces to dashes, removes special characters, and lowers the case.
 *
 * @param text - The input string (e.g., post title)
 * @returns A clean slug (e.g., "my-new-post")
 */
export default function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,      // Convert to lowercase
    strict: true,     // Remove special characters
    trim: true        // Remove leading/trailing spaces
  });
}
