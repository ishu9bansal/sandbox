import Card from "@/components/compositions/card";
import { OGMetadata } from "@/utils/ogMetadata";
import { BlogMetadata } from "@/lib/blogs";

interface BlogCardProps {
  blog: OGMetadata | BlogMetadata;
  className?: string;
}

export default function BlogCard({ blog, className = "" }: BlogCardProps) {
  return (
    <a
      href={blog.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block transition-transform hover:scale-105 ${className}`}
    >
      <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg p-0 overflow-hidden">
        {blog.image && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white line-clamp-2">
            {blog.title || "Untitled Blog Post"}
          </h3>
          {blog.description && (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
              {blog.description}
            </p>
          )}
          <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm">
            Read on Medium →
          </div>
        </div>
      </Card>
    </a>
  );
}
