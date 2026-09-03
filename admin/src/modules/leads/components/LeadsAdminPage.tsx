"use client";

import { useMemo, useState } from "react";
import { GroupIcon } from "@/icons/index";
import type {
  AdminLead,
  UpdateAdminLeadPayload,
} from "../models/lead.model";
import {
  LEAD_STATUS_LABEL_VI,
  LEAD_SOURCE_LABEL_VI,
  LeadStatus,
} from "../entities/lead.entity";
import { useAdminLeads } from "../hooks/useAdminLeads";
import { LeadAdminCard } from "./LeadAdminCard";
import { LeadDetailModal } from "./LeadDetailModal";

const LeadsAdminPage = () => {
  const {
    leads,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    updateMutation,
  } = useAdminLeads();

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [draftStatus, setDraftStatus] = useState<LeadStatus>(LeadStatus.New);
  const [draftNote, setDraftNote] = useState("");

  const openModal = (lead: AdminLead) => {
    setSelectedLead(lead);
    setDraftStatus(lead.status);
    setDraftNote(lead.staffNote ?? "");
  };

  const closeModal = () => {
    setSelectedLead(null);
  };

  const filtered = useMemo(() => {
    return leads.filter((row) => {
      if (statusFilter && row.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [leads, statusFilter]);

  const handleSave = async () => {
    if (!selectedLead) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedLead.id || selectedLead._id,
        data: {
          status: draftStatus,
          staffNote: draftNote,
        },
      });
      alert("Đã cập nhật lead.");
      closeModal();
    } catch (saveError) {
      console.error(saveError);
      alert("Cập nhật thất bại. Kiểm tra quyền đăng nhập (admin).");
    }
  };

  const showInitialSpinner = isLoading && leads.length === 0;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="relative overflow-hidden rounded-3xl border border-[#E8D5C4] bg-gradient-to-br from-[#FFF9F5] via-white to-[#F5EFE8] px-6 py-8 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#D4AF37]/30">
              <GroupIcon className="h-6 w-6 text-[#9A6238]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#3D2010]">
                Quản lý Leads
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-600">
                Xem danh sách leads từ website, cập nhật trạng thái và ghi chú.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-sm shadow-sm ring-1 ring-gray-100 backdrop-blur-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Tổng
            </span>
            <span className="text-lg font-semibold tabular-nums text-[#3D2010]">
              {leads.length.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </header>

      <section className="mt-8 space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">
                Trạng thái
              </span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value === ""
                      ? ""
                      : (event.target.value as LeadStatus),
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <option value="">Tất cả</option>
                {(
                  Object.keys(LEAD_STATUS_LABEL_VI) as LeadStatus[]
                ).map((key) => (
                  <option key={key} value={key}>
                    {LEAD_STATUS_LABEL_VI[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            disabled={isFetching}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetching ? "Đang làm mới…" : "Làm mới"}
          </button>
        </div>

        {isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p className="font-medium">Không tải được danh sách leads.</p>
            <p className="mt-1 text-red-700/90">
              {error instanceof Error ? error.message : "Lỗi không xác định."}
            </p>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {showInitialSpinner ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-gray-500">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
            <p className="mt-4 text-sm">Đang tải…</p>
          </div>
        ) : (
          <div
            className={`rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 sm:p-6 ${
              isFetching && !showInitialSpinner ? "opacity-80" : ""
            }`}
          >
            {isFetching && !showInitialSpinner ? (
              <div className="pointer-events-none mb-4 flex justify-end">
                <span className="rounded-full bg-[#3D2010]/90 px-3 py-1 text-[11px] font-medium text-white shadow">
                  Đang cập nhật…
                </span>
              </div>
            ) : null}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <GroupIcon className="h-7 w-7" />
                </div>
                <p className="text-base font-medium text-gray-800">
                  Không có bản ghi phù hợp
                </p>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Thử bỏ bộ lọc hoặc làm mới sau khi có leads mới.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.map((lead) => {
                  return (
                    <li key={lead.id}>
                      <LeadAdminCard
                        lead={lead}
                        onViewDetail={() => openModal(lead)}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={selectedLead !== null}
        onClose={closeModal}
        draftStatus={draftStatus}
        draftNote={draftNote}
        onDraftStatus={setDraftStatus}
        onDraftNote={setDraftNote}
        onSave={handleSave}
        isSaving={
          updateMutation.isPending &&
          updateMutation.variables?.id === (selectedLead?.id || selectedLead?._id)
        }
      />
    </div>
  );
};

export default LeadsAdminPage;
