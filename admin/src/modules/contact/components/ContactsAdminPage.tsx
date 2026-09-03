"use client";

import { useMemo, useState } from "react";
import { MailIcon } from "@/icons/index";
import type {
  AdminContact,
  ContactProcessingStatus,
  ContactRequestType,
} from "../models/contact.model";
import { useAdminContacts } from "../hooks/useAdminContacts";
import {
  CONTACT_REQUEST_TYPE_LABEL_VI,
  CONTACT_STATUS_LABEL_VI,
} from "../contact-admin-labels";
import { ContactAdminCard } from "./ContactAdminCard";
import { ContactDetailModal } from "./ContactDetailModal";

const ContactsAdminPage = () => {
  const {
    contacts = [], // Fallback rỗng để tránh crash khi chưa load xong
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    updateMutation,
  } = useAdminContacts();

  const [statusFilter, setStatusFilter] = useState<
    ContactProcessingStatus | ""
  >("");
  const [typeFilter, setTypeFilter] = useState<ContactRequestType | "">("");
  const [selectedContact, setSelectedContact] = useState<AdminContact | null>(
    null,
  );
  const [draftStatus, setDraftStatus] =
    useState<ContactProcessingStatus>("pending");
  const [draftNote, setDraftNote] = useState("");

  const openModal = (contact: AdminContact) => {
    setSelectedContact(contact);
    setDraftStatus(contact.status);
    setDraftNote(contact.internalNote ?? "");
  };

  const closeModal = () => {
    setSelectedContact(null);
  };

  const statusCounts = useMemo(() => {
    const keys = Object.keys(
      CONTACT_STATUS_LABEL_VI,
    ) as ContactProcessingStatus[];
    const map: Record<string, number> = {};
    keys.forEach((k) => (map[k] = 0));
    contacts.forEach((c) => {
      if (map[c.status] !== undefined) map[c.status]++;
    });
    return map;
  }, [contacts]);

  const filtered = useMemo(() => {
    return contacts.filter((row) => {
      if (statusFilter && row.status !== statusFilter) {
        return false;
      }
      if (typeFilter && row.requestType !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [contacts, statusFilter, typeFilter]);

  const handleSave = async () => {
    if (!selectedContact) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedContact.id,
        data: {
          status: draftStatus,
          internalNote: draftNote,
        },
      });
      alert("Đã cập nhật liên hệ.");
      closeModal();
    } catch (saveError) {
      console.error(saveError);
      alert("Cập nhật thất bại. Kiểm tra quyền đăng nhập (admin).");
    }
  };

  const showInitialSpinner = isLoading && contacts.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* HEADER SECTION */}
      <header className="relative overflow-hidden rounded-3xl border border-[#E8D5C4]/60 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F5EFE8] px-8 py-8 shadow-sm transition-all duration-300">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#9A6238]/5 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-[#D4AF37]/20 transition-transform duration-300 hover:scale-105">
              <MailIcon className="h-6 w-6 text-[#9A6238]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#3D2010] sm:text-3xl">
                Liên hệ & Đặt chỗ
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 max-w-md">
                Quản lý các yêu cầu từ website, cập nhật tiến độ xử lý và lưu
                chú thích nội bộ.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* METRICS / QUICK FILTERS */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <button
          type="button"
          onClick={() => setStatusFilter("")}
          className={`group flex flex-col items-start justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
            statusFilter === ""
              ? "border-[#D4AF37] bg-gradient-to-b from-[#FFF9F5] to-white shadow-md ring-2 ring-[#D4AF37]/30"
              : "border-slate-100 bg-white shadow-sm hover:border-slate-200 hover:shadow-md"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-500">
            Tất cả yêu cầu
          </span>
          <span className="mt-3 text-2xl font-extrabold text-[#3D2010]">
            {contacts.length.toLocaleString("vi-VN")}
          </span>
        </button>

        {(
          Object.keys(CONTACT_STATUS_LABEL_VI) as ContactProcessingStatus[]
        ).map((status) => {
          const count = statusCounts[status] || 0;
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`group flex flex-col items-start justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                isActive
                  ? "border-[#D4AF37] bg-gradient-to-b from-[#FFF9F5] to-white shadow-md ring-2 ring-[#D4AF37]/30"
                  : "border-slate-100 bg-white shadow-sm hover:border-slate-200 hover:shadow-md"
              }`}
            >
              <span className="line-clamp-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-500">
                {CONTACT_STATUS_LABEL_VI[status]}
              </span>
              <span className="mt-3 text-2xl font-extrabold text-[#3D2010]">
                {count.toLocaleString("vi-VN")}
              </span>
            </button>
          );
        })}
      </section>

      {/* FILTER & MAIN CONTENT */}
      <section className="mt-8 space-y-6">
        {/* TOOLBAR CONTROLS */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="grid w-full gap-4 sm:grid-cols-2 md:max-w-2xl">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Trạng thái xử lý
              </span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value === ""
                      ? ""
                      : (event.target.value as ContactProcessingStatus),
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
              >
                <option value="">Tất cả trạng thái</option>
                {(
                  Object.keys(
                    CONTACT_STATUS_LABEL_VI,
                  ) as ContactProcessingStatus[]
                ).map((key) => (
                  <option key={key} value={key}>
                    {CONTACT_STATUS_LABEL_VI[key]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Loại yêu cầu
              </span>
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value === ""
                      ? ""
                      : (event.target.value as ContactRequestType),
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
              >
                <option value="">Tất cả phân loại</option>
                {(
                  Object.keys(
                    CONTACT_REQUEST_TYPE_LABEL_VI,
                  ) as ContactRequestType[]
                )
                  .filter((key) => key !== "general" && key !== "table")
                  .map((key) => (
                    <option key={key} value={key}>
                      {CONTACT_REQUEST_TYPE_LABEL_VI[key]}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("");
              setTypeFilter("");
              void refetch();
            }}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border border-slate-500 border-t-transparent" />
                Đang làm mới…
              </span>
            ) : (
              "Làm mới bộ lọc"
            )}
          </button>
        </div>

        {/* ERROR STATE */}
        {isError ? (
          <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-sm text-red-800"
          >
            <div>
              <p className="font-bold">Không tải được danh sách liên hệ</p>
              <p className="mt-0.5 text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Vui lòng kiểm tra lại kết nối mạng."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition"
            >
              Thử lại ngay
            </button>
          </div>
        ) : null}

        {/* LOADING & DATA LIST */}
        {showInitialSpinner ? (
          /* SKELETON LOADING EFFECTS BENEFICIAL FOR UX */
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-28 w-full animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        ) : (
          <div
            className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-opacity duration-200 sm:p-6 ${
              isFetching && !showInitialSpinner ? "opacity-75" : ""
            }`}
          >
            {/* REAL-TIME SYNC INDICATOR */}
            {isFetching && !showInitialSpinner ? (
              <div className="pointer-events-none mb-4 flex justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3D2010] px-3 py-1 text-[11px] font-medium text-white shadow-sm">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400" />
                  Đang đồng bộ dữ liệu...
                </span>
              </div>
            ) : null}

            {/* EMPTY STATE */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
                  <MailIcon className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Không tìm thấy bản ghi phù hợp
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Thử thay đổi điều kiện hoặc xóa bộ lọc để tìm kiếm lại thông
                  tin mong muốn.
                </p>
              </div>
            ) : (
              /* CARD LIST WITH REFINED SPACING */
              <ul className="space-y-4">
                {filtered.map((contact) => (
                  <li
                    key={contact.id}
                    className="transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <ContactAdminCard
                      contact={contact}
                      onViewDetail={() => openModal(contact)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* DETAIL MODAL */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={selectedContact !== null}
        onClose={closeModal}
        draftStatus={draftStatus}
        draftNote={draftNote}
        onDraftStatus={setDraftStatus}
        onDraftNote={setDraftNote}
        onSave={handleSave}
        isSaving={
          updateMutation.isPending &&
          updateMutation.variables?.id === selectedContact?.id
        }
      />
    </div>
  );
};

export default ContactsAdminPage;
