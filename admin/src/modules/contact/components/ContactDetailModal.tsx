"use client";

import type {
  AdminContact,
  ContactProcessingStatus,
} from "../models/contact.model";
import {
  CONTACT_STATUS_LABEL_VI,
  CONTACT_REQUEST_TYPE_LABEL_VI,
  contactStatusBadgeClass,
  formatContactDateTimeVi,
} from "../contact-admin-labels";

type ContactDetailModalProps = {
  contact: AdminContact | null;
  isOpen: boolean;
  onClose: () => void;
  draftStatus: ContactProcessingStatus;
  draftNote: string;
  onDraftStatus: (value: ContactProcessingStatus) => void;
  onDraftNote: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
};

export const ContactDetailModal = ({
  contact,
  isOpen,
  onClose,
  draftStatus,
  draftNote,
  onDraftStatus,
  onDraftNote,
  onSave,
  isSaving,
}: ContactDetailModalProps) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-[#3D2010]">
            Chi tiết liên hệ
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-[#3D2010]">
                {contact.referenceNumber}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${contactStatusBadgeClass(contact.status)}`}
              >
                {CONTACT_STATUS_LABEL_VI[contact.status]}
              </span>
              <span className="rounded-full bg-[#FFF6EF] px-2.5 py-0.5 text-xs font-medium text-[#7C4A1E] ring-1 ring-[#E8D5C4]">
                {CONTACT_REQUEST_TYPE_LABEL_VI[contact.requestType]}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {formatContactDateTimeVi(contact.createdAt)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Thông tin khách hàng
            </h3>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Họ tên
                </p>
                <p className="mt-1 font-medium text-gray-900 break-words">
                  {contact.fullName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Số điện thoại
                </p>
                <p className="mt-1 text-gray-800 break-words">{contact.phoneNumber}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email
                </p>
                <p className="mt-1 text-gray-800 break-all">{contact.customerEmail}</p>
              </div>
            </div>
          </div>

          {contact.content ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Nội dung
              </p>
              <p className="whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm text-gray-800">
                {contact.content}
              </p>
            </div>
          ) : null}

          {contact.requestType === "table" ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Thông tin đặt bàn
              </h3>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Ngày
                  </p>
                  <p className="mt-1 text-gray-800">
                    {contact.preferredDate ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Giờ
                  </p>
                  <p className="mt-1 text-gray-800">
                    {contact.preferredTime ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Số khách
                  </p>
                  <p className="mt-1 text-gray-800">{contact.guests ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Loại sự kiện
                  </p>
                  <p className="mt-1 text-gray-800">
                    {contact.eventType ?? "—"}
                  </p>
                </div>
                {contact.specialRequests ? (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Yêu cầu đặc biệt
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-gray-800">
                      {contact.specialRequests}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {contact.notes ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Ghi chú từ khách hàng
              </p>
              <p className="whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm text-gray-800">
                {contact.notes}
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-[#E8D5C4] bg-[#FFFAF5] p-5 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#9A6238]">
              Cập nhật cho nhân viên
            </h3>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">
                Trạng thái
              </span>
              <select
                value={draftStatus}
                onChange={(event) =>
                  onDraftStatus(event.target.value as ContactProcessingStatus)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                {(
                  Object.keys(CONTACT_STATUS_LABEL_VI) as ContactProcessingStatus[]
                ).map((key) => (
                  <option key={key} value={key}>
                    {CONTACT_STATUS_LABEL_VI[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">
                Ghi chú nội bộ
              </span>
              <textarea
                value={draftNote}
                onChange={(event) => onDraftNote(event.target.value)}
                rows={4}
                className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                placeholder="Ghi chú chỉ admin xem…"
              />
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c39f2e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Đang lưu…" : "Lưu cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};
