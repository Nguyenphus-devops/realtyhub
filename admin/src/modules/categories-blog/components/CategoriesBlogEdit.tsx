"use client";

import { useParams, useRouter } from "next/navigation";
import CategoriesBlogForm from "./CategoriesBlogForm";

const CategoriesBlogEdit = () => {
  const router = useRouter();
  const params = useParams();

  const slug = params?.slug as string;

  const handleSuccess = () => {
    router.push("/categories-blog");
  };

  if (!slug) {
    return (
      <p className="text-red-600 p-6 text-center">Không tìm thấy slug.</p>
    );
  }

  return (
    <div className="mx-auto mt-6">
      <CategoriesBlogForm slug={slug} onSuccess={handleSuccess} />
    </div>
  );
};

export default CategoriesBlogEdit;
