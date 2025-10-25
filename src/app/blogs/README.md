# My Blogs Feature

This feature provides a beautiful blog showcase page that displays your Medium articles as interactive cards with pagination.

## Features

- ✨ **Blog Cards**: Each blog is displayed as a card with title, description, and image
- 🔗 **Easy Management**: Simply add blog metadata to a single constants file
- 📄 **Pagination**: Automatic pagination with 6 blogs per page
- 🎨 **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- 🌙 **Dark Mode Support**: Fully supports light and dark themes
- 🚀 **Fast Loading**: Server-side rendered for optimal performance

## How to Add Your Blogs

### Option 1: Manual Entry (Recommended)

This is the most reliable method as it doesn't depend on external website availability.

1. Open `src/lib/blogs.ts`
2. Add a new entry to the `blogs` array:

```typescript
{
  title: "Your Blog Title",
  description: "Your blog description or subtitle",
  image: "https://your-image-url.com/image.png", // Optional
  url: "https://medium.com/@username/your-blog-slug"
}
```

**To get the metadata from Medium:**

1. Visit your Medium blog post
2. Right-click and select "View Page Source"
3. Search for these meta tags:
   - `og:title` - Copy the content for the title
   - `og:description` - Copy the content for the description
   - `og:image` - Copy the content for the image URL
4. Add the values to your blog entry

### Option 2: Auto-Fetch (Experimental)

You can try auto-fetching OG metadata by adding URLs to the `blogUrls` array in `src/lib/blogs.ts`:

```typescript
export const blogUrls: string[] = [
  "https://medium.com/@username/blog-slug-1",
  "https://medium.com/@username/blog-slug-2",
];
```

**Note**: This method may not work for all sites due to CORS restrictions, rate limiting, or anti-scraping measures. Manual entry is more reliable.

## File Structure

```
src/
├── app/
│   └── blogs/
│       ├── page.tsx              # Server component that fetches blog data
│       └── BlogsPageClient.tsx   # Client component with pagination
├── components/
│   └── BlogCard.tsx              # Blog card component
├── lib/
│   └── blogs.ts                  # Blog data configuration
└── utils/
    └── ogMetadata.ts             # OG metadata fetching utility
```

## Customization

### Change Blogs Per Page

Edit `BLOGS_PER_PAGE` constant in `src/app/blogs/BlogsPageClient.tsx`:

```typescript
const BLOGS_PER_PAGE = 6; // Change to your desired number
```

### Modify Card Styling

Edit `src/components/BlogCard.tsx` to customize:
- Card layout
- Image dimensions
- Text styling
- Hover effects

### Adjust Grid Layout

Edit the grid classes in `src/app/blogs/BlogsPageClient.tsx`:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

Change `lg:grid-cols-3` to display more or fewer cards per row on large screens.

## Technical Details

- **Server-Side Rendering**: Blog metadata is fetched server-side for better performance
- **Dynamic Route**: The page is marked as dynamic to fetch fresh data
- **Revalidation**: Data is cached and revalidated every hour
- **Type Safety**: Full TypeScript support with proper interfaces

## Example

```typescript
// src/lib/blogs.ts
export const blogs: BlogMetadata[] = [
  {
    title: "Getting Started with React Hooks",
    description: "Learn how to use React Hooks to manage state and side effects in functional components.",
    image: "https://example.com/react-hooks.png",
    url: "https://medium.com/@yourname/react-hooks-guide"
  },
  // Add more blogs here...
];
```

## Troubleshooting

### Images not loading

- Check if the image URL is accessible
- Ensure the URL starts with `https://`
- Try using a different image hosting service

### Auto-fetch not working

- Use manual entry instead (more reliable)
- Check browser console for CORS errors
- Medium may be blocking automated requests

### Pagination not appearing

- Ensure you have more than 6 blogs
- Check that `BLOGS_PER_PAGE` is set correctly
