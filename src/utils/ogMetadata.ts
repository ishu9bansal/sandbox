/**
 * Interface for Open Graph metadata
 */
export interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

// Regex patterns for OG metadata extraction (defined once for performance)
const OG_TITLE_REGEX = /<meta\s+(?:property=["']og:title["']\s+content=["']([^"']+)["']|content=["']([^"']+)["']\s+property=["']og:title["'])\s*\/?>/i;
const OG_DESC_REGEX = /<meta\s+(?:property=["']og:description["']\s+content=["']([^"']+)["']|content=["']([^"']+)["']\s+property=["']og:description["'])\s*\/?>/i;
const OG_IMAGE_REGEX = /<meta\s+(?:property=["']og:image["']\s+content=["']([^"']+)["']|content=["']([^"']+)["']\s+property=["']og:image["'])\s*\/?>/i;
const TITLE_REGEX = /<title[^>]*>([^<]+)<\/title>/i;
const META_DESC_REGEX = /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i;
const TWITTER_TITLE_REGEX = /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i;
const TWITTER_DESC_REGEX = /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i;
const TWITTER_IMAGE_REGEX = /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i;

/**
 * Decodes common HTML entities
 */
function decodeHTMLEntities(str: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  
  return str.replace(/&[#\w]+;/g, (match) => entities[match] || match);
}

/**
 * Fetches Open Graph metadata from a given URL
 * This function extracts OG tags from the HTML of the provided URL
 */
export async function fetchOGData(url: string): Promise<OGMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract OG tags using pre-compiled regex patterns
    const ogTitleMatch = html.match(OG_TITLE_REGEX);
    const ogDescMatch = html.match(OG_DESC_REGEX);
    const ogImageMatch = html.match(OG_IMAGE_REGEX);
    
    const ogTitle = ogTitleMatch?.[1] || ogTitleMatch?.[2];
    const ogDescription = ogDescMatch?.[1] || ogDescMatch?.[2];
    const ogImage = ogImageMatch?.[1] || ogImageMatch?.[2];
    
    // Fallback to other meta tags if OG tags not found
    const title = ogTitle || 
                  html.match(TITLE_REGEX)?.[1] ||
                  html.match(TWITTER_TITLE_REGEX)?.[1];
    
    const description = ogDescription ||
                        html.match(META_DESC_REGEX)?.[1] ||
                        html.match(TWITTER_DESC_REGEX)?.[1];
    
    const image = ogImage ||
                  html.match(TWITTER_IMAGE_REGEX)?.[1];

    return {
      title: title ? decodeHTMLEntities(title) : undefined,
      description: description ? decodeHTMLEntities(description) : undefined,
      image,
      url,
    };
  } catch (error) {
    console.error(`Error fetching OG data for ${url}:`, error);
    return {
      title: 'Blog Post',
      description: 'Click to read more',
      url,
    };
  }
}

/**
 * Fetches OG metadata for multiple URLs in parallel
 */
export async function fetchMultipleOGData(urls: string[]): Promise<OGMetadata[]> {
  if (urls.length === 0) {
    return [];
  }
  const promises = urls.map(url => fetchOGData(url));
  return Promise.all(promises);
}
