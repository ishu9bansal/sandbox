"use client";
import { OGMetadata } from "@/utils/ogMetadata";
import { BlogMetadata } from "@/lib/blogs";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/components/ui/item";
import Image from "next/image";

interface BlogCardProps {
  blog: OGMetadata | BlogMetadata;
  className?: string;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Item variant='outline' className="block transition-transform hover:scale-105">
      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ItemHeader>
          <Image
            src={blog.image || ""}
            alt={blog.title || "Blog Image"}
            width={512}
            height={512}
            className="aspect-3/2 object-cover w-full rounded-t-md mb-4"
          />
        </ItemHeader>
        <ItemContent>
          <ItemTitle>{blog.title}</ItemTitle>
          <ItemDescription>{blog.description}</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  );
}
