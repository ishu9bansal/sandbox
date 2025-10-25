import { blogs, blogUrls } from "@/lib/blogs";
import { fetchMultipleOGData } from "@/utils/ogMetadata";
import BlogsPageClient from "./BlogsPageClient";

// Force dynamic rendering to fetch OG data at request time
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function BlogsPage() {
  // Combine manual blogs and auto-fetched blogs
  const fetchedBlogs = blogUrls.length > 0 ? await fetchMultipleOGData(blogUrls) : [];
  const allBlogs = [...blogs, ...fetchedBlogs];

  return <BlogsPageClient blogs={allBlogs} />;
}
