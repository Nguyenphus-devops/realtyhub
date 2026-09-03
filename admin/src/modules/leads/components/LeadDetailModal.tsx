"use client";

import type { AdminLead } from "../models/lead.model";
import {
  LEAD_STATUS_LABEL_VI,
  LEAD_PROMO_TYPE_LABEL_VI,
  LeadStatus,
} from "../entities/lead.entity";

const SOURCE_DETAIL_LABEL_VI: Record<string, string> = {
  'free-trial-modal': 'Tập thử 7 ngày 0đ',
  'inbody-970': 'Đo InBody 970',
  'pricing': 'Giảm giá 29%',
  'contact-page': 'Liên hệ tư vấn',
  'booking-page': 'Đặt lịch tập',
  'sticky-contact': 'Hotline/Zalo',
  'founder-member': 'Founder Member',
};

interface LeadDetailModalProps {
  lead: AdminLead | null;
  isOpen: boolean;
  onClose: () => void;
  draftStatus: LeadStatus;
  draftNote: string;
  onDraftStatus: (status: LeadStatus) => void;
  onDraftNote: (note: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  draftStatus,
  draftNote,
  onDraftStatus,
  onDraftNote,
  onSave,
  isSaving,
}: LeadDetailModalProps) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết Lead</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                Tên
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                Số điện thoại
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.phone}</p>
            </div>
          </div>

          {lead.email && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.email}</p>
            </div>
          )}

          {lead.note && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                Ghi chú khách hàng
              </label>
              <p className="mt-1 text-sm text-gray-700">{lead.note}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                Ngày tạo
              </label>
              <p className="mt-1 text-sm text-gray-700">
                {new Date(lead.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                Nguồn
              </label>
              <p className="mt-1 text-sm text-gray-700 uppercase">{lead.source}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {lead.promoType && lead.promoType !== 'none' && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                  Loại yêu cầu
                </label>
                <p className="mt-1 text-sm text-gray-700 font-semibold">
                  {LEAD_PROMO_TYPE_LABEL_VI[lead.promoType] || lead.promoType}
                </p>
              </div>
            )}
            {lead.sourceDetail && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-400">
                  Chi tiết nguồn
                </label>
                <p className="mt-1 text-sm text-gray-700 font-semibold">
                  {SOURCE_DETAIL_LABEL_VI[lead.sourceDetail] || lead.sourceDetail}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
              Trạng thái
            </label>
            <select
              value={draftStatus}
              onChange={(e) => onDraftStatus(e.target.value as LeadStatus)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            >
              {Object.values(LeadStatus).map((status) => (
                <option key={status} value={status}>
                  {LEAD_STATUS_LABEL_VI[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
              Ghi chú nhân viên
            </label>
            <textarea
              value={draftNote}
              onChange={(e) => onDraftNote(e.target.value)}
              rows={3}
              placeholder="Nhập ghi chú..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c9a235] disabled:opacity-50"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
