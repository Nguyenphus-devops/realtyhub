"use client";

import { useEffect, useState } from "react";
import type {
  AdminCreateServicePackageInput,
  ServicePackageCategory,
} from "../models/service-package.model";
import { useAdminServiceCategoriesPublic } from "@/modules/service-category/hooks/useAdminServiceCategoriesPublic";
import { useAdminTrainersPublic } from "@/modules/trainer/hooks/useAdminTrainersPublic";

interface ServicePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCreateServicePackageInput) => void;
  form: AdminCreateServicePackageInput;
  setForm: React.Dispatch<React.SetStateAction<AdminCreateServicePackageInput>>;
  isLoading: boolean;
  editingId: string | null;
}


const ServicePackageModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isLoading,
  editingId,
}: ServicePackageModalProps) => {
  const { categories } = useAdminServiceCategoriesPublic();
  const { trainers, loading: trainersLoading } = useAdminTrainersPublic();
  const [featuresInput, setFeaturesInput] = useState("");
  const [hideDuration, setHideDuration] = useState(false);

  const selectedCategory = categories.find((c) => c.slug === form.category);
  const isIndividual = selectedCategory ? selectedCategory.type === "individual" : true;
  const isClass = selectedCategory ? selectedCategory.type === "class" : false;
  const hideClassroom = ["yoga", "dance"].includes(form.category);

  useEffect(() => {
    if (hideClassroom && form.classroom) {
      setForm((previous) => ({ ...previous, classroom: "" }));
    }
  }, [hideClassroom, form.classroom, setForm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFeaturesInput("");
      setHideDuration(Boolean(editingId) && !form.serviceDuration?.trim());
    } else {
      document.body.style.overflow = "unset";
      setHideDuration(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
    // Chỉ khởi tạo lại khi modal đóng/mở; thay đổi thời hạn trong form không được
    // ghi đè lựa chọn "Không hiển thị" hiện tại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    const trimmed = featuresInput.trim();
    if (trimmed) {
      // Check if it already exists to avoid duplicates
      if (form.features?.includes(trimmed)) {
        setFeaturesInput("");
        return;
      }
      setForm((prev) => ({
        ...prev,
        features: [...(prev.features ?? []), trimmed],
      }));
      setFeaturesInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let finalFeatures = form.features ?? [];
    const trimmedInput = featuresInput.trim();
    if (trimmedInput && !finalFeatures.includes(trimmedInput)) {
      finalFeatures = [...finalFeatures, trimmedInput];
      setFeaturesInput("");
    }

    onSubmit({
      ...form,
      features: finalFeatures,
      imageUrl: form.imageUrl || "/images/logo/X%20Logo_.png",
    });
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const isContactPrice = !form.basePrice && Boolean(form.priceLabel);

  const handleContactPriceChange = (checked: boolean) => {
    if (checked) {
      setForm((p) => ({
        ...p,
        priceLabel: "Liên hệ để biết giá",
        basePrice: undefined,
      }));
    } else {
      setForm((p) => ({
        ...p,
        priceLabel: "",
        basePrice: undefined,
      }));
    }
  };

  // ── Duration: chọn số lượng + đơn vị ─────────────────────────────────
  const DURATION_UNITS = ["buổi", "ngày", "tháng", "năm"] as const;
  type DurationUnit = typeof DURATION_UNITS[number];

  // Parse giá trị serviceDuration hiện tại (ví dụ: "10 buổi" → { qty: 10, unit: "buổi" })
  const parseDuration = (val: string | undefined): { qty: string; unit: DurationUnit } => {
    if (!val) return { qty: "", unit: "tháng" };
    const match = val.trim().match(/^(\d+)\s*(.+)$/);
    if (match) {
      const unit = match[2].trim() as DurationUnit;
      if (DURATION_UNITS.includes(unit as DurationUnit)) {
        return { qty: match[1], unit };
      }
    }
    return { qty: val, unit: "tháng" }; // fallback
  };

  const { qty: durationQty, unit: durationUnit } = parseDuration(form.serviceDuration);

  const handleDurationChange = (qty: string, unit: DurationUnit) => {
    const combined = qty ? `${qty} ${unit}` : "";
    setForm((p) => ({ ...p, serviceDuration: combined }));
  };

  const handleDurationUnitChange = (value: string) => {
    if (value === "hidden") {
      setHideDuration(true);
      setForm((p) => ({ ...p, serviceDuration: "" }));
      return;
    }

    setHideDuration(false);
    handleDurationChange(durationQty, value as DurationUnit);
  };



  const weekDays = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const handleDayToggle = (day: string) => {
    const currentDays = form.classDays ?? [];
    const nextDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setForm((p) => ({
      ...p,
      classDays: nextDays,
      classTime: p.classTime || (nextDays.length > 0 ? "18:30 - 19:30" : ""),
    }));
  };

  const [classStart, classEnd] = form.classTime
    ? form.classTime.split("-").map((s) => s.trim())
    : ["18:30", "19:30"];

  const handleClassTimeChange = (start: string, end: string) => {
    setForm((p) => ({ ...p, classTime: `${start} - ${end}` }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? "Cập nhật gói dịch vụ" : "Tạo gói dịch vụ mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên gói <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Ví dụ: Gói thành viên Vàng"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                rows={4}
                placeholder="Mô tả chi tiết về gói dịch vụ..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Danh mục dịch vụ <span className="text-red-500">*</span>
              </label>
              <select
                value={(() => {
                  const found = categories.find(
                    (c) => c.slug === form.category,
                  );
                  return found?.name ?? form.category;
                })()}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const found = categories.find((c) => c.name === selectedName);
                  const newCatSlug = (found?.slug ??
                    form.category) as ServicePackageCategory;

                  setForm((p) => {
                    const next = { ...p, category: newCatSlug };
                    const type = found?.type ?? "individual";
                    if (type === "individual") {
                      next.minGuests = undefined;
                      next.maxGuests = undefined;
                      next.classDays = [];
                      next.classTime = "";
                      next.instructor = "";
                      next.classroom = "";
                    } else if (type === "class") {
                      next.minGuests = undefined;
                      next.venueScope = "";
                    }
                    return next;
                  });
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {categories.map((item) => (
                  <option key={item.publicId} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Thời hạn gói <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {/* Ô nhập số lượng */}
                <input
                  type="number"
                  required={!hideDuration}
                  disabled={hideDuration}
                  min={1}
                  value={durationQty}
                  onChange={(e) => handleDurationChange(e.target.value, durationUnit)}
                  className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="VD: 10"
                />
                {/* Chọn đơn vị */}
                <select
                  value={hideDuration ? "hidden" : durationUnit}
                  onChange={(e) => handleDurationUnitChange(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="buổi">📅 Buổi</option>
                  <option value="ngày">🗓️ Ngày</option>
                  <option value="tháng">📆 Tháng</option>
                  <option value="năm">⭐ Năm</option>
                  <option value="hidden">🚫 Không hiển thị</option>
                </select>
              </div>
              {/* Preview kết quả */}
              {!hideDuration && durationQty && (
                <p className="mt-1 text-xs text-gray-400">
                  ↪ Lưu dưới dạng: <span className="font-medium text-gray-600">{durationQty} {durationUnit}</span>
                </p>
              )}
            </div>

            <div className="md:col-span-2 border-t border-gray-100 pt-3 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isContactPrice}
                  onChange={(e) => handleContactPriceChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  Hiển thị &quot;Liên hệ để biết giá&quot; (Ẩn giá gốc)
                </span>
              </label>

              <div className={isIndividual ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {!isContactPrice ? (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Giá cố định (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={form.basePrice ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          basePrice: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="Ví dụ: 500000"
                    />
                  </div>
                ) : (
                  // Render empty div only if maxGuests is also rendered to maintain column structure
                  !isIndividual && <div />
                )}

                {!isIndividual && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {isClass ? "Sức chứa tối đa (Khách)" : "Số thành viên tối đa"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={form.maxGuests ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          maxGuests: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="Ví dụ: 15"
                    />
                  </div>
                )}
              </div>
            </div>



            {isClass && (
                <div className="md:col-span-2 border-t border-gray-100 pt-3 grid gap-4 md:grid-cols-2">
                  {!hideClassroom && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Địa điểm (Phòng học) <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.classroom ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, classroom: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="" disabled>
                          -- Chọn phòng học --
                        </option>
                        <option value="Phòng Yoga Studio 1">
                          Phòng Yoga Studio 1
                        </option>
                        <option value="Phòng Studio 2">Phòng Studio 2</option>
                        <option value="Khu vực Kickboxing">
                          Khu vực Kickboxing
                        </option>
                        <option value="Phòng Group X">Phòng Group X</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Huấn luyện viên (PT/Instructor)
                    </label>
                    <select
                      value={form.instructor ?? ""}
                      disabled={trainersLoading}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, instructor: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="">
                        {trainersLoading
                          ? "-- Đang tải huấn luyện viên --"
                          : "-- Chưa phân công --"}
                      </option>
                      {form.instructor &&
                        !trainers.some(
                          (trainer) => trainer.name === form.instructor,
                        ) && (
                          <option value={form.instructor}>
                            {form.instructor}
                          </option>
                        )}
                      {trainers.map((trainer) => (
                        <option
                          key={trainer.publicId}
                          value={trainer.name}
                        >
                          {trainer.name}
                          {trainer.serviceType
                            ? ` (${trainer.serviceType})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Lịch học cố định (Thứ trong tuần & Giờ học){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1 mb-3">
                      {weekDays.map((day) => {
                        const isSelected = form.classDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${isSelected
                              ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                    {form.classDays && form.classDays.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Thời gian:</span>
                        <input
                          type="time"
                          value={classStart || "18:30"}
                          onChange={(e) =>
                            handleClassTimeChange(
                              e.target.value,
                              classEnd || "19:30",
                            )
                          }
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        <span className="text-gray-500">đến</span>
                        <input
                          type="time"
                          value={classEnd || "19:30"}
                          onChange={(e) =>
                            handleClassTimeChange(
                              classStart || "18:30",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}



            <div className="md:col-span-2 border-t border-gray-100 pt-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Dịch vụ đi kèm / Tiện ích
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Nhập tiện ích (ví dụ: Nước uống miễn phí)"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* List of features displayed as tags */}
              {form.features && form.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="rounded-full p-0.5 hover:bg-brand-100 hover:text-brand-900 transition-colors focus:outline-none"
                      >
                        <svg
                          className="h-3 w-3"
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
                    </span>
                  ))}
                </div>
              )}
            </div>



            <div className="md:col-span-2 space-y-2 border-t border-gray-100 pt-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured ?? false}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium text-gray-700">Gói nổi bật</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive ?? true}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium text-gray-700">
                  Hiển thị trên website
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isLoading
                ? "Đang xử lý..."
                : editingId
                  ? "Lưu thay đổi"
                  : "Tạo gói dịch vụ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicePackageModal;
