import { useEffect, useState } from "react";
import api from "@/config/api";

export type AdminServiceCategoryPublic = {
  publicId: string;
  name: string;
  slug: string;
  type: "individual" | "class";
  isActive: boolean;
};

export function useAdminServiceCategoriesPublic() {
  const [categories, setCategories] = useState<AdminServiceCategoryPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/service-categories/public")
      .then((response) => {
        if (!active) return;
        const resData = response.data;
        const data = resData && resData.data ? resData.data : resData;
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}
