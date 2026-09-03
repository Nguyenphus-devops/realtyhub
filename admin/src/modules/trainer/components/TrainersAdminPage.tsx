"use client";

import { useMemo, useState } from "react";
import { usePermissions } from "@/context/PermissionsContext";
import { PermissionResource } from "@/modules/permission/types/permissions";
import { useAdminTrainers } from "../hooks/useAdminTrainers";
import type { AdminCreateTrainerInput, AdminTrainer } from "../models/trainer.model";
import TrainerModal from "./TrainerModal";
import { GroupIcon } from "@/icons";
import { useAdminServiceCategoriesPublic } from "@/modules/service-category/hooks/useAdminServiceCategoriesPublic";

const emptyForm = (): AdminCreateTrainerInput => ({
  name: "",
  birthDate: "",
  gender: "male",
  address: "",
  photoUrl: "",
  photoFile: null,
  serviceType: "gym",
  phone: "",
  experience: 0,
  specialties: "",
  certificates: "",
  bio: "",
});

const genderLabel: Record<AdminCreateTrainerInput["gender"], string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

const getTrainerPhotoSrc = (trainer: AdminTrainer) =>
  trainer.photoUrl || "https://via.placeholder.com/96x96.png?text=No+Image";

const TrainersAdminPage = () => {
  const { canCreate, canEdit, canDelete, canView } = usePermissions();
  const canViewTrainers = canView(PermissionResource.TRAINER);
  const canCreateTrainer = canCreate(PermissionResource.TRAINER);
  const canEditTrainer = canEdit(PermissionResource.TRAINER);
  const canDeleteTrainer = canDelete(PermissionResource.TRAINER);
  const showActionColumn = canEditTrainer || canDeleteTrainer;

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCreateTrainerInput>(emptyForm());
  const { categories } = useAdminServiceCategoriesPublic();

  const { listQuery, createMutation, updateMutation, removeMutation, seedSampleMutation } =
    useAdminTrainers();

  const trainers = useMemo(() => {
    const rows = listQuery.data ?? [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((item) =>
      `${item.name} ${item.address} ${item.serviceType} ${item.gender} ${item.phone ?? ""} ${item.specialties?.join(" ") ?? ""} ${item.certificates?.join(" ") ?? ""}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [listQuery.data, search]);

  if (!canViewTrainers) {
    return <div className="p-6 text-red-600">Bạn không có quyền xem mục này.</div>;
  }

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (trainer: AdminTrainer) => {
    setEditingId(trainer.publicId);
    setForm({
      name: trainer.name,
      birthDate: trainer.birthDate ? trainer.birthDate.slice(0, 10) : "",
      gender: trainer.gender,
      address: trainer.address,
      photoUrl: trainer.photoUrl ?? "",
      photoFile: null,
      serviceType: trainer.serviceType,
      phone: trainer.phone ?? "",
      experience: trainer.experience ?? 0,
      specialties: Array.isArray(trainer.specialties) ? trainer.specialties.join(", ") : "",
      certificates: Array.isArray(trainer.certificates) ? trainer.certificates.join(", ") : "",
      bio: trainer.bio ?? "",
    });
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(false);
  };

  const submitForm = (payload: AdminCreateTrainerInput) => {
    if (editingId) {
      updateMutation.mutate(
        { publicId: editingId, body: payload },
        { onSuccess: resetModal },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: resetModal });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#eadfd8] bg-gradient-to-br from-[#fffaf5] via-white to-[#fff3ea] p-6 shadow-[0_18px_60px_rgba(61,32,16,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c04040]/10 text-[#c04040]">
              <GroupIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#3d2010]">
                Quản lý huấn luyện viên
              </h1>
              <p className="text-sm text-[#7a6050]">
                Thêm, sửa và xóa thông tin huấn luyện viên theo từng loại dịch vụ.
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
                    "Bạn có muốn seed lại dữ liệu huấn luyện viên mẫu?",
                  )
                ) {
                  seedSampleMutation.mutate();
                }
              }}
              className="rounded-lg border border-[#eadfd8] bg-white px-4 py-2 text-sm font-medium text-[#7a6050] hover:bg-gray-50 disabled:opacity-50"
            >
              {seedSampleMutation.isPending
                ? "Đang seed..."
                : "Seed dữ liệu mẫu"}
            </button>
            {canCreateTrainer && (
              <button
                type="button"
                onClick={openCreateModal}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Thêm huấn luyện viên
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, địa chỉ, dịch vụ..."
            className="rounded-full border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040]"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#eadfd8] bg-white shadow-[0_16px_50px_rgba(61,32,16,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-[#fff7f1]">
              <tr className="text-left text-sm font-semibold text-[#3d2010]">
                <th className="px-6 py-4">Ảnh</th>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Điện thoại</th>
                <th className="px-6 py-4">Kinh nghiệm</th>
                <th className="px-6 py-4">Địa chỉ</th>
                <th className="px-6 py-4">Loại dịch vụ</th>
                {showActionColumn && (
                  <th className="px-6 py-4 text-center">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trainers.length === 0 ? (
                <tr>
                  <td
                    colSpan={showActionColumn ? 7 : 6}
                    className="px-6 py-12 text-center text-[#7a6050]"
                  >
                    Chưa có huấn luyện viên nào.
                  </td>
                </tr>
              ) : (
                trainers.map((trainer, index) => (
                  <tr key={trainer.publicId + index} className="hover:bg-[#fff7f1]">
                    <td className="px-6 py-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getTrainerPhotoSrc(trainer)}
                        alt={trainer.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-[#eadfd8]"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-[#3d2010]">
                      {trainer.name}
                    </td>
                    <td className="px-6 py-4 text-[#7a6050]">{trainer.phone || "—"}</td>
                    <td className="px-6 py-4 text-[#7a6050]">
                      {trainer.experience ? `${trainer.experience} năm` : "Chưa cập nhật"}
                    </td>
                    <td className="px-6 py-4 text-[#7a6050]">{trainer.address}</td>
                    <td className="px-6 py-4 text-[#7a6050]">
                      {categories.find((item) => item.slug === trainer.serviceType)?.name ?? trainer.serviceType}
                    </td>
                    {showActionColumn && (
                      <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                        {canEditTrainer && (
                          <button
                            type="button"
                            onClick={() => openEditModal(trainer)}
                            className="inline-flex rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                          >
                            Sửa
                          </button>
                        )}
                        {canDeleteTrainer && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Xóa huấn luyện viên này?")) {
                                removeMutation.mutate(trainer.publicId);
                              }
                            }}
                            className="inline-flex rounded-md bg-orange-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
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
      </section>

      <TrainerModal
        isOpen={isModalOpen}
        onClose={resetModal}
        onSubmit={submitForm}
        form={form}
        setForm={setForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editingId={editingId}
        trainers={listQuery.data ?? []}
      />
    </div>
  );
};

export default TrainersAdminPage;
