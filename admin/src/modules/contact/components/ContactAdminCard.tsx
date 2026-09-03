"use client";

import type { AdminContact } from "../models/contact.model";
import {
  CONTACT_STATUS_LABEL_VI,
  CONTACT_REQUEST_TYPE_LABEL_VI,
  contactStatusBadgeClass,
  formatContactDateTimeVi,
} from "../contact-admin-labels";

type ContactAdminCardProps = {
  contact: AdminContact;
  onViewDetail: () => void;
};

export const ContactAdminCard = ({
  contact,
  onViewDetail,
}: ContactAdminCardProps) => {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#3D2010]">
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
          <p className="text-sm font-medium text-gray-900">{contact.fullName}</p>
          <p className="text-xs text-gray-600">
            {contact.customerEmail} · {contact.phoneNumber}
          </p>
          <p className="text-xs text-gray-500">
            {formatContactDateTimeVi(contact.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewDetail}
          className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Chi tiết
        </button>
      </div>
    </article>
  );
};
