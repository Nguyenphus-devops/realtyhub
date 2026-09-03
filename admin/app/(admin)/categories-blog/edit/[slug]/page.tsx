import CategoriesBlogEdit from "@/modules/categories-blog/components/CategoriesBlogEdit";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Chỉnh sửa danh mục bài viết",
};
export default function CategoriesBlogEditPage() {
  return <CategoriesBlogEdit />;
}
