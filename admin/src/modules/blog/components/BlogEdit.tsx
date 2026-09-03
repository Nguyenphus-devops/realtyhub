"use client";

import { useParams } from "next/navigation";
import BlogForm from "./BlogForm";

const BlogEdit = () => {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    return <p className="p-4 text-red-600">Thiếu slug bài viết.</p>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <BlogForm slug={slug} />
    </div>
  );
};

export default BlogEdit;
