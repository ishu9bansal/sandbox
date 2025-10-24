/**
 * Interface for Open Graph metadata
 */
export interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

/**
 * Fetches Open Graph metadata from a given URL
 * This function extracts OG tags from the HTML of the provided URL
 */
export async function fetchOGData(url: string): Promise<OGMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract OG tags using regex (more robust pattern)
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']\s*\/?>/i)?.[1] ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']\s*\/?>/i)?.[1];
    
    const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']\s*\/?>/i)?.[1] ||
                          html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']\s*\/?>/i)?.[1];
    
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?>/i)?.[1] ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']\s*\/?>/i)?.[1];
    
    // Fallback to other meta tags if OG tags not found
    const title = ogTitle || 
                  html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
                  html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i)?.[1];
    
    const description = ogDescription ||
                        html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] ||
                        html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i)?.[1];
    
    const image = ogImage ||
                  html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)?.[1];

    // Decode HTML entities
    const decodeHTML = (str: string) => {
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    };

    return {
      title: title ? decodeHTML(title) : undefined,
      description: description ? decodeHTML(description) : undefined,
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
