"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { CategoriesBlog } from "../../categories-blog/models/categories-blog.model";
import { GoChevronDown, GoChevronRight } from "react-icons/go";

export type CategoryBlogTreeProps = {
  label?: string;
  description?: string;
  categories: CategoriesBlog[];
  selectedSlugs: string[];
  onToggle: (slug: string, checked: boolean) => void;
};

const CategoryBlogTree = ({
  description,
  categories,
  selectedSlugs,
  onToggle,
}: CategoryBlogTreeProps) => {
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(() => new Set());

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, CategoriesBlog[]>();
    for (const cat of categories) {
      const key =
        cat.parentSlug === null || cat.parentSlug === undefined || cat.parentSlug === ""
          ? null
          : cat.parentSlug;
      const list = map.get(key) ?? [];
      list.push(cat);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }
    return map;
  }, [categories]);

  const toggleExpand = useCallback((slug: string) => {
    setExpandedSlugs((previous) => {
      const next = new Set(previous);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const renderNode = (category: CategoriesBlog, depth: number): ReactNode => {
    const children = childrenByParent.get(category.slug) ?? [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedSlugs.has(category.slug);
    const isChecked = selectedSlugs.includes(category.slug);

    return (
      <div key={category.slug} className="select-none">
        <div
          className="flex items-center gap-1 py-1 rounded-md hover:bg-gray-50"
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(category.slug)}
              className="p-0.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-800"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
            >
              {isExpanded ? (
                <GoChevronDown className="size-4" />
              ) : (
                <GoChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <span className="inline-block w-5 shrink-0" aria-hidden />
          )}
          <label
            htmlFor={`blog-cat-${category.slug}`}
            className="flex flex-1 min-w-0 items-center gap-2 cursor-pointer"
          >
            <input
              id={`blog-cat-${category.slug}`}
              type="checkbox"
              checked={isChecked}
              onChange={(event) =>
                onToggle(category.slug, event.target.checked)
              }
              className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800 truncate">{category.name}</span>
          </label>
        </div>
        {hasChildren && isExpanded ? (
          <div className="border-l border-gray-100 ml-2.5">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  const roots = childrenByParent.get(null) ?? [];

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-center text-sm text-gray-500">
        Chưa có danh mục blog. Tạo tại{" "}
        <span className="font-medium text-gray-700">Danh mục blog</span> trên menu.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/90 px-4 py-3">
        {/* <p className="text-sm font-medium text-gray-800">{label}</p> */}
        {description ? (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="px-3 py-3 max-h-72 overflow-y-auto">
        {roots.length === 0 ? (
          <p className="text-sm text-amber-700">
            Không tìm thấy danh mục gốc (level 0). Kiểm tra dữ liệu parentSlug trên
            server.
          </p>
        ) : (
          roots.map((root) => renderNode(root, 0))
        )}
      </div>
    </div>
  );
};

export default CategoryBlogTree;
