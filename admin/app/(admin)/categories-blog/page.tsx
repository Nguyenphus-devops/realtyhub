import CategoriesBlogList from "@/modules/categories-blog/components/CategoriesBlogList";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Danh sách danh mục bài viết",
};
export default function CategoriesBlogPage() {
  return <CategoriesBlogList />;
}
