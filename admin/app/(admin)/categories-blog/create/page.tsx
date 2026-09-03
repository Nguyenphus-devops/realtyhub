import CategoriesBlogCreate from "@/modules/categories-blog/components/CategoriesBlogCreate";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Tạo danh mục bài viết",
};
export default function CategoriesBlogCreatePage() {
  return <CategoriesBlogCreate />;
}
