import BlogCreate from "@/modules/blog/components/BlogCreate";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Tạo bài viết mới",
};
export default function BlogCreatePage() {
  return <BlogCreate />;
}
