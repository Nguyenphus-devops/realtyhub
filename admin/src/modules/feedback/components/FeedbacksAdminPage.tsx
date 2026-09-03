"use client";

import { useMemo, useState } from "react";
import { useAdminFeedbacks } from "../hooks/useAdminFeedbacks";
import type { AdminFeedback, AdminCreateFeedbackInput } from "../models/feedback.model";
import FeedbackModal from "./FeedbackModal";
import { DocsIcon } from "@/icons/index";
import { useAdminServiceCategoriesPublic } from "@/modules/service-category/hooks/useAdminServiceCategoriesPublic";

const emptyForm: AdminCreateFeedbackInput = {
  name: "",
  avatar: "",
  rating: 5,
  comment: "",
  serviceType: "",
  beforeImageFile: null,
  afterImageFile: null,
  beforeImageUrl: "",
  afterImageUrl: "",
};

export default function FeedbacksAdminPage() {
  const {
    feedbacks,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    seedMutation,
  } = useAdminFeedbacks();

  const { categories } = useAdminServiceCategoriesPublic();

  const getCategoryLabel = (slug: string) => {
    const found = categories.find((cat) => cat.slug === slug);
    return found ? found.name : slug;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCreateFeedbackInput>(emptyForm);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchesSearch =
        fb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.comment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? fb.serviceType === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [feedbacks, searchQuery, categoryFilter]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (fb: AdminFeedback) => {
    setForm({
      name: fb.name,
      avatar: fb.avatar,
      rating: fb.rating,
      comment: fb.comment,
      serviceType: fb.serviceType,
      beforeImageUrl: fb.beforeImage || "",
      afterImageUrl: fb.afterImage || "",
      beforeImageFile: null,
      afterImageFile: null,
    });
    setEditingId(fb.publicId);
    setModalOpen(true);
  };

  const handleDelete = async (publicId: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phản hồi của hội viên ${name}?`)) {
      try {
        await deleteMutation.mutateAsync(publicId);
        alert("Đã xóa feedback thành công.");
      } catch (err) {
        console.error(err);
        alert("Xóa thất bại. Kiểm tra lại kết nối.");
      }
    }
  };

  const handleSeed = async () => {
    try {
      const result = await seedMutation.mutateAsync();
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert("Seed dữ liệu thất bại.");
    }
  };

  const handleModalSubmit = async (inputData: AdminCreateFeedbackInput) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          publicId: editingId,
          data: inputData,
        });
        alert("Cập nhật feedback thành công!");
      } else {
        await createMutation.mutateAsync(inputData);
        alert("Thêm feedback thành công!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại. Kiểm tra dữ liệu nhập.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header section */}
      <header className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 px-8 py-8 shadow-sm transition-all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-55 text-brand-500">
              <DocsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý Feedback</h1>
              <p className="text-sm text-gray-500">Quản lý nhận xét và câu chuyện lột xác (Before/After) của hội viên</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {feedbacks.length === 0 && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={seedMutation.isPending}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {seedMutation.isPending ? "Đang seed..." : "Seed dữ liệu mẫu"}
              </button>
            )}
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600"
            >
              + Thêm Feedback
            </button>
          </div>
        </div>
      </header>

      {/* Filter panel */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Tìm theo tên hội viên, nội dung..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-500"
        >
          <option value="">Tất cả bộ môn</option>
          {categories.map((cat) => (
            <option key={cat.publicId} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Master List Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">Hội viên</th>
                <th className="px-6 py-4">Đánh giá / Bộ môn</th>
                <th className="px-6 py-4 max-w-xs">Nhận xét</th>
                <th className="px-6 py-4">Dạng (Before/After)</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {isLoading && filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                      Đang tải danh sách...
                    </div>
                  </td>
                </tr>
              ) : filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Không tìm thấy phản hồi nào.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <tr key={fb.publicId} className="hover:bg-gray-50/50">
                    {/* Author block */}
                    <td className="px-6 py-4 max-w-[180px] break-words">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-500 to-purple-500 text-xs font-bold text-white uppercase">
                          {fb.avatar}
                        </div>
                        <span className="font-semibold text-gray-900 line-clamp-2" title={fb.name}>{fb.name}</span>
                      </div>
                    </td>
                    {/* Rating & Category */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: Math.round(fb.rating) }).map((_, idx) => (
                            <span key={idx}>★</span>
                          ))}
                        </div>
                        <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600 capitalize">
                          {getCategoryLabel(fb.serviceType)}
                        </span>
                      </div>
                    </td>
                    {/* Review text */}
                    <td className="px-6 py-4 max-w-xs truncate" title={fb.comment}>
                      {fb.comment}
                    </td>
                    {/* Before/After preview check */}
                    <td className="px-6 py-4">
                      {fb.beforeImage && fb.afterImage ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-8 w-8 overflow-hidden rounded bg-gray-100 border border-gray-200">
                            <img src={fb.beforeImage} alt="Before" className="h-full w-full object-cover" />
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="h-8 w-8 overflow-hidden rounded bg-gray-100 border border-gray-200">
                            <img src={fb.afterImage} alt="After" className="h-full w-full object-cover" />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">B/A</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Văn bản</span>
                      )}
                    </td>
                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(fb)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(fb.publicId, fb.name)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal toggle form */}
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        form={form}
        setForm={setForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editingId={editingId}
      />
    </div>
  );
}
