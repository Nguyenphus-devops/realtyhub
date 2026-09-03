"use client";

import { useMemo, useState } from "react";
import { BoxCubeIcon } from "@/icons";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";
import { useAdminServicePackages } from "../hooks/useAdminServicePackages";
import type {
  AdminCreateServicePackageInput,
  AdminServicePackage,
  ServicePackageCategory,
} from "../models/service-package.model";
import { SERVICE_PACKAGE_CATEGORIES } from "../models/service-package.model";
import ServicePackageModal from "./ServicePackageModal";
import { useAdminServiceCategoriesPublic } from "@/modules/service-category/hooks/useAdminServiceCategoriesPublic";

type StatusFilter = "all" | "active" | "hidden";

// category label will be resolved dynamically from service-categories (public)
// (UI yêu cầu hiển thị theo name, backend vẫn dùng slug)

const emptyForm = (): AdminCreateServicePackageInput => ({
  name: "",
  description: "",
  priceLabel: "",
  imageUrl: "",
  category: "gym",
  features: [],
  minGuests: undefined,
  maxGuests: undefined,
  serviceDuration: "",
  venueScope: "",
  defaultMenu: "",
  classDays: [],
  classTime: "",
  instructor: "",
  classroom: "",
  isFeatured: false,
  isActive: true,
});

const toForm = (
  servicePackage: AdminServicePackage,
): AdminCreateServicePackageInput => ({
  name: servicePackage.name,
  description: servicePackage.description,
  priceLabel: servicePackage.priceLabel,
  basePrice: servicePackage.basePrice ?? undefined,
  imageUrl: servicePackage.imageUrl,
  category: servicePackage.category,
  features: servicePackage.features,
  minGuests: servicePackage.minGuests ?? undefined,
  maxGuests: servicePackage.maxGuests ?? undefined,
  serviceDuration: servicePackage.serviceDuration,
  venueScope: servicePackage.venueScope,
  defaultMenu: servicePackage.defaultMenu,
  classDays: servicePackage.classDays ?? [],
  classTime: servicePackage.classTime ?? "",
  instructor: servicePackage.instructor ?? "",
  classroom: servicePackage.classroom ?? "",
  isFeatured: servicePackage.isFeatured,
  isActive: servicePackage.isActive,
  sortOrder: servicePackage.sortOrder,
});

const ServicePackagesAdminPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCreateServicePackageInput>(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canCreate, canEdit, canDelete } = usePermissions();
  const showActionColumn =
    canEdit(PermissionResource.SERVICE_PACKAGE) ||
    canDelete(PermissionResource.SERVICE_PACKAGE);

  const { categories } = useAdminServiceCategoriesPublic();

  const getCategoryLabel = (slug: string) => {
    const found = categories.find((c) => c.slug === slug);
    return found?.name || slug;
  };

  const isIndividualCategory = (slug: string) => {
    const found = categories.find((c) => c.slug === slug);
    return found ? found.type === "individual" : true;
  };

  const queryCategory = categoryFilter === "all" ? undefined : categoryFilter;
  const queryIsActive =
    statusFilter === "all" ? undefined : statusFilter === "active";

  const {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
    reorderMutation,
    seedSampleMutation,
  } = useAdminServicePackages({
    category: queryCategory,
    isActive: queryIsActive,
  });

  const rows = useMemo(() => {
    const rawRows = listQuery.data ?? [];
    const keyword = search.trim().toLowerCase();
    const filteredRows = keyword
      ? rawRows.filter((item) =>
          `${item.name} ${item.description} ${item.category}`
            .toLowerCase()
            .includes(keyword),
        )
      : rawRows;
    return [...filteredRows].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [listQuery.data, search]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminServicePackage) => {
    setEditingId(item.publicId);
    setForm(toForm(item));
    setIsModalOpen(true);
  };

  const submitForm = (data: AdminCreateServicePackageInput) => {
    const normalizedPayload = {
      ...data,
      priceLabel: data.priceLabel?.trim() || undefined,
      basePrice:
        data.basePrice === undefined ? undefined : Number(data.basePrice),
      features: (data.features ?? []).filter((item) => item.trim().length > 0),
      serviceDuration: data.serviceDuration?.trim() || undefined,
      venueScope: data.venueScope?.trim() || undefined,
      defaultMenu: data.defaultMenu?.trim() || undefined,
      classDays: data.classDays ?? [],
      classTime: data.classTime?.trim() || undefined,
      instructor: data.instructor?.trim() || undefined,
      classroom: data.classroom?.trim() || undefined,
    };

    if (editingId) {
      updateMutation.mutate(
        { publicId: editingId, body: normalizedPayload },
        { onSuccess: () => resetForm() },
      );
      return;
    }

    createMutation.mutate(normalizedPayload, {
      onSuccess: () => resetForm(),
    });
  };

  const moveRow = (currentIndex: number, delta: number) => {
    const targetIndex = currentIndex + delta;
    if (targetIndex < 0 || targetIndex >= rows.length) {
      return;
    }
    const next = [...rows];
    const item = next[currentIndex];
    next[currentIndex] = next[targetIndex] as AdminServicePackage;
    next[targetIndex] = item as AdminServicePackage;
    reorderMutation.mutate(next.map((entry) => entry.publicId));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <BoxCubeIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Quản lý gói dịch vụ
              </h1>
              <p className="text-sm text-gray-500">
                Quản lý và thiết lập gói dịch vụ theo các danh mục dịch vụ.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={seedSampleMutation.isPending}
              onClick={() => {
                if (
                  window.confirm(
                    "Bạn có muốn seed lại dữ liệu mẫu cho các dịch vụ?",
                  )
                ) {
                  seedSampleMutation.mutate();
                }
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {seedSampleMutation.isPending
                ? "Đang seed..."
                : "Seed dữ liệu mẫu"}
            </button>
            {canCreate(PermissionResource.SERVICE_PACKAGE) && (
              <button
                type="button"
                onClick={openCreateModal}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Tạo gói mới
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên hoặc mô tả..."
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="all">Tất cả danh mục dịch vụ</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hiển thị</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Gói dịch vụ</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Khách</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Trạng thái</th>
                {showActionColumn && (
                  <th className="px-6 py-4 text-center">Thao tác</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.map((item, index) => (
                <tr
                  key={item.publicId}
                  className="transition duration-200 hover:bg-gray-50"
                >
                  {/* Gói dịch vụ */}
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>

                      <p className="line-clamp-2 text-xs text-gray-500">
                        {item.description || "Không có mô tả"}
                      </p>
                    </div>
                  </td>

                  {/* Danh mục */}
                  <td className="px-6 py-5">
                    <span
                      className="
                  inline-flex items-center rounded-full
                  bg-blue-50 px-3 py-1
                  text-xs font-medium text-blue-700
                "
                    >
                      {getCategoryLabel(item.category)}
                    </span>
                  </td>

                  {/* Khách */}
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-700">
                      {isIndividualCategory(item.category)
                        ? "Không áp dụng"
                        : item.maxGuests
                          ? `${item.maxGuests} người`
                          : "Không giới hạn"}
                    </span>
                  </td>

                  {/* Giá */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-brand-600">
                        {(item.basePrice?.toLocaleString("vi-VN") ??
                          item.priceLabel) ||
                          "-"}
                        đ
                      </span>

                      <span className="text-xs text-gray-400">Giá dịch vụ</span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium
      ${
        item.isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600"
      }`}
                      >
                        {item.isActive ? "Hiển thị" : "Đã ẩn"}
                      </span>

                      {item.isFeatured && (
                        <span
                          className="
          inline-flex items-center gap-1
          whitespace-nowrap
          rounded-full
          bg-amber-50
          px-4 py-2
          text-sm
          font-medium
          text-amber-700
        "
                        >
                          ⭐ Nổi bật
                        </span>
                      )}
                    </div>
                  </td>

                  {showActionColumn && (
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        {canEdit(PermissionResource.SERVICE_PACKAGE) && (
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="
                      rounded-xl
                      bg-blue-50
                      px-4 py-2
                      text-sm font-medium
                      text-blue-600
                      transition
                      hover:bg-blue-100
                    "
                          >
                            Sửa
                          </button>
                        )}

                        {canDelete(PermissionResource.SERVICE_PACKAGE) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Xóa gói dịch vụ này?")) {
                                removeMutation.mutate(item.publicId);
                              }
                            }}
                            className="
                      rounded-xl
                      bg-red-50
                      px-4 py-2
                      text-sm font-medium
                      text-red-600
                      transition
                      hover:bg-red-100
                    "
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {!listQuery.isLoading && rows.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              Chưa có gói dịch vụ phù hợp bộ lọc.
            </div>
          )}
        </div>
      </section>

      <ServicePackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitForm}
        form={form}
        setForm={setForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editingId={editingId}
      />
    </div>
  );
};

export default ServicePackagesAdminPage;
