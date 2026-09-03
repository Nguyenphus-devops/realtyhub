"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Blog, BlogStatus } from "../models/blog.model";
import { useBlogs } from "../hooks/useBlog";
import SearchBlog from "./SearchBlog";
import Pagination from "@/common/components/tables/Pagination";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";

const statusLabel: Record<BlogStatus, string> = {
  draft: "Nháp",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const getTitle = (title: any): string => {
  if (!title) return "";
  if (typeof title === "object") {
    return title.vi || title.en || "";
  }
  return String(title);
};

const BlogList = () => {
  const [page, setPage] = useState(1);
  const [includeHidden, setIncludeHidden] = useState(true);
  const [scope, setScope] = useState<"all" | "my">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;
  const { canCreate, canEdit, canDelete } = usePermissions();
  const canCreateBlog = canCreate(PermissionResource.BLOG);
  const canEditBlog = canEdit(PermissionResource.BLOG);
  const canDeleteBlog = canDelete(PermissionResource.BLOG);
  const showActionColumn = canEditBlog || canDeleteBlog;

  const handleSearch = useCallback((term: string) => {
    setSearchQuery(term);
    setPage(1);
  }, []);

  const {
    blogs,
    total,
    hasMore,
    isLoading,
    isFetching,
    updateVisibilityMutation,
    updateStatusMutation,
    hardDeleteMutation,
  } = useBlogs(page, limit, includeHidden, scope, searchQuery);

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit),
    hasMore ? page + 1 : page,
  );

  useEffect(() => {
    const lastAvailablePage = Math.max(1, Math.ceil(total / limit));
    if (!isLoading && !isFetching && page > lastAvailablePage) {
      setPage(lastAvailablePage);
    }
  }, [isFetching, isLoading, limit, page, total]);

  const handleHardDelete = async (blog: Blog) => {
    if (!confirm(`Xóa bài "${getTitle(blog.title)}"?`)) return;
    try {
      await hardDeleteMutation.mutateAsync(blog.slug);
      alert("Đã xóa bài viết.");
    } catch (error) {
      console.error(error);
      alert("Xóa vĩnh viễn bài viết thất bại.");
    }
  };

  const toggleHidden = async (blog: Blog) => {
    try {
      await updateVisibilityMutation.mutateAsync({
        slug: blog.slug,
        isHidden: !blog.isHidden,
      });
    } catch (error) {
      console.error(error);
      alert("Không cập nhật được trạng thái ẩn.");
    }
  };

  const changeStatus = async (blog: Blog, status: BlogStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ slug: blog.slug, status });
    } catch (error) {
      console.error(error);
      alert("Không cập nhật được trạng thái.");
    }
  };

  const showInitialSpinner = isLoading && !blogs.length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý bài viết</h1>
          {/* <p className="mt-2 text-sm text-gray-500">
            Quản lý trạng thái, ẩn/hiện và thao tác nhanh với mỗi bài viết.
          </p> */}
        </div>
        {canCreateBlog && (
          <Link
            href="/blog/create"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Viết bài mới
          </Link>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] mb-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm items-center">
        <div>
          <div className="flex flex-wrap gap-3 items-center">
            <label className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeHidden}
                onChange={(event) => {
                  setIncludeHidden(event.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Hiển thị cả bài ẩn
            </label>

            <div className="flex flex-wrap gap-2">
              {(["all", "my"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setScope(option);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    scope === option
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option === "all" ? "Tất cả" : "Bài của tôi"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-end">
          <SearchBlog onSearch={handleSearch} />
        </div>
      </div>

      {showInitialSpinner ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600 shadow-sm">
          Đang tải danh sách bài viết...
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          {isFetching ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                Đang tải…
              </span>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-sm text-slate-600">
                  <th className="py-4 px-4 font-medium">Tiêu đề</th>
                  <th className="py-4 px-4 font-medium">Trạng thái</th>
                  <th className="py-4 px-4 text-center font-medium">Ẩn</th>
                  <th className="py-4 px-4 font-medium">Cập nhật</th>
                  {showActionColumn && (
                    <th className="py-4 px-4 text-center font-medium">
                      Thao tác
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showActionColumn ? 5 : 4}
                      className="py-12 text-center text-sm text-slate-500"
                    >
                      {searchQuery.trim()
                        ? "Không tìm thấy bài viết phù hợp."
                        : "Chưa có bài viết nào."}
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog, index) => (
                    <tr
                      key={blog._id + index}
                      className="border-t border-gray-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4 max-w-[280px] truncate text-sm font-medium text-slate-900">
                        {getTitle(blog.title)}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {canEditBlog ? (
                          <select
                            value={blog.status}
                            onChange={(event) =>
                              changeStatus(blog, event.target.value as BlogStatus)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                          >
                            {(Object.keys(statusLabel) as BlogStatus[]).map(
                              (key) => (
                                <option key={key} value={key}>
                                  {statusLabel[key]}
                                </option>
                              ),
                            )}
                          </select>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {statusLabel[blog.status]}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-sm">
                        {canEditBlog ? (
                          <button
                            type="button"
                            onClick={() => toggleHidden(blog)}
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition ${
                              blog.isHidden
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {blog.isHidden ? "Đang ẩn" : "Hiển thị"}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              blog.isHidden
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {blog.isHidden ? "Đang ẩn" : "Hiển thị"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500">
                        {blog.updatedAt
                          ? new Date(blog.updatedAt).toLocaleString("vi-VN")
                          : "—"}
                      </td>
                      {showActionColumn && (
                        <td className="py-4 px-4 text-center space-x-2 whitespace-nowrap">
                          {canEditBlog && (
                            <Link
                              href={`/blog/edit/${blog.slug}`}
                              className="inline-flex rounded-xl bg-yellow-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-yellow-600"
                            >
                              Sửa
                            </Link>
                          )}
                          {canDeleteBlog && (
                            <button
                              type="button"
                              onClick={() => handleHardDelete(blog)}
                              className="inline-flex rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
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

export default BlogList;
