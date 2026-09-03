"use client";

import { useMemo, useState } from "react";
import type { Blog } from "../models/blog.model";
import type { CategoriesBlog } from "../../categories-blog/models/categories-blog.model";

type RelatedBlogsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedSlugs: string[];
  onConfirm: (slugs: string[]) => void;
  blogs: Blog[];
  categories: CategoriesBlog[];
};

export default function RelatedBlogsModal({
  isOpen,
  onClose,
  selectedSlugs,
  onConfirm,
  blogs,
  categories,
}: RelatedBlogsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tempSelectedSlugs, setTempSelectedSlugs] = useState<string[]>([]);

  // Sync selected slugs when modal opens
  useMemo(() => {
    if (isOpen) {
      setTempSelectedSlugs(selectedSlugs);
    }
  }, [isOpen, selectedSlugs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        !selectedCategory ||
        (typeof blog.category === 'string'
          ? blog.category === selectedCategory
          : (blog.category?.main?.includes(selectedCategory) ||
             blog.category?.sub?.includes(selectedCategory)));
      return matchSearch && matchCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleToggleBlog = (slug: string) => {
    setTempSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedSlugs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Chọn bài viết liên quan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredBlogs.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-sm">Không tìm thấy bài viết phù hợp.</p>
          ) : (
            filteredBlogs.map((blog) => {
              const isChecked = tempSelectedSlugs.includes(blog.slug);
              return (
                <div
                  key={blog._id}
                  onClick={() => handleToggleBlog(blog.slug)}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition cursor-pointer select-none ${isChecked
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  {blog.thumbnail && (
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{blog.title}</h4>
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      Danh mục: {
                        typeof blog.category === 'string'
                          ? (blog.category || "Chưa phân loại")
                          : (blog.category?.main?.[0] || "Chưa phân loại")
                      }
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-xs text-gray-500 font-semibold">
            Đã chọn: {tempSelectedSlugs.length} bài viết
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
