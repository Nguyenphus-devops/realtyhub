"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { CategoriesBlog } from "../../categories-blog/models/categories-blog.model";
import type {
  CreateBlogDto,
  UpdateBlogDto,
  BlogStatus,
  Blog,
} from "../models/blog.model";
import { useBlogOne, useBlogMutations, useBlogs } from "../hooks/useBlog";
import { useCategoriesBlogs } from "../../categories-blog/hooks/useCategoriesBlog";
import { slugifyFromTitle } from "@/utils/slug.utils";
import CategoryBlogTree from "./CategoryBlogTree";
import { useImages } from "@/common/hooks/useImages";
import SunEditor from "@/common/components/SunEditor";
import type { SunEditorHandle } from "@/common/components/SunEditor";
import BlogPreviewModal from "./BlogPreviewModal";
import RelatedBlogsModal from "./RelatedBlogsModal";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";
import type { BlogFaq } from "../models/blog.model";

type FormValues = {
  title: string;
  slug: string;
  excerpt: string;
  blogData: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  status: BlogStatus;
  isHidden: boolean;
  isFeatured: boolean;
  showBMI: boolean;
  showTDEE: boolean;
  showBMR: boolean;
  showRMR: boolean;
  showProtein: boolean;
  showBodyFat: boolean;
  relatedSlugs?: string[];
  authorName?: string;
  authorPosition?: string;
  authorDescription?: string;
};

const createEmptyFaq = (): BlogFaq => ({
  question: "",
  answer: "",
});

const FaqHtmlEditor = ({
  value,
  onChange,
  minHeightClass = "min-h-24",
}: {
  value: string;
  onChange: (value: string) => void;
  minHeightClass?: string;
}) => {
  return (
    <div className={minHeightClass}>
      <SunEditor
        blogData={value}
        setBlogData={onChange}
        variant="compact"
      />
    </div>
  );
};

const isEmptyEditorHtml = (html: string): boolean => {
  if (!html) return true;
  // If it contains an image, video, iframe, audio, or table, it is not empty
  if (
    html.includes("<img") ||
    html.includes("<iframe") ||
    html.includes("<video") ||
    html.includes("<audio") ||
    html.includes("<table")
  ) {
    return false;
  }
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
};

const editorHtmlToPlainText = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

const extractString = (field: any): string => {
  if (!field) return "";
  if (typeof field === "object") {
    return field.vi || field.en || "";
  }
  return String(field);
};

const normalizeCategorySelections = (
  stored: string[] | undefined,
  flat: CategoriesBlog[],
): string[] => {
  if (!stored?.length) {
    return [];
  }
  if (flat.length === 0) {
    return [...stored];
  }
  const slugSet = new Set(flat.map((category) => category.slug));
  return stored
    .map((entry) => {
      if (slugSet.has(entry)) {
        return entry;
      }
      return flat.find((category) => category.name === entry)?.slug;
    })
    .filter((value): value is string => Boolean(value));
};

type Props = {
  slug?: string;
  onSuccess?: (savedSlug: string) => void;
};

