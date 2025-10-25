"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { OGMetadata } from "@/utils/ogMetadata";
import { BlogMetadata } from "@/lib/blogs";
import { useHydrationSafety } from "../hooks/hydrationSafety";

interface BlogsPageClientProps {
  blogs: (OGMetadata | BlogMetadata)[];
}

const BLOGS_PER_PAGE = 6;

export default function BlogsPageClient({ blogs }: BlogsPageClientProps) {
  const hydrating = useHydrationSafety();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (hydrating) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">My Blogs</h1>
        <p className="text-gray-600 dark:text-gray-300">
          A collection of my writings and thoughts shared on Medium.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            No blogs available yet. Add blog entries to{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              src/lib/blogs.ts
            </code>
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((blog, index) => (
              <BlogCard key={`${blog.url}-${index}`} blog={blog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
