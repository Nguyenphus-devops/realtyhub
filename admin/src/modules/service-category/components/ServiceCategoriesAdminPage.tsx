"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";
import { useAdminServiceCategories } from "../hooks/useAdminServiceCategories";
import type {
  AdminCreateServiceCategoryInput,
  AdminServiceCategory,
} from "../models/service-category.model";

const emptyForm = (): AdminCreateServiceCategoryInput => ({
  name: "",
  slug: "",
  type: "individual",
  isActive: true,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SYSTEM_SERVICE_SLUGS = new Set([
  "membership",
  "groupx",
  "dance_kid",
  "dance",
  "pt",
  "massage",
  "kickboxing",
  "yoga",
  "gym",
]);

const isSystemService = (slug: string) =>
  SYSTEM_SERVICE_SLUGS.has(slug.trim().toLowerCase());

const ServiceCategoriesAdminPage = () => {
  const { canCreate, canEdit, canDelete, canView } = usePermissions();
  const canViewPage = canView(PermissionResource.SERVICE_CATEGORY);
  const canCreateItem = canCreate(PermissionResource.SERVICE_CATEGORY);
  const canEditItem = canEdit(PermissionResource.SERVICE_CATEGORY);
  const canDeleteItem = canDelete(PermissionResource.SERVICE_CATEGORY);
  const showActionColumn = canEditItem || canDeleteItem;

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCreateServiceCategoryInput>(emptyForm());
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { listQuery, createMutation, updateMutation, removeMutation } =
    useAdminServiceCategories();

  const rows = useMemo(() => {
    const rawRows = listQuery.data ?? [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rawRows;
    return rawRows.filter((item) =>
      `${item.name} ${item.slug}`.toLowerCase().includes(keyword),
    );
  }, [listQuery.data, search]);

  const formErrors = useMemo(() => {
    const errors: { name?: string; slug?: string } = {};
    const nameTrim = form.name.trim();

    if (!nameTrim) {
      errors.name = "Tên loại dịch vụ không được để trống.";
    } else {
      const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
      if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
        errors.name = "Tên loại dịch vụ không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).";
      } else {
        const cleanSlug = slugify(nameTrim);
        if (!cleanSlug) {
          errors.name = "Tên loại dịch vụ không được để trống hoặc chỉ chứa ký tự đặc biệt.";
        } else {
          const isDuplicateName = rows.some(
            (cat) =>
              cat.publicId !== editingId &&
              (cat.name || "").trim().toLowerCase() === nameTrim.toLowerCase(),
          );
          if (isDuplicateName) {
            errors.name = "Tên loại dịch vụ này đã tồn tại trong hệ thống.";
          }
        }
      }
    }

    const currentSlug = (form.slug || slugify(form.name)).trim().toLowerCase();
    if (currentSlug) {
      const SLUG_REGEX = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
      if (!SLUG_REGEX.test(currentSlug)) {
        errors.slug = "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang/dưới.";
      } else {
        const isDuplicateSlug = rows.some(
          (cat) =>
            cat.publicId !== editingId &&
            (cat.slug || "").trim().toLowerCase() === currentSlug,
        );
        if (isDuplicateSlug) {
          errors.slug = "Slug này đã tồn tại trong hệ thống.";
        }
      }
    }

    return errors;
  }, [form.name, form.slug, editingId, rows]);

  if (!canViewPage) {
    return <div className="p-6 text-red-600">Bạn không có quyền xem mục này.</div>;
  }

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsAutoSlug(true);
    setIsModalOpen(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsAutoSlug(true);
    setIsModalOpen(true);
  };

  const openEdit = (item: AdminServiceCategory) => {
    setEditingId(item.publicId);
    setForm({
      name: item.name,
      slug: item.slug,
      type: item.type || "individual",
      isActive: item.isActive,
    });
    setIsAutoSlug(false);
    setIsModalOpen(true);
  };

  const submitForm = () => {
    if (formErrors.name || formErrors.slug) {
      toast.error(formErrors.name || formErrors.slug);
      return;
    }

    const nameTrim = form.name.trim();
    const computedSlug = slugify(form.slug || form.name);

    const payload = {
      ...form,
      name: nameTrim,
      slug: computedSlug,
    };

    if (editingId) {
      updateMutation.mutate(
        { publicId: editingId, body: payload },
        { onSuccess: resetForm },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: resetForm });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="rounded-[28px] border border-[#eadfd8] bg-gradient-to-br from-[#fffaf5] via-white to-[#fff3ea] p-6 shadow-[0_18px_60px_rgba(61,32,16,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#3d2010]">
              Quản lý loại dịch vụ
            </h1>
            <p className="text-sm text-[#7a6050]">
              Thêm, sửa và xóa các loại dịch vụ dùng chung cho toàn bộ combobox.
            </p>
          </div>
          {canCreateItem && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm loại dịch vụ
            </button>
          )}
        </div>

        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc slug..."
            className="w-full rounded-full border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040]"
          />
        </div>
      </section>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-[28px] border border-[#eadfd8] bg-white shadow-[0_16px_50px_rgba(61,32,16,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-[#fff7f1]">
              <tr className="text-left text-sm font-semibold text-[#3d2010]">
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Hình thức</th>
                <th className="px-6 py-4">Trạng thái</th>
                {showActionColumn && <th className="px-6 py-4 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={showActionColumn ? 5 : 4}
                    className="px-6 py-12 text-center text-[#7a6050]"
                  >
                    Chưa có loại dịch vụ nào.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.publicId} className="hover:bg-[#fff7f1]">
                    <td className="px-6 py-4 font-medium text-[#3d2010]">{item.name}</td>
                    <td className="px-6 py-4 text-[#7a6050]">{item.slug}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.type === "class"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.type === "class" ? "Lớp học" : "Cá nhân"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.isActive ? "Đang hoạt động" : "Đã ẩn"}
                      </span>
                    </td>
                    {showActionColumn && (
                      <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                        {canEditItem && (
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="inline-flex w-20 justify-center rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                          >
                            Sửa
                          </button>
                        )}
                        {canDeleteItem && !isSystemService(item.slug) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Xóa loại dịch vụ "${item.name}"?`)) {
                                removeMutation.mutate(item.publicId);
                              }
                            }}
                            className="inline-flex w-20 justify-center rounded-md bg-orange-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
                          >
                            Xóa
                          </button>
                        )}
                        {canDeleteItem && isSystemService(item.slug) && (
                          <span className="inline-flex w-20 justify-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-500">
                            Cố định
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal tạo / sửa ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-[#3d2010]">
                {editingId ? "Cập nhật loại dịch vụ" : "Thêm loại dịch vụ mới"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">
                  Tên loại dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setForm((p) => ({
                      ...p,
                      name: newName,
                      slug: isAutoSlug ? slugify(newName) : p.slug,
                    }));
                  }}
                  placeholder="Ví dụ: Yoga, Kickboxing..."
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#3d2010] outline-none transition ${
                    form.name.trim() && formErrors.name
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/10"
                      : "border-[#eadfd8] focus:border-[#c04040] focus:ring-2 focus:ring-[#c04040]/10"
                  }`}
                />
                {form.name.trim() && formErrors.name ? (
                  <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">Slug</label>
                <input
                  value={form.slug}
                  disabled={Boolean(
                    editingId &&
                    rows.some(
                      (item) =>
                        item.publicId === editingId && isSystemService(item.slug),
                    ),
                  )}
                  onChange={(e) => {
                    setIsAutoSlug(false);
                    setForm((p) => ({ ...p, slug: e.target.value }));
                  }}
                  placeholder="Tự động tạo từ tên"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#7a6050] outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
                    formErrors.slug
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/10"
                      : "border-[#eadfd8] focus:border-[#c04040] focus:ring-2 focus:ring-[#c04040]/10"
                  }`}
                />
                {formErrors.slug ? (
                  <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.slug}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    {editingId && rows.some(
                      (item) => item.publicId === editingId && isSystemService(item.slug),
                    )
                      ? "Slug của dịch vụ hệ thống được khóa để bảo vệ liên kết website."
                      : "Slug được dùng làm định danh kỹ thuật, không dấu."}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">
                  Hình thức tập luyện <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      type: e.target.value as "individual" | "class",
                    }))
                  }
                  className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-2.5 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:ring-2 focus:ring-[#c04040]/10"
                >
                  <option value="individual">Cá nhân (Thẻ hội viên, PT 1-1, Massage...)</option>
                  <option value="class">Lớp học (Yoga, Boxing, Dance...)</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#3d2010]">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Kích hoạt (hiển thị trong danh sách)
              </label>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-[#eadfd8] px-4 py-2 text-sm font-medium text-[#3d2010] hover:bg-[#fff7f1]"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmitting || Boolean(formErrors.name) || Boolean(formErrors.slug)}
                onClick={submitForm}
                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 disabled:opacity-50"
              >
                {isSubmitting ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCategoriesAdminPage;
