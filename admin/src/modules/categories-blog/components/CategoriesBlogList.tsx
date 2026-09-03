"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { CategoriesBlog } from "../models/categories-blog.model";
import { useCategoriesBlogs } from "../hooks/useCategoriesBlog";
import Pagination from "@/common/components/tables/Pagination";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";

const CategoriesBlogList = () => {
  const [page, setPage] = useState(1);
  const limit = 15;
  const { canCreate, canEdit, canDelete } = usePermissions();
  const canCreateCategory = canCreate(PermissionResource.CATEGORY_BLOG);
  const canEditCategory = canEdit(PermissionResource.CATEGORY_BLOG);
  const canDeleteCategory = canDelete(PermissionResource.CATEGORY_BLOG);
  const showActionColumn = canEditCategory || canDeleteCategory;

  const {
    categories,
    total,
    isLoading,
    isFetching,
    softDeleteMutation,
    hardDeleteMutation,
  } = useCategoriesBlogs(page, limit);

  const slugToName = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of categories) {
      map.set(cat.slug, cat.name);
    }
    return map;
  }, [categories]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const showInitialSpinner = isLoading && categories.length === 0;

  const getDescendantCount = (targetCategory: CategoriesBlog): number => {
    const bySlug = new Map(categories.map((item) => [item.slug, item]));
    const visited = new Set<string>();
    const stack = [...(targetCategory.childrenSlugs ?? [])];

    while (stack.length > 0) {
      const childSlug = stack.pop();
      if (!childSlug || visited.has(childSlug)) continue;
      visited.add(childSlug);
      const node = bySlug.get(childSlug);
      if (node?.childrenSlugs?.length) {
        stack.push(...node.childrenSlugs);
      }
    }
    return visited.size;
  };

  const handleSoftDelete = async (category: CategoriesBlog) => {
    const childCount = getDescendantCount(category);
    const confirmMsg =
      childCount > 0
        ? `Hành động này sẽ xóa danh mục cha và toàn bộ ${childCount} danh mục con bên trong. Bạn có chắc chắn muốn tiếp tục?`
        : `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      await softDeleteMutation.mutateAsync(category.slug);
      toast.success("Đã xóa danh mục thành công.");
    } catch (error: any) {
      console.error(error);
      const rawMsg = error?.response?.data?.message || error?.message;
      toast.error(typeof rawMsg === "string" ? rawMsg : "Xóa danh mục thất bại.");
    }
  };

  const handleHardDelete = async (category: CategoriesBlog) => {
    const childCount = getDescendantCount(category);
    const confirmMsg =
      childCount > 0
        ? `Hành động này sẽ xóa vĩnh viễn danh mục cha và toàn bộ ${childCount} danh mục con bên trong. Bạn có chắc chắn muốn tiếp tục?`
        : `Xóa vĩnh viễn danh mục "${category.name}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      await hardDeleteMutation.mutateAsync(category.slug);
      toast.success("Đã xóa vĩnh viễn danh mục thành công.");
    } catch (error: any) {
      console.error(error);
      const rawMsg = error?.response?.data?.message || error?.message;
      toast.error(typeof rawMsg === "string" ? rawMsg : "Xóa vĩnh viễn thất bại.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Danh mục bài viết
          </h1>
        </div>
        {canCreateCategory && (
          <Link
            href="/categories-blog/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
          >
            Tạo danh mục
          </Link>
        )}
      </div>

      {showInitialSpinner ? (
        <p className="py-10 text-center text-gray-500">Đang tải danh mục…</p>
      ) : (
        <div
          className={`relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
            isFetching ? "opacity-75" : ""
          }`}
        >
          {isFetching && !showInitialSpinner ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 pointer-events-none">
              <span className="text-sm text-gray-600 rounded-lg bg-white px-3 py-1.5 shadow border border-gray-100">
                Đang cập nhật…
              </span>
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/90 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3 w-20">Cấp</th>
                  <th className="px-4 py-3">Danh mục cha</th>
                  <th className="px-4 py-3">Cập nhật</th>
                  {showActionColumn && (
                    <th className="px-4 py-3 text-center w-48">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showActionColumn ? 6 : 5}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      Chưa có danh mục. Hãy tạo danh mục đầu tiên.
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => {
                    const parentLabel = category.parentSlug
                      ? slugToName.get(category.parentSlug) ?? category.parentSlug
                      : "—";

                    return (
                      <tr
                        key={category._id + index}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span
                            className="font-medium text-gray-900"
                            style={{
                              paddingLeft: `${category.level * 12}px`,
                            }}
                          >
                            {category.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {category.slug}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                            L{category.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {parentLabel}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {category.updatedAt
                            ? new Date(category.updatedAt).toLocaleString("vi-VN")
                            : "—"}
                        </td>
                        {showActionColumn && (
                          <td className="px-4 py-3 text-center whitespace-nowrap space-x-1">
                            {canEditCategory && (
                              <Link
                                href={`/categories-blog/edit/${encodeURIComponent(category.slug)}`}
                                className="inline-flex rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                              >
                                Sửa
                              </Link>
                            )}
                            {canDeleteCategory && (
                              <button
                                type="button"
                                onClick={() => handleSoftDelete(category)}
                                className="inline-flex rounded-md bg-orange-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
                              >
                                Xóa
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!showInitialSpinner ? (
        <div className="flex flex-col gap-4 justify-end pt-6 sm:flex-row sm:items-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              if (newPage < 1 || newPage > totalPages) return;
              setPage(newPage);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CategoriesBlogList;
