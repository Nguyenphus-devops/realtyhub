import BlogEdit from "@/modules/blog/components/BlogEdit";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Chỉnh sửa bài viết",
};
export default function BlogEditPage() {
  return <BlogEdit />;
}