const BlogForm = ({ slug, onSuccess }: Props) => {
  const isEditMode = Boolean(slug);
  const [isEditorReady, setIsEditorReady] = useState(!isEditMode);
  const { uploadImage } = useImages();
  const router = useRouter();
  const sunEditorRef = useRef<SunEditorHandle>(null);
  const skipLeaveConfirmationRef = useRef(false);
  const initializedBlogSlugRef = useRef<string | null>(null);
  const { canCreate, canEdit } = usePermissions();
  const canCreateBlog = canCreate(PermissionResource.BLOG);
  const canEditBlog = canEdit(PermissionResource.BLOG);
  const { data: currentBlog, isLoading: isLoadingBlog } = useBlogOne(
    slug ?? "",
  );
  const { createMutation, updateMutation } = useBlogMutations();
  const { categories: blogCategories, isLoading: isLoadingBlogCategories } =
    useCategoriesBlogs(1, 500);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    getValues,
    watch,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      blogData: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      status: "draft",
      isHidden: false,
      isFeatured: false,
      showBMI: false,
      showTDEE: false,
      showBMR: false,
      showRMR: false,
      showProtein: false,
      showBodyFat: false,
      relatedSlugs: [],
      authorName: "",
      authorPosition: "",
      authorDescription: "",
    },
  });

  const titleValue = watch("title") || "";
  const excerptValue = watch("excerpt") || "";
  const excerptTextLength = useMemo(
    () => editorHtmlToPlainText(excerptValue).length,
    [excerptValue],
  );

  const [categoryMainSlugs, setCategoryMainSlugs] = useState<string[]>([]);
  const [categorySubSlugs, setCategorySubSlugs] = useState<string[]>([]);
  const [faqItems, setFaqItems] = useState<BlogFaq[]>([createEmptyFaq()]);

  // Image upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string>("");

  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null);
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string>("");

  const defaultCategoryMainSlugs = useMemo(() => {
    const mainList =
      typeof currentBlog?.category === "string"
        ? [currentBlog.category]
        : (currentBlog?.category as any)?.main;
    return normalizeCategorySelections(mainList, blogCategories);
  }, [currentBlog, blogCategories]);

  const defaultCategorySubSlugs = useMemo(() => {
    const subList =
      typeof currentBlog?.category === "string"
        ? []
        : (currentBlog?.category as any)?.sub;
    return normalizeCategorySelections(subList, blogCategories);
  }, [currentBlog, blogCategories]);

  const effectiveCategoryMainSlugs =
    categoryMainSlugs.length > 0 ? categoryMainSlugs : defaultCategoryMainSlugs;
  const effectiveCategorySubSlugs =
    categorySubSlugs.length > 0 ? categorySubSlugs : defaultCategorySubSlugs;

  const displayThumbnailPreview = thumbnailPreview;
  const displayOgImagePreview = ogImagePreview;

  const hasUnsavedChanges = useMemo(() => {
    if (isDirty) return true;
    if (thumbnailFile !== null || ogImageFile !== null || authorAvatarFile !== null) return true;
    if (
      categoryMainSlugs.length > 0 &&
      JSON.stringify(categoryMainSlugs) !== JSON.stringify(defaultCategoryMainSlugs)
    ) {
      return true;
    }
    if (
      categorySubSlugs.length > 0 &&
      JSON.stringify(categorySubSlugs) !== JSON.stringify(defaultCategorySubSlugs)
    ) {
      return true;
    }
    if (
      faqItems.length > 1 ||
      faqItems.some(
        (item) =>
          !isEmptyEditorHtml(item.question) || !isEmptyEditorHtml(item.answer),
      )
    ) {
      return true;
    }
    return false;
  }, [
    isDirty,
    thumbnailFile,
    ogImageFile,
    authorAvatarFile,
    categoryMainSlugs,
    defaultCategoryMainSlugs,
    categorySubSlugs,
    defaultCategorySubSlugs,
    faqItems,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (skipLeaveConfirmationRef.current) return;
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      if (skipLeaveConfirmationRef.current) return;
      if (!hasUnsavedChanges) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

      const currentPath = window.location.pathname;
      if (href === currentPath || href === window.location.href) return;

      const confirmLeave = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?",
      );
      if (!confirmLeave) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handlePopState = () => {
      if (skipLeaveConfirmationRef.current) return;
      if (!hasUnsavedChanges) return;

      const confirmLeave = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?",
      );
      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        !window.confirm(
          "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn hủy và rời khỏi trang này?",
        )
      ) {
        return;
      }
    }
    router.push("/blog");
  };

  // Preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    title: string;
    excerpt: string;
    blogData: string;
    thumbnailUrl: string;
    categoryMainSlugs: string[];
    author?: {
      avatar?: string;
      name?: string;
      position?: string;
      description?: string;
    };
  } | null>(null);

  const handleOpenPreview = () => {
    setPreviewData({
      title: getValues("title"),
      excerpt: getValues("excerpt"),
      blogData: getValues("blogData"),
      thumbnailUrl: displayThumbnailPreview,
      categoryMainSlugs: effectiveCategoryMainSlugs,
      author: {
        avatar: authorAvatarPreview,
        name: getValues("authorName"),
        position: getValues("authorPosition"),
        description: getValues("authorDescription"),
      }
    });
    setIsPreviewOpen(true);
  };

  const getParentSlugs = useCallback((slug: string) => {
    const parents: string[] = [];

    let current: any = blogCategories?.find((c) => c.slug === slug);

    while (current?.parentSlug) {
      parents.push(current.parentSlug);
      current = blogCategories?.find((c) => c.slug === current.parentSlug);
    }

    return parents.reverse();
  }, [blogCategories]);

  // Related blogs states
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const { listQuery } = useBlogs(1, 1000, true);
  const allBlogsData = listQuery.data;

  const currentSlug = slug || "";
  const availableBlogs = useMemo(() => {
    if (!allBlogsData?.blogs) return [];
    return allBlogsData.blogs.filter(
      (b: Blog) => b.slug !== currentSlug && b.status === "approved",
    );
  }, [allBlogsData, currentSlug]);

  const watchedRelatedSlugsValue = watch("relatedSlugs");
  const watchedRelatedSlugs = useMemo(
    () => watchedRelatedSlugsValue || [],
    [watchedRelatedSlugsValue],
  );
  const selectedRelatedBlogs = useMemo(() => {
    if (!allBlogsData?.blogs) return [];
    return allBlogsData.blogs.filter((b: Blog) =>
      watchedRelatedSlugs.includes(b.slug),
    );
  }, [allBlogsData, watchedRelatedSlugs]);

  useEffect(() => {
    if (!isEditMode || !currentBlog) {
      return;
    }
    // A query invalidation/refetch after update must not reset a live editor.
    // Reinitialize only when navigating to a genuinely different blog slug.
    if (initializedBlogSlugRef.current === currentBlog.slug) {
      return;
    }
    initializedBlogSlugRef.current = currentBlog.slug;

    setThumbnailFile(null);
    setThumbnailPreview(currentBlog.thumbnail ?? "");
    setOgImageFile(null);
    setOgImagePreview(currentBlog.seo?.ogImage ?? "");
    setAuthorAvatarFile(null);
    setAuthorAvatarPreview((currentBlog as any).author?.avatar ?? "");
    setFaqItems(
      currentBlog.faqs && currentBlog.faqs.length > 0
        ? currentBlog.faqs.map((item) => ({
            question: item.question ?? "",
            answer: item.answer ?? "",
          }))
        : [createEmptyFaq()],
    );

    reset({
      title: extractString(currentBlog.title),
      slug: currentBlog.slug,
      excerpt: extractString(currentBlog.excerpt),
      blogData: extractString(currentBlog.blogData),
      metaTitle: currentBlog.seo?.metaTitle ?? "",
      metaDescription: currentBlog.seo?.metaDescription ?? "",
      metaKeywords: currentBlog.seo?.metaKeywords ?? "",
      status: currentBlog.status,
      isHidden: currentBlog.isHidden,
      isFeatured: currentBlog.isFeatured ?? false,
      showBMI: (currentBlog as any).showBMI ?? false,
      showTDEE: (currentBlog as any).showTDEE ?? false,
      showBMR: (currentBlog as any).showBMR ?? false,
      showRMR: (currentBlog as any).showRMR ?? false,
      showProtein: (currentBlog as any).showProtein ?? false,
      showBodyFat: (currentBlog as any).showBodyFat ?? false,
      relatedSlugs: currentBlog.relatedSlugs ?? [],
      authorName: (currentBlog as any).author?.name ?? "",
      authorPosition: (currentBlog as any).author?.position ?? "",
      authorDescription: (currentBlog as any).author?.description ?? "",
    });
    // Mount SunEditor only after its initial HTML is present. Initializing it
    // empty and calling html.set() later makes SunEditor recalculate image
    // figure dimensions and can turn a resized image back into full width.
    setIsEditorReady(true);
  }, [currentBlog, isEditMode, reset]);

  const toggleCategoryMain = useCallback(
    (slug: string, checked: boolean) => {
      setCategoryMainSlugs((previous) => {
        let next = [...previous];

        if (checked) {
          const parents = getParentSlugs(slug);

          parents.forEach((parent) => {
            if (!next.includes(parent)) {
              next.push(parent);
            }
          });

          if (!next.includes(slug)) {
            next.push(slug);
          }
        } else {
          next = next.filter((item) => item !== slug);
        }

        return next;
      });
    },
    [getParentSlugs],
  );

  const toggleCategorySub = useCallback(
    (slug: string, checked: boolean) => {
      setCategorySubSlugs((previous) => {
        let next = [...previous];

        if (checked) {
          const parents = getParentSlugs(slug);

          parents.forEach((parent) => {
            if (!next.includes(parent)) {
              next.push(parent);
            }
          });

          if (!next.includes(slug)) {
            next.push(slug);
          }
        } else {
          next = next.filter((item) => item !== slug);
        }

        return next;
      });
    },
    [getParentSlugs],
  );

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOgImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setOgImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOgImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const removeOgImage = () => {
    setOgImageFile(null);
    setOgImagePreview("");
  };

  const handleAuthorAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setAuthorAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAuthorAvatar = () => {
    setAuthorAvatarFile(null);
    setAuthorAvatarPreview("");
  };

  const onSubmit = async (formData: FormValues) => {
    try {
      if (!formData.title?.trim()) {
        alert("Tiêu đề không được để trống.");
        return;
      }
      if (!formData.excerpt?.trim()) {
        alert("Mô tả ngắn không được để trống.");
        return;
      }
      // Read from SunEditor's live DOM so image resize/alignment changes are
      // included even when its debounced onChange has not fired yet.
      await sunEditorRef.current?.waitForPendingUploads();
      const currentBlogData =
        sunEditorRef.current?.getContents() ?? getValues("blogData") ?? "";

      if (/<img\b[^>]*\bsrc=["']data:image\//i.test(currentBlogData)) {
        alert("Ảnh trong nội dung chưa upload xong. Vui lòng dán lại ảnh hoặc chờ upload hoàn tất rồi lưu bài.");
        return;
      }

      if (isEmptyEditorHtml(currentBlogData)) {
        alert("Nội dung bài viết không được để trống.");
        return;
      }

      // Upload images to server
      let thumbnailUrl = displayThumbnailPreview || undefined;
      let ogImageUrl = displayOgImagePreview || undefined;

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        try {
          const uploadResult = await uploadImage(thumbnailFile);
          if (uploadResult) {
            thumbnailUrl = uploadResult.url || uploadResult.imageUrl;
          } else {
            alert("Lỗi khi upload ảnh thumbnail. Vui lòng thử lại.");
            return;
          }
        } catch (error) {
          console.error("Error uploading thumbnail:", error);
          alert("Lỗi khi upload ảnh thumbnail. Vui lòng thử lại.");
          return;
        }
      }

      // Upload OG image if new file selected
      if (ogImageFile) {
        try {
          const uploadResult = await uploadImage(ogImageFile);
          if (uploadResult) {
            ogImageUrl = uploadResult.url || uploadResult.imageUrl;
          } else {
            alert("Lỗi khi upload ảnh OG. Vui lòng thử lại.");
            return;
          }
        } catch (error) {
          console.error("Error uploading OG image:", error);
          alert("Lỗi khi upload ảnh OG. Vui lòng thử lại.");
          return;
        }
      }

      let authorAvatarUrl = authorAvatarPreview || undefined;
      // Upload author avatar if new file selected
      if (authorAvatarFile) {
        try {
          const uploadResult = await uploadImage(authorAvatarFile);
          if (uploadResult) {
            authorAvatarUrl = uploadResult.url || uploadResult.imageUrl;
          } else {
            alert("Lỗi khi upload ảnh tác giả. Vui lòng thử lại.");
            return;
          }
        } catch (error) {
          console.error("Error uploading author avatar:", error);
          alert("Lỗi khi upload ảnh tác giả. Vui lòng thử lại.");
          return;
        }
      }

      // Fallback: use thumbnail as OG image if not provided
      if (!ogImageUrl && thumbnailUrl) {
        ogImageUrl = thumbnailUrl;
      }

      const metaTitleTrim = formData.metaTitle?.trim();
      const metaDescriptionTrim = formData.metaDescription?.trim();
      const metaKeywordsTrim = formData.metaKeywords?.trim();

      const seoData = {
        metaTitle: metaTitleTrim || formData.title.trim(),
        metaDescription:
          metaDescriptionTrim || editorHtmlToPlainText(formData.excerpt),
        metaKeywords: metaKeywordsTrim || undefined,
        ogImage: ogImageUrl,
      };
      const cleanedFaqs = faqItems
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))
        .filter(
          (item) =>
            !isEmptyEditorHtml(item.question) &&
            !isEmptyEditorHtml(item.answer),
        );

      if (isEditMode && slug) {
        const payload: UpdateBlogDto = {
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          blogData: currentBlogData,
          thumbnail: thumbnailUrl,
          categoryMain: effectiveCategoryMainSlugs,
          categorySub: effectiveCategorySubSlugs,
          status: formData.status,
          isHidden: formData.isHidden,
          isFeatured: formData.isFeatured,
          showBMI: formData.showBMI,
          showTDEE: formData.showTDEE,
          showBMR: formData.showBMR,
          showRMR: formData.showRMR,
          showProtein: formData.showProtein,
          showBodyFat: formData.showBodyFat,
          slug: formData.slug.trim(),
          seo: seoData,
          relatedSlugs: formData.relatedSlugs ?? [],
          faqs: cleanedFaqs,
          author: {
            avatar: authorAvatarUrl,
            name: formData.authorName?.trim(),
            position: formData.authorPosition?.trim(),
            description: formData.authorDescription?.trim(),
          },
        };

        const saved = await updateMutation.mutateAsync({ slug, data: payload });
        toast.success("Cập nhật thành công!");
        onSuccess?.(saved.slug);
        if (saved.slug !== slug) {
          router.replace(`/blog/edit/${saved.slug}`);
        }
      } else {
        const slugTrim = formData.slug.trim();
        const payload: CreateBlogDto = {
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          blogData: currentBlogData,
          thumbnail: thumbnailUrl,
          isFeatured: formData.isFeatured,
          showBMI: formData.showBMI,
          showTDEE: formData.showTDEE,
          showBMR: formData.showBMR,
          showRMR: formData.showRMR,
          showProtein: formData.showProtein,
          showBodyFat: formData.showBodyFat,
          categoryMain: effectiveCategoryMainSlugs.length
            ? effectiveCategoryMainSlugs
            : undefined,
          categorySub: effectiveCategorySubSlugs.length
            ? effectiveCategorySubSlugs
            : undefined,
          seo: seoData,
          relatedSlugs: formData.relatedSlugs ?? [],
          faqs: cleanedFaqs,
          author: {
            avatar: authorAvatarUrl,
            name: formData.authorName?.trim(),
            position: formData.authorPosition?.trim(),
            description: formData.authorDescription?.trim(),
          },
          ...(slugTrim ? { slug: slugTrim } : {}),
        };

        const saved = await createMutation.mutateAsync(payload);
        toast.success("Tạo bài viết thành công!");
        onSuccess?.(saved.slug);
        // Use a document navigation after creation. SunEditor keeps
        // document-level focus/selection callbacks; a client-side transition
        // can run those callbacks while React is tearing down several editor
        // instances at once. A full navigation lets the browser release the
        // old document atomically after the article has been saved.
        skipLeaveConfirmationRef.current = true;
        window.location.assign("/blog");
      }
    } catch (error: unknown) {
      console.error("Full error:", error);
      const typedError = error as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      console.error("Error response:", typedError.response?.data);
      const rawMsg = typedError.response?.data?.message || typedError.message;
      const displayMsg = Array.isArray(rawMsg)
        ? rawMsg.join(", ")
        : typeof rawMsg === "string" && rawMsg.trim()
        ? rawMsg
        : "Có lỗi xảy ra khi lưu bài viết.";
      toast.error(displayMsg);
    }
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    if (errors.title) {
      setFocus("title");
    } else if (errors.excerpt) {
      setFocus("excerpt");
    }
  };

  if (isEditMode && isLoadingBlog) {
    return <p className="p-6 text-gray-600">Đang tải bài viết...</p>;
  }

  if (isEditMode && slug && !isLoadingBlog && !currentBlog) {
    return <p className="p-6 text-red-600">Không tìm thấy bài viết.</p>;
  }

  // In edit mode the query can already have cached data while react-hook-form
  // has not been reset with that article yet. Do not mount any SunEditor in
  // that intermediate render. The create flow does not have this extra phase,
  // which is why the issue only appeared after clicking "Sửa".
  if (isEditMode && !isEditorReady) {
    return <p className="p-6 text-gray-600">Đang chuẩn bị trình soạn thảo...</p>;
  }

  if (!isEditMode && !canCreateBlog) {
    return null;
  }

  if (isEditMode && !canEditBlog) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Cập nhật bài viết" : "Tạo bài viết mới"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Thông tin cơ bản
              </h3>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-semibold text-gray-500">
                    {titleValue.length} ký tự (Khuyến nghị ~60)
                  </span>
                </div>
                <input
                  {...register("title", {
                    validate: (value) => {
                      const title = value.trim();
                      if (!title) return "Tiêu đề không được để trống.";
                      if (title.length < 3) {
                        return "Tiêu đề phải có ít nhất 3 ký tự.";
                      }
                      return true;
                    },
                  })}
                  type="text"
                  aria-invalid={Boolean(errors.title)}
                  className={`w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Nhập tiêu đề bài viết"
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Slug (URL)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const title = getValues("title");
                      const generated = slugifyFromTitle(title ?? "");
                      if (!generated) {
                        toast.warning("Nhập tiêu đề hợp lệ trước khi sinh slug.");
                        return;
                      }
                      setValue("slug", generated, { shouldValidate: true, shouldDirty: true });
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                  >
                    Tạo tự động
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

                      const existing = allBlogsData?.blogs?.some(
                        (b: Blog) =>
                          b.slug !== currentSlug &&
                          b.slug.trim().toLowerCase() === trimmed,
                      );
                      if (existing) {
                        return "Slug này đã tồn tại trong hệ thống.";
                      }
                      return true;
                    },
                  })}
                  type="text"
                  className={`w-full rounded-lg border px-4 py-2.5 font-mono text-sm outline-none transition focus:outline-none focus:ring-2 ${
                    errors.slug
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="vi-du-slug-bai-viet"
                  autoComplete="off"
                />
                {errors.slug ? (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.slug.message}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-500">
                    Để trống để tự động tạo từ tiêu đề
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả ngắn <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-semibold text-gray-500">
                    {excerptTextLength} ký tự (Khuyến nghị ~160)
                  </span>
                </div>
                <input
                  type="hidden"
                  {...register("excerpt", {
                    validate: (value) =>
                      !isEmptyEditorHtml(value) ||
                      "Mô tả ngắn không được để trống.",
                  })}
                />
                <div className={errors.excerpt ? "rounded-lg ring-1 ring-red-500" : ""}>
                  <FaqHtmlEditor
                    value={excerptValue}
                    onChange={(value) =>
                      setValue("excerpt", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                {errors.excerpt && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Hình ảnh
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh thumbnail
                  </label>
                  <div className="space-y-3">
                    {thumbnailPreview ? (
                      <div className="relative group">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600 mb-1">
                            Click để tải ảnh
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, GIF, WebP (tối đa 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* OG Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh OG (Share mạng xã hội)
                  </label>
                  <div className="space-y-3">
                    {ogImagePreview ? (
                      <div className="relative group">
                        <img
                          src={ogImagePreview}
                          alt="OG Image preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeOgImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600 mb-1">
                            Click để tải ảnh
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, GIF, WebP (tối đa 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleOgImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Để trống để dùng ảnh thumbnail
                  </p>
                </div>
              </div>
            </div>

            {/* Content Editor Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Nội dung <span className="text-red-500">*</span>
              </h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <SunEditor
                  ref={sunEditorRef}
                  blogData={getValues("blogData") ?? ""}
                  setBlogData={(value) =>
                    setValue("blogData", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>

            {/* FAQ Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4 flex items-center justify-between gap-3 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Câu hỏi thường gặp
                </h3>
                <button
                  type="button"
                  onClick={() => setFaqItems((prev) => [...prev, createEmptyFaq()])}
                  className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Thêm câu hỏi
                </button>
              </div>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-700">
                        FAQ {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFaqItems((prev) =>
                            prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
                          )
                        }
                        className="text-sm font-medium text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:text-red-300"
                        disabled={faqItems.length === 1}
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Câu hỏi
                        </label>
                        <div className="relative rounded-lg border border-gray-300">
                          <FaqHtmlEditor
                            value={item.question}
                            onChange={(value) => {
                              setFaqItems((prev) =>
                                prev.map((faq, i) =>
                                  i === index ? { ...faq, question: value } : faq,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Câu trả lời
                        </label>
                        <div className="relative rounded-lg border border-gray-300">
                          <FaqHtmlEditor
                            value={item.answer}
                            minHeightClass="min-h-32"
                            onChange={(value) => {
                              setFaqItems((prev) =>
                                prev.map((faq, i) =>
                                  i === index ? { ...faq, answer: value } : faq,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Thông tin tác giả
              </h3>
              <div className="space-y-4">
                <div className="flex gap-6">
                  {/* Avatar Upload */}
                  <div className="w-32 flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar
                    </label>
                    <div className="relative aspect-square w-full border-2 border-dashed border-gray-300 rounded-full overflow-hidden flex flex-col items-center justify-center bg-gray-50 group hover:border-purple-500 hover:bg-purple-50 transition-colors">
                      {authorAvatarPreview ? (
                        <>
                          <img
                            src={authorAvatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <label className="cursor-pointer p-2 bg-white rounded-full text-gray-700 hover:text-purple-600 transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleAuthorAvatarChange}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={removeAuthorAvatar}
                              className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center p-4">
                          <svg
                            className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs text-center font-medium text-gray-500 group-hover:text-purple-600">
                            Tải ảnh lên
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleAuthorAvatarChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Name and Position */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên tác giả
                      </label>
                      <input
                        {...register("authorName")}
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="VD: Võ Khắc Nhân"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vị trí / Chức vụ
                      </label>
                      <input
                        {...register("authorPosition")}
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="VD: Founder Phần mềm MONA AI"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả tác giả
                  </label>
                  <textarea
                    {...register("authorDescription")}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập thông tin giới thiệu về tác giả..."
                  />
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                SEO Metadata
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    {...register("metaTitle")}
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mặc định dùng tiêu đề bài viết"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Khuyến nghị 50-60 ký tự
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    {...register("metaDescription")}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mặc định dùng mô tả ngắn"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Khuyến nghị 150-160 ký tự
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    {...register("metaKeywords")}
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Các từ khóa cách nhau bằng dấu phẩy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column (1/3) */}

          <div className="lg:col-span-1 space-y-6">
            {/* Publish Card */}

            {isEditMode && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                  Xuất bản
                </h3>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="draft">Nháp</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isHidden")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Ẩn bài viết</span>
                  </label>
                </div>
              </div>
            )}

            {/* Settings Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Cài đặt
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Chọn một calculator để hiển thị trong bài viết (chỉ chọn được 1)
              </p>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={
                      !watch("showBMI") &&
                      !watch("showBMR") &&
                      !watch("showTDEE") &&
                      !watch("showRMR") &&
                      !watch("showProtein") &&
                      !watch("showBodyFat")
                    }
                    onChange={() => {
                      setValue("showBMI", false);
                      setValue("showBMR", false);
                      setValue("showTDEE", false);
                      setValue("showRMR", false);
                      setValue("showProtein", false);
                      setValue("showBodyFat", false);
                    }}
                    className="w-4 h-4 text-gray-400 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Không hiển thị</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={watch("showBMI")}
                    onChange={() => {
                      setValue("showBMI", true);
                      setValue("showBMR", false);
                      setValue("showTDEE", false);
                      setValue("showRMR", false);
                      setValue("showProtein", false);
                      setValue("showBodyFat", false);
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">BMI Calculator</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={watch("showBMR")}
                    onChange={() => {
                      setValue("showBMI", false);
                      setValue("showBMR", true);
                      setValue("showTDEE", false);
                      setValue("showRMR", false);
                      setValue("showProtein", false);
                      setValue("showBodyFat", false);
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">BMR Calculator</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={watch("showTDEE")}
                    onChange={() => {
                      setValue("showBMI", false);
                      setValue("showBMR", false);
                      setValue("showTDEE", true);
                      setValue("showRMR", false);
                      setValue("showProtein", false);
                      setValue("showBodyFat", false);
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">TDEE Calculator</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={watch("showRMR")}
                    onChange={() => {
                      setValue("showBMI", false);
                      setValue("showBMR", false);
                      setValue("showTDEE", false);
                      setValue("showRMR", true);
                      setValue("showProtein", false);
                      setValue("showBodyFat", false);
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">RMR Calculator</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={watch("showProtein")}
                    onChange={() => {
                      setValue("showBMI", false);
                      setValue("showBMR", false);
                      setValue("showTDEE", false);
                      setValue("showRMR", false);
                      setValue("showProtein", true);
                      setValue("showBodyFat", false);
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Protein Calculator
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculator"
                    checked={watch("showBodyFat")}
                    onChange={() => {
                      setValue("showBMI", false);
                      setValue("showBMR", false);
                      setValue("showTDEE", false);
                      setValue("showRMR", false);
                      setValue("showProtein", false);
                      setValue("showBodyFat", true);
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Body Fat Calculator
                  </span>
                </label>
              </div>
            </div>
            {(canCreateBlog || canEditBlog) && (
              <div className="fixed bottom-6 right-6 bg-white border border-gray-200 shadow-xl rounded-xl p-4 flex items-center gap-3 z-40">
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition flex items-center gap-1.5 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Xem trước
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="inline-flex h-11 min-w-[148px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 font-medium leading-none text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-500 disabled:opacity-100 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="grid h-5 w-5 shrink-0 place-items-center" aria-hidden="true">
                        <svg
                          className="block h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-90"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      </span>
                      <span className="leading-none" aria-live="polite">
                        {isEditMode
                          ? "Đang cập nhật..."
                          : "Đang tạo bài viết..."}
                      </span>
                    </>
                  ) : isEditMode ? (
                    "Cập nhật"
                  ) : (
                    "Tạo mới"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            )}

            {/* Featured Post Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Hiển thị trên trang chủ
              </h3>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Bài viết nổi bật
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    Bài viết sẽ xuất hiện trong phần tin tức nổi bật ở trang chủ
                    sau khi được duyệt và công khai.
                  </span>
                </span>
              </label>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Danh mục
              </h3>

              {isLoadingBlogCategories ? (
                <p className="text-sm text-gray-500 py-4">
                  Đang tải danh mục...
                </p>
              ) : (
                <div className="space-y-4">
                  <CategoryBlogTree
                    label="Danh mục chính"
                    description="Chủ đề chính của bài viết"
                    categories={blogCategories}
                    selectedSlugs={effectiveCategoryMainSlugs}
                    onToggle={toggleCategoryMain}
                  />
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <CategoryBlogTree
                      label="Danh mục phụ"
                      description="Các chủ đề phụ liên quan"
                      categories={blogCategories}
                      selectedSlugs={effectiveCategorySubSlugs}
                      onToggle={toggleCategorySub}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Related Blogs Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bài viết liên quan
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRelatedModalOpen(true)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                >
                  Chọn bài viết
                </button>
              </div>

              {selectedRelatedBlogs.length === 0 ? (
                <p className="text-xs text-gray-500 py-2 italic">
                  Chưa có bài viết liên quan nào được chọn.
                </p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {selectedRelatedBlogs.map((b: Blog) => (
                    <div
                      key={b._id}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50/50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {b.thumbnail && (
                          <div className="relative w-8 h-8 rounded overflow-hidden shrink-0">
                            <img
                              src={b.thumbnail}
                              alt={b.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-xs font-semibold text-gray-800 truncate block">
                          {b.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = watchedRelatedSlugs.filter(
                            (s) => s !== b.slug,
                          );
                          setValue("relatedSlugs", updated, {
                            shouldDirty: true,
                          });
                        }}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewData?.title || ""}
        excerpt={previewData?.excerpt || ""}
        blogData={previewData?.blogData || ""}
        thumbnailUrl={previewData?.thumbnailUrl || ""}
        categoryMainSlugs={previewData?.categoryMainSlugs || []}
        categories={blogCategories || []}
        faqs={faqItems}
        author={previewData?.author}
      />

      <RelatedBlogsModal
        isOpen={isRelatedModalOpen}
        onClose={() => setIsRelatedModalOpen(false)}
        selectedSlugs={watchedRelatedSlugs}
        onConfirm={(slugs) =>
          setValue("relatedSlugs", slugs, { shouldDirty: true })
        }
        blogs={availableBlogs}
        categories={blogCategories || []}
      />
    </form>
  );
};

export default BlogForm;
