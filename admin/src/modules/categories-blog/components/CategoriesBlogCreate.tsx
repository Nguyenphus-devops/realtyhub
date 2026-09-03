"use client";

import { useRouter } from "next/navigation";
import CategoriesBlogForm from "./CategoriesBlogForm";

const CategoriesBlogCreate = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/categories-blog");
  };

  return (
    <div className="mx-auto">
      <CategoriesBlogForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CategoriesBlogCreate;
