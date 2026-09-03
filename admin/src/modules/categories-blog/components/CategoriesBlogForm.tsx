"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type {
  CreateCategoriesBlogDto,
  UpdateCategoriesBlogDto,
} from "../models/categories-blog.model";
import {
  useCategoriesBlogOne,
  useCategoriesBlogs,
} from "../hooks/useCategoriesBlog";
import { slugifyFromTitle } from "@/utils/slug.utils";

type FormValues = {
  name: string;
  slug: string;
  parentSlug: string;
};

type Props = {
  slug?: string;
  onSuccess?: () => void;
};

const CategoriesBlogForm = ({ slug, onSuccess }: Props) => {
  const isEditMode = Boolean(slug);
  const router = useRouter();

  const { data: currentCategory, isLoading: isLoadingOne } = useCategoriesBlogOne(
    slug ?? "",
  );
  const {
    categories: allForParent,
    isLoading: isLoadingParents,
    createMutation,
    updateMutation,
  } = useCategoriesBlogs(1, 200);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      parentSlug: "",
    },
  });

  useEffect(() => {
    if (isEditMode && currentCategory) {
      reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        parentSlug: currentCategory.parentSlug ?? "",
      });
    }
  }, [currentCategory, isEditMode, reset]);

  const parentOptions = useMemo(() => {
    return [...allForParent]
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
      .map((cat) => ({
        value: cat.slug,
        label: `${"\u2014 ".repeat(cat.level)}${cat.name}`,
      }));
  }, [allForParent]);

  const forbiddenParentSlugSet = useMemo(() => {
    if (!isEditMode || !currentCategory) {
      return new Set<string>();
    }
    const forbidden = new Set<string>([currentCategory.slug]);
    const slugToCategory = new Map(
      allForParent.map((categoryItem) => [categoryItem.slug, categoryItem]),
    );
    const stack = [...(currentCategory.childrenSlugs ?? [])];
    while (stack.length) {
      const childSlug = stack.pop();
      if (!childSlug || forbidden.has(childSlug)) {
        continue;
      }
      forbidden.add(childSlug);
      const node = slugToCategory.get(childSlug);
      if (node?.childrenSlugs?.length) {
        stack.push(...node.childrenSlugs);
      }
    }
    return forbidden;
  }, [isEditMode, currentCategory, allForParent]);

  const selectableParentOptions = useMemo(() => {
    return parentOptions.filter(
      (option) => !forbiddenParentSlugSet.has(option.value),
    );
  }, [parentOptions, forbiddenParentSlugSet]);

  const onSubmit = async (formData: FormValues) => {
    const nameTrim = formData.name.trim();
    if (!nameTrim) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }

    try {
      if (isEditMode && slug) {
        if (!currentCategory) {
          toast.error("Chưa tải xong dữ liệu danh mục.");
          return;
        }
        const slugTrim = formData.slug.trim();
        const parentTrim = formData.parentSlug.trim();
        const nextParentSlug = parentTrim.length > 0 ? parentTrim : "";
        const currentParentSlug = currentCategory.parentSlug ?? "";

        const next: UpdateCategoriesBlogDto = {};
        if (nameTrim !== currentCategory.name) {
          next.name = nameTrim;
        }
        if (slugTrim !== currentCategory.slug) {
          next.slug = slugTrim;
        }
        if (nextParentSlug !== currentParentSlug) {
          next.parentSlug = nextParentSlug;
        }

        if (Object.keys(next).length === 0) {
          toast.info("Không có thay đổi nào.");
          return;
        }

        await updateMutation.mutateAsync({ slug, data: next });
        toast.success("Đã cập nhật danh mục.");
      } else {
        const payload: CreateCategoriesBlogDto = {
          name: nameTrim,
          slug: formData.slug.trim(),
          ...(formData.parentSlug.trim()
            ? { parentSlug: formData.parentSlug.trim() }
            : {}),
        };
        await createMutation.mutateAsync(payload);
        toast.success("Đã tạo danh mục.");
      }
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      const rawMsg = error?.response?.data?.message || error?.message;
      const displayMsg = Array.isArray(rawMsg)
        ? rawMsg.join(", ")
        : typeof rawMsg === "string" && rawMsg.trim()
        ? rawMsg
        : "Có lỗi xảy ra khi lưu danh mục.";
      toast.error(displayMsg);
    }
  };

  if (isEditMode && slug && !isLoadingOne && !currentCategory) {
    return (
      <p className="p-6 text-red-600 text-center">
        Không tìm thấy danh mục.
      </p>
    );
  }

  const showFormSkeleton = isEditMode && isLoadingOne;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Chỉnh sửa danh mục blog" : "Tạo danh mục blog"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Có thể đổi tên, slug URL và danh mục cha. Không thể chọn chính danh mục này hoặc danh mục con làm cha."
              : "Slug URL được tạo tự động từ tên. Có thể gắn vào danh mục cha để tạo cấp con."}
          </p>
        </div>

        {showFormSkeleton ? (
          <div className="p-6 text-gray-500">Đang tải…</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {isEditMode && currentCategory ? (
              <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                Cấp hiện tại:{" "}
                <span className="font-medium text-gray-900">
                  {currentCategory.level}
                </span>
                <span className="text-gray-500">
                  {" "}
                  (tự cập nhật khi đổi danh mục cha)
                </span>
              </div>
            ) : null}

            <div>
              <label
                htmlFor="category-name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                id="category-name"
                {...register("name", {
                  required: "Tên danh mục không được để trống.",
                  validate: (value) => {
                    const trimmed = (value ?? "").trim();
                    if (!trimmed) return "Tên danh mục không được để trống.";

                    const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
                    if (INVALID_NAME_CHARS_REGEX.test(trimmed)) {
                      return "Tên danh mục không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).";
                    }

                    const generatedSlug = slugifyFromTitle(trimmed);
                    if (!generatedSlug) {
                      return "Tên danh mục không được để trống hoặc chỉ chứa ký tự đặc biệt.";
                    }

                    const isDuplicate = allForParent.some(
                      (cat) =>
                        cat.slug !== slug &&
                        cat.name.trim().toLowerCase() === trimmed.toLowerCase(),
                    );
                    if (isDuplicate) {
                      return "Tên danh mục này đã tồn tại trong hệ thống.";
                    }
                    return true;
                  },
                })}
                type="text"
                className={`w-full rounded-lg border px-3 py-2.5 text-gray-900 shadow-sm outline-none transition ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
                placeholder="Ví dụ: Ẩm thực Việt Nam"
                autoComplete="off"
              />
              {errors.name ? (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.name.message}</p>
              ) : null}
            </div>
            <div>
              <div className="flex flex-wrap items-end justify-between gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Slug (URL)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const name = getValues("name");
                    const generated = slugifyFromTitle(name ?? "");
                    if (!generated) {
                      toast.warning("Nhập tiêu đề hợp lệ trước khi sinh slug.");
                      return;
                    }
                    setValue("slug", generated, { shouldValidate: true, shouldDirty: true });
                  }}
                  className="text-sm px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Tạo đường dẫn tự động
                </button>
              </div>
              <input
                {...register("slug", {
                  validate: (value) => {
                    const trimmed = (value ?? "").trim().toLowerCase();
                    if (!trimmed) return true;

                    const SLUG_REGEX = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
                    if (!SLUG_REGEX.test(trimmed)) {
                      return "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang/dưới.";
                    }

                    const isDuplicate = allForParent.some(
                      (cat) => cat.slug !== slug && cat.slug.trim().toLowerCase() === trimmed,
                    );
                    if (isDuplicate) {
                      return "Slug này đã tồn tại trong hệ thống.";
                    }
                    return true;
                  },
                })}
                type="text"
                className={`w-full px-3 py-2 border rounded focus:ring-2 font-mono text-sm ${
                  errors.slug
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Để trống: backend tạo từ tiêu đề; hoặc nhập slug tùy chỉnh"
                autoComplete="off"
              />
              {errors.slug ? (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.slug.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Chỉ dùng chữ thường, số và dấu gạch ngang. Ký tự đặc biệt sẽ được chuẩn hoá khi lưu.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category-parent"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Danh mục cha
              </label>
              <select
                id="category-parent"
                {...register("parentSlug")}
                disabled={isLoadingParents}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-60"
              >
                <option value="">Không có — danh mục gốc (level 0)</option>
                {selectableParentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                {isEditMode
                  ? "Đổi cha sẽ cập nhật cấp (level) cho danh mục này và các nhánh con."
                  : "Chọn danh mục cha nếu đây là nhóm con. Backend nhận parentSlug."}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/categories-blog")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditMode ? "Lưu thay đổi" : "Tạo danh mục"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div >
  );
};

export default CategoriesBlogForm;
