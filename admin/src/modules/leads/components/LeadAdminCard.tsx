"use client";

import type { AdminLead } from "../models/lead.model";
import {
  LEAD_STATUS_LABEL_VI,
  LEAD_SOURCE_LABEL_VI,
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

interface LeadAdminCardProps {
  lead: AdminLead;
  onViewDetail: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  [LeadStatus.New]: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  [LeadStatus.Contacted]: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  [LeadStatus.Qualified]: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  [LeadStatus.Converted]: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  [LeadStatus.Lost]: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function formatLeadDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:-- --/--/----";

  const parts = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("hour")}:${get("minute")} ${get("day")}/${get("month")}/${get("year")}`;
}

export function LeadAdminCard({ lead, onViewDetail }: LeadAdminCardProps) {
  const colors = STATUS_COLORS[lead.status] || STATUS_COLORS[LeadStatus.New];

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#D4AF37]/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {lead.name}
            </h3>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
              {LEAD_STATUS_LABEL_VI[lead.status]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <a
              href={`tel:${lead.phone}`}
              className="font-medium text-gray-700 hover:text-[#D4AF37] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.phone}
            </a>
            {lead.email && (
              <span className="truncate">{lead.email}</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
              {LEAD_SOURCE_LABEL_VI[lead.source]}
            </span>
            {lead.promoType && lead.promoType !== 'none' && (
              <span className="inline-flex items-center rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600">
                {LEAD_PROMO_TYPE_LABEL_VI[lead.promoType] || 'Ưu đãi'}
              </span>
            )}
            {lead.sourceDetail && SOURCE_DETAIL_LABEL_VI[lead.sourceDetail] && (
              <span className="inline-flex items-center rounded-lg bg-[#FFF9F5] border border-[#E8D5C4]/60 px-2 py-1 text-xs font-medium text-[#9A6238]">
                {SOURCE_DETAIL_LABEL_VI[lead.sourceDetail]}
              </span>
            )}
          </div>

          {lead.staffNote && (
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
              <span className="font-medium">Ghi chú:</span> {lead.staffNote}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <time className="text-xs text-gray-400">
            {formatLeadDateTime(lead.createdAt)}
          </time>
          <button
            type="button"
            onClick={onViewDetail}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-[#D4AF37] hover:text-[#9A6238]"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
