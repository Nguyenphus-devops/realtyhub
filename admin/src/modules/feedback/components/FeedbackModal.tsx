"use client";

import { useEffect, useState, useMemo } from "react";
import type React from "react";
import type { AdminCreateFeedbackInput } from "../models/feedback.model";
import { useAdminServiceCategoriesPublic } from "@/modules/service-category/hooks/useAdminServiceCategoriesPublic";

const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCreateFeedbackInput) => void;
  form: AdminCreateFeedbackInput;
  setForm: React.Dispatch<React.SetStateAction<AdminCreateFeedbackInput>>;
  isLoading: boolean;
  editingId: string | null;
};

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isLoading,
  editingId,
}: Props) => {
  const { categories } = useAdminServiceCategoriesPublic();
  const [beforePreview, setBeforePreview] = useState<string>("");
  const [afterPreview, setAfterPreview] = useState<string>("");
  const [beforeImageError, setBeforeImageError] = useState<string>("");
  const [afterImageError, setAfterImageError] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setBeforeImageError("");
      setAfterImageError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (form.beforeImageUrl) {
      setBeforePreview(form.beforeImageUrl);
    } else {
      setBeforePreview("");
    }
    if (form.afterImageUrl) {
      setAfterPreview(form.afterImageUrl);
    } else {
      setAfterPreview("");
    }
  }, [form.beforeImageUrl, form.afterImageUrl]);

  const formErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // 1. Name
    const nameTrim = (form.name || "").trim();
    if (!nameTrim) {
      errors.name = "Tên hội viên không được để trống.";
    } else if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
      errors.name = "Tên hội viên không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).";
    } else if (nameTrim.length > 100) {
      errors.name = "Tên hội viên không được vượt quá 100 ký tự.";
    }

    // 2. Comment
    const commentTrim = (form.comment || "").trim();
    if (!commentTrim) {
      errors.comment = "Nội dung nhận xét không được để trống.";
    }

    return errors;
  }, [form]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateImageFile = (file?: File | null, label: string = "ảnh"): string => {
    if (!file) return "";
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `File ${label} không đúng định dạng (chỉ chấp nhận JPG, PNG, GIF, WEBP).`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Dung lượng file ${label} không được vượt quá 5MB.`;
    }
    return "";
  };

  const handleBeforeChange = (file?: File | null) => {
    if (!file) return;
    const err = validateImageFile(file, "Before");
    if (err) {
      setBeforeImageError(err);
      return;
    }
    setBeforeImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setBeforePreview(result);
        setForm((p) => ({ ...p, beforeImageUrl: result, beforeImageFile: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAfterChange = (file?: File | null) => {
    if (!file) return;
    const err = validateImageFile(file, "After");
    if (err) {
      setAfterImageError(err);
      return;
    }
    setAfterImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAfterPreview(result);
        setForm((p) => ({ ...p, afterImageUrl: result, afterImageFile: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeBeforeImage = () => {
    setBeforePreview("");
    setBeforeImageError("");
    setForm((p) => ({ ...p, beforeImageUrl: "", beforeImageFile: null }));
  };

  const removeAfterImage = () => {
    setAfterPreview("");
    setAfterImageError("");
    setForm((p) => ({ ...p, afterImageUrl: "", afterImageFile: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(formErrors).length > 0 || beforeImageError || afterImageError) {
      return;
    }
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? "Cập nhật Feedback" : "Thêm Feedback mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-red-50 hover:text-red-600 font-bold text-lg"
          >
            ×
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên hội viên <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                {(form.name || "").length}/100 ký tự
              </span>
            </div>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value.slice(0, 100) }))}
              maxLength={100}
              placeholder="Ví dụ: Alex Turner"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition ${
                (submitted || (form.name || "").length > 0) && formErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 focus:bg-brand-50/5"
              }`}
            />
            {(submitted || (form.name || "").length > 0) && formErrors.name ? (
              <p className="mt-1 text-xs font-medium text-red-500">{formErrors.name}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Số sao đánh giá (Rating)</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                required
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:bg-brand-50/5"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Sao
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Bộ môn / Dịch vụ</label>
              <select
                value={form.serviceType}
                onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value }))}
                required
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:bg-brand-50/5"
              >
                <option value="">Chọn bộ môn</option>
                {categories.map((cat) => (
                  <option key={cat.publicId} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nội dung nhận xét <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.comment || ""}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              rows={3}
              placeholder="Nhập nội dung phản hồi ý kiến khách hàng..."
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition resize-none ${
                (submitted || (form.comment || "").length > 0) && formErrors.comment
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 focus:bg-brand-50/5"
              }`}
            />
            {(submitted || (form.comment || "").length > 0) && formErrors.comment ? (
              <p className="mt-1 text-xs font-medium text-red-500">{formErrors.comment}</p>
            ) : null}
          </div>

          {/* Before & After Image Upload Grid */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">Hình ảnh Before - After (Không bắt buộc)</label>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Before Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Ảnh Before</label>
                <div className="space-y-3">
                  {beforePreview ? (
                    <div className="relative group h-40 w-full overflow-hidden rounded-xl border border-gray-200">
                      <img
                        src={beforePreview}
                        alt="Before Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeBeforeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition ${
                      beforeImageError
                        ? "border-red-500 bg-red-50/10 hover:border-red-600"
                        : "border-gray-300 hover:border-brand-500 hover:bg-brand-50/10"
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs font-semibold text-gray-600 mb-0.5">Click để tải ảnh Before</p>
                        <p className="text-[10px] text-gray-400">JPG, PNG, GIF, WebP (tối đa 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(e) => handleBeforeChange(e.target.files?.[0])}
                      />
                    </label>
                  )}
                  {beforeImageError ? (
                    <p className="mt-1 text-xs font-medium text-red-500">{beforeImageError}</p>
                  ) : null}
                </div>
              </div>

              {/* After Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Ảnh After</label>
                <div className="space-y-3">
                  {afterPreview ? (
                    <div className="relative group h-40 w-full overflow-hidden rounded-xl border border-gray-200">
                      <img
                        src={afterPreview}
                        alt="After Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeAfterImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition ${
                      afterImageError
                        ? "border-red-500 bg-red-50/10 hover:border-red-600"
                        : "border-gray-300 hover:border-brand-500 hover:bg-brand-50/10"
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs font-semibold text-gray-600 mb-0.5">Click để tải ảnh After</p>
                        <p className="text-[10px] text-gray-400">JPG, PNG, GIF, WebP (tối đa 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(e) => handleAfterChange(e.target.files?.[0])}
                      />
                    </label>
                  )}
                  {afterImageError ? (
                    <p className="mt-1 text-xs font-medium text-red-500">{afterImageError}</p>
                  ) : null}
                </div>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-gray-400">
              * Để trống hai ảnh trên nếu feedback này chỉ hiển thị nhận xét dạng văn bản thông thường (Text Card).
            </p>
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
