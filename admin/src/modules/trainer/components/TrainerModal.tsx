"use client";

import { useEffect, useState, useMemo } from "react";
import type React from "react";
import type { AdminCreateTrainerInput, AdminTrainer } from "../models/trainer.model";
import { useAdminServiceCategoriesPublic } from "@/modules/service-category/hooks/useAdminServiceCategoriesPublic";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCreateTrainerInput) => void;
  form: AdminCreateTrainerInput;
  setForm: React.Dispatch<React.SetStateAction<AdminCreateTrainerInput>>;
  isLoading: boolean;
  editingId: string | null;
  trainers?: AdminTrainer[];
};

const INVALID_NAME_CHARS_REGEX = /[!@#$%^&*+=<>?;:{}|\\~`"']/;
const PHONE_REGEX = /^0[0-9]{9}$/;

const TrainerModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isLoading,
  editingId,
  trainers,
}: Props) => {
  const { categories } = useAdminServiceCategoriesPublic();
  const [certInput, setCertInput] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const formErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // 1. Name
    const nameTrim = (form.name || "").trim();
    if (!nameTrim) {
      errors.name = "Tên huấn luyện viên không được để trống.";
    } else if (INVALID_NAME_CHARS_REGEX.test(nameTrim)) {
      errors.name = "Tên huấn luyện viên không được chứa các ký tự đặc biệt (như !@#$%^&*<>...).";
    }

    // 2. BirthDate
    if (!form.birthDate) {
      errors.birthDate = "Ngày sinh không được để trống.";
    } else {
      const birth = new Date(form.birthDate);
      if (isNaN(birth.getTime())) {
        errors.birthDate = "Ngày sinh không hợp lệ.";
      } else {
        const now = new Date();
        const age = (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18) {
          errors.birthDate = "Huấn luyện viên phải từ 18 tuổi trở lên (ngày sinh không hợp lệ).";
        }
      }
    }

    // 3. Address
    if (!(form.address || "").trim()) {
      errors.address = "Địa chỉ không được để trống.";
    }

    // 4. Phone
    const phoneClean = (form.phone || "").replace(/[\s-]/g, "").trim();
    if (!phoneClean) {
      errors.phone = "Số điện thoại không được để trống.";
    } else if (!PHONE_REGEX.test(phoneClean)) {
      errors.phone = "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và gồm 10 chữ số).";
    }

    // 5. Experience
    const expNum = Number(form.experience);
    if (form.experience === undefined || form.experience === null || isNaN(expNum) || expNum < 0 || expNum > 60) {
      errors.experience = "Kinh nghiệm thực tế phải là số từ 0 đến 60 năm.";
    }

    return errors;
  }, [form, editingId, trainers]);

  const addCertificate = () => {
    const trimmed = certInput.trim();
    if (!trimmed) return;

    const currentCerts = Array.isArray(form.certificates)
      ? form.certificates
      : typeof form.certificates === "string"
      ? form.certificates.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    if (!currentCerts.includes(trimmed)) {
      setForm((p) => ({
        ...p,
        certificates: [...currentCerts, trimmed],
      }));
    }
    setCertInput("");
  };

  const removeCertificate = (indexToRemove: number) => {
    const currentCerts = Array.isArray(form.certificates)
      ? form.certificates
      : typeof form.certificates === "string"
      ? form.certificates.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    setForm((p) => ({
      ...p,
      certificates: currentCerts.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleCertKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertificate();
    }
  };

  const addSpecialty = () => {
    const trimmed = specialtyInput.trim();
    if (!trimmed) return;

    const currentSpecialties = Array.isArray(form.specialties)
      ? form.specialties
      : typeof form.specialties === "string"
      ? form.specialties.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (!currentSpecialties.includes(trimmed)) {
      setForm((p) => ({
        ...p,
        specialties: [...currentSpecialties, trimmed],
      }));
    }
    setSpecialtyInput("");
  };

  const removeSpecialty = (indexToRemove: number) => {
    const currentSpecialties = Array.isArray(form.specialties)
      ? form.specialties
      : typeof form.specialties === "string"
      ? form.specialties.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    setForm((p) => ({
      ...p,
      specialties: currentSpecialties.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSpecialtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialty();
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(formErrors).length > 0) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }
    onSubmit(form);
  };

  const handlePhotoChange = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((p) => ({ ...p, photoUrl: result, photoFile: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[28px] border border-[#eadfd8] bg-white shadow-[0_30px_120px_rgba(61,32,16,0.15)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#eadfd8] bg-gradient-to-r from-white via-[#fffaf5] to-[#fff3ea] px-6 py-4 flex-shrink-0">
          <h2 className="text-xl font-semibold tracking-tight text-[#3d2010]">
            {editingId ? "Cập nhật huấn luyện viên" : "Thêm huấn luyện viên"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eadfd8] bg-white/50 text-[#7a6050] transition hover:border-[#c04040]/30 hover:bg-[#c04040]/5 hover:text-[#c04040] font-black text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 text-[#3d2010] space-y-4 bg-white overflow-y-auto flex-1">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">Ảnh chân dung chuyên nghiệp</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#eadfd8] bg-[#fffaf5]">
                {form.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.photoUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#7a6050]/50">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center rounded-full bg-[#c04040]/10 px-4 py-2 text-sm font-medium text-[#c04040] transition hover:bg-[#c04040]/20 hover:text-[#8b3030]">
                Chọn ảnh từ máy
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                />
              </label>
              {form.photoUrl && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, photoUrl: "", photoFile: null }))}
                  className="text-sm text-[#7a6050]/70 hover:text-[#c04040] transition"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name || ""}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ví dụ: Nguyễn Văn A"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition ${
                (submitted || (form.name || "").length > 0) && formErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#eadfd8] focus:border-[#c04040]"
              }`}
            />
            {(submitted || (form.name || "").length > 0) && formErrors.name ? (
              <p className="mt-1 text-xs font-medium text-red-500">{formErrors.name}</p>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#7a6050]">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.birthDate || ""}
                onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition ${
                  (submitted || (form.birthDate || "").length > 0) && formErrors.birthDate
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#eadfd8] focus:border-[#c04040]"
                }`}
              />
              {(submitted || (form.birthDate || "").length > 0) && formErrors.birthDate ? (
                <p className="mt-1 text-xs font-medium text-red-500">{formErrors.birthDate}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#7a6050]">Giới tính</label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gender: e.target.value as AdminCreateTrainerInput["gender"] }))
                }
                className="w-full rounded-2xl border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:bg-[#fffaf5]/10"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              value={form.address || ""}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              placeholder="Ví dụ: Quận 7, TP.HCM"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition ${
                (submitted || (form.address || "").length > 0) && formErrors.address
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#eadfd8] focus:border-[#c04040]"
              }`}
            />
            {(submitted || (form.address || "").length > 0) && formErrors.address ? (
              <p className="mt-1 text-xs font-medium text-red-500">{formErrors.address}</p>
            ) : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">
              Loại dịch vụ <span className="text-red-500">*</span>
            </label>
            <select
              value={form.serviceType || ""}
              onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value }))}
              className="w-full rounded-2xl border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:bg-[#fffaf5]/10"
            >
              {categories.map((item) => (
                <option key={item.publicId} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#7a6050]">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Ví dụ: 0987654321"
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition ${
                  (submitted || (form.phone || "").length > 0) && formErrors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#eadfd8] focus:border-[#c04040]"
                }`}
              />
              {(submitted || (form.phone || "").length > 0) && formErrors.phone ? (
                <p className="mt-1 text-xs font-medium text-red-500">{formErrors.phone}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#7a6050]">
                Kinh nghiệm thực tế (năm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={form.experience}
                onChange={(e) => setForm((p) => ({ ...p, experience: Number(e.target.value) }))}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition ${
                  submitted && formErrors.experience
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#eadfd8] focus:border-[#c04040]"
                }`}
              />
              {submitted && formErrors.experience ? (
                <p className="mt-1 text-xs font-medium text-red-500">{formErrors.experience}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">Thế mạnh huấn luyện</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={handleSpecialtyKeyDown}
                placeholder="Nhập thế mạnh rồi nhấn Enter hoặc nút +"
                className="flex-1 rounded-2xl border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:bg-[#fffaf5]/10"
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="flex items-center justify-center rounded-2xl bg-brand-500 px-5 text-white font-bold text-lg hover:bg-brand-600 transition shrink-0"
              >
                +
              </button>
            </div>
            
            {/* Specialties Tag List */}
            {(() => {
              const specialtiesArray = Array.isArray(form.specialties)
                ? form.specialties
                : typeof form.specialties === "string"
                ? form.specialties.split(",").map((s) => s.trim()).filter(Boolean)
                : [];
              
              if (specialtiesArray.length === 0) return null;
              
              return (
                <div className="mt-3 flex flex-wrap gap-2">
                  {specialtiesArray.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 rounded-full bg-[#f0f7ff] border border-[#dbeafe] px-3.5 py-1.5 text-sm text-[#1e40af] font-medium animate-in fade-in duration-200"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecialty(index)}
                        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-[#1e40af]/10 text-xs font-bold leading-none text-[#1e40af]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">Chứng chỉ chuyên môn</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={handleCertKeyDown}
                placeholder="Nhập chứng chỉ rồi nhấn Enter hoặc nút +"
                className="flex-1 rounded-2xl border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:bg-[#fffaf5]/10"
              />
              <button
                type="button"
                onClick={addCertificate}
                className="flex items-center justify-center rounded-2xl bg-brand-500 px-5 text-white font-bold text-lg hover:bg-brand-600 transition shrink-0"
              >
                +
              </button>
            </div>
            
            {/* Tag List */}
            {(() => {
              const certsArray = Array.isArray(form.certificates)
                ? form.certificates
                : typeof form.certificates === "string"
                ? form.certificates.split(",").map((c) => c.trim()).filter(Boolean)
                : [];
              
              if (certsArray.length === 0) return null;
              
              return (
                <div className="mt-3 flex flex-wrap gap-2">
                  {certsArray.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 rounded-full bg-[#f0f7ff] border border-[#dbeafe] px-3.5 py-1.5 text-sm text-[#1e40af] font-medium animate-in fade-in duration-200"
                    >
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCertificate(index)}
                        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-[#1e40af]/10 text-xs font-bold leading-none text-[#1e40af]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#7a6050]">Mô tả ngắn</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={3}
              className="w-full rounded-2xl border border-[#eadfd8] bg-white px-4 py-3 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:bg-[#fffaf5]/10 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#eadfd8] pt-4 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#eadfd8] bg-white px-5 py-2.5 text-sm font-medium text-[#7a6050] transition hover:bg-gray-50 hover:text-[#3d2010]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 disabled:opacity-50"
            >
              {isLoading ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo huấn luyện viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerModal;
