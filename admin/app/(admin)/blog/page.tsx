import BlogList from "@/modules/blog/components/BlogList";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Danh sách bài viết",
};
export default function BlogPage() {
  return <BlogList />;
}
