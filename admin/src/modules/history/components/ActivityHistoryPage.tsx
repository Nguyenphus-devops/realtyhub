"use client";

import { useMemo, useState } from "react";
import { TimeIcon } from "@/icons/index";
import {
  HISTORY_ACTION_LABEL_VI,
  HISTORY_ACTION_VALUES,
} from "../models/history.model";
import type { HistoryLog } from "../models/history.model";
import { useHistoryLogs } from "../hooks/useHistoryLogs";

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
};

const actionAccentClass = (action: string) => {
  if (action.startsWith("user.")) {
    return "bg-sky-50 text-sky-800 ring-sky-100";
  }
  if (action.startsWith("blog.")) {
    return "bg-violet-50 text-violet-800 ring-violet-100";
  }
  if (action.startsWith("image.")) {
    return "bg-amber-50 text-amber-900 ring-amber-100";
  }
  if (action.startsWith("categories-blog.")) {
    return "bg-emerald-50 text-emerald-900 ring-emerald-100";
  }
  if (action.startsWith("contact.")) {
    return "bg-rose-50 text-rose-900 ring-rose-100";
  }
  return "bg-slate-50 text-slate-800 ring-slate-100";
};

const actionLabel = (action: string) =>
  HISTORY_ACTION_LABEL_VI[action] ?? action;

const HistoryLogCard = ({
  log,
}: {
  log: HistoryLog;
  expanded: boolean;
  onToggleExpand: () => void;
}) => {
  const actor =
    log.actorEmail?.trim() ||
    log.actorId?.trim() ||
    "Không xác định người thực hiện";

  return (
    <article className="relative pl-8 sm:pl-10">
      <span
        className="absolute left-[11px] top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#D4AF37] shadow-sm sm:left-[13px]"
        aria-hidden
      />
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex max-w-full items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${actionAccentClass(log.action)}`}
                title={log.action}
              >
                {actionLabel(log.action)}
              </span>
              {log.targetType ? (
                <span className="text-xs text-gray-500">
                  Đối tượng:{" "}
                  <span className="font-medium text-gray-700">
                    {log.targetType}
                  </span>
                  {log.targetId ? (
                    <span className="ml-1 font-mono text-[11px] text-gray-500">
                      {log.targetId}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
            {log.message ? (
              <p className="text-sm leading-relaxed text-gray-800">
                {log.message}
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">Không có mô tả</p>
            )}
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-600">{actor}</span>
            </p>
          </div>
          <time
            className="shrink-0 text-xs font-medium text-gray-500 sm:text-right"
            dateTime={log.createdAt}
          >
            {formatDateTime(log.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
};

export const ActivityHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [actionFilter, setActionFilter] = useState("");
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});

  const { logs, total, isLoading, isFetching, isError, error, refetch } =
    useHistoryLogs(page, limit, actionFilter);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const showInitialSpinner = isLoading && logs.length === 0;

  const recentSummary = useMemo(() => {
    if (logs.length === 0) {
      return null;
    }
    const last = logs[0];
    return {
      lastLabel: actionLabel(last.action),
      lastWhen: formatDateTime(last.createdAt),
    };
  }, [logs]);

  const toggleExpanded = (id: string) => {
    setExpandedById((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const handleFilterChange = (value: string) => {
    setActionFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="relative overflow-hidden rounded-3xl border border-[#E8D5C4] from-[#FFF9F5] via-white to-[#F5EFE8] px-6 py-8 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#D4AF37]/30">
              <TimeIcon className="h-6 w-6 text-[#9A6238]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#3D2010]">
                Lịch sử hoạt động
              </h1>
              {/* <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-600">
                Theo dõi các thao tác quan trọng trên hệ thống: đăng nhập, bài
                viết, media và hơn thế nữa. Dữ liệu được sắp xếp theo thời gian
                mới nhất.
              </p> */}
              {recentSummary ? (
                <p className="mt-3 text-xs text-gray-500">
                  Hoạt động gần nhất:{" "}
                  <span className="font-medium text-gray-700">
                    {recentSummary.lastLabel}
                  </span>
                  <span className="mx-1 text-gray-300">·</span>
                  {recentSummary.lastWhen}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="mt-8 space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">
                Lọc theo hành động
              </span>
              <select
                value={actionFilter}
                onChange={(event) => handleFilterChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <option value="">Tất cả hành động</option>
                {HISTORY_ACTION_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {HISTORY_ACTION_LABEL_VI[value] ?? value}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">
                Số dòng mỗi trang
              </span>
              <select
                value={limit}
                onChange={(event) =>
                  handleLimitChange(Number(event.target.value))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
            <p className="font-medium">Không tải được lịch sử.</p>
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
            <p className="mt-4 text-sm">Đang tải nhật ký…</p>
          </div>
        ) : (
          <div
            className={`relative rounded-3xl bg-white/90 p-4 border border-gray-200 sm:p-6 ${isFetching && !showInitialSpinner ? "opacity-80" : ""
              }`}
          >
            {isFetching && !showInitialSpinner ? (
              <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-end">
                <span className="rounded-full bg-[#3D2010]/90 px-3 py-1 text-[11px] font-medium text-white shadow">
                  Đang cập nhật…
                </span>
              </div>
            ) : null}

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <TimeIcon className="h-7 w-7" />
                </div>
                <p className="text-base font-medium text-gray-800">
                  Chưa có hoạt động nào
                </p>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Thử bỏ bộ lọc hoặc quay lại sau khi có thao tác mới trên hệ
                  thống.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div
                  className="absolute left-[14px] top-2 bottom-2 w-px from-[#D4AF37]/50 via-[#D4AF37]/25 to-transparent sm:left-[16px]"
                  aria-hidden
                />
                <ul className="space-y-6">
                  {logs.map((log, index) => (
                    <li key={`${log._id}-${index}`}>
                      <HistoryLogCard
                        log={log}
                        expanded={Boolean(expandedById[log._id])}
                        onToggleExpand={() => toggleExpanded(log._id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!showInitialSpinner && !isError ? (
          <nav
            className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-sm shadow-sm sm:flex-row"
            aria-label="Phân trang lịch sử"
          >
            <p className="text-gray-600">
              Trang{" "}
              <span className="font-semibold text-gray-900">{page}</span> /{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
              <span className="mx-2 text-gray-300">·</span>
              <span className="tabular-nums">{total.toLocaleString("vi-VN")}</span>{" "}
              bản ghi
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              <button
                type="button"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </nav>
        ) : null}
      </section>
    </div>
  );
};

export default ActivityHistoryPage;
