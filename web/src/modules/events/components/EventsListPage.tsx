'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiX,
} from 'react-icons/fi';

import FilterSelect from '@/common/components/FilterSelect';
import Pagination from '@/common/components/Pagination';

import EventCard from '@/modules/events/components/EventCard';
import { MOCK_EVENTS } from '@/modules/events/mocks/events.mock';
import {
  EVENT_STATUS_LABELS,
  EVENT_TYPE_FILTERS,
  EVENT_TYPE_LABELS,
  type EventItem,
  type EventStatus,
  type EventType,
} from '@/modules/events/models/event.model';
import {
  formatDateLong,
  formatTime,
} from '@/modules/events/utils/event-format';

/**
 * Trang /su-kien - danh sach su kien (workshop / hoi thao / networking / open
 * house / webinar) voi thanh tim kiem + bo loc dang chip, giong pattern
 * ProjectListPage.
 *
 * Cau truc:
 *   01 Tieu de trang
 *   02 Hang tim kiem (o search + so ket qua)
 *   03 Hang chip loc (loai su kien / trang thai / tu ngay / den ngay) +
 *       "Xoa tat ca"
 *   04 Grid card 1/2/3 cot (mobile/tablet/desktop)
 *   05 Pagination (client-side slice)
 *
 * Khong dung URL filter: search/filter qua React state cho UX muot, dong nhat
 * voi ProjectListPage. Khi backend co san, chuyen sang useQuery + URL params.
 *
 * Theo yeu cau: card co badge ngay (dd/ThM) goc tren ben trai anh + badge loai
 * su kien goc tren ben phai + meta thoi gian/dia diem + nut "Xem chi tiet".
 */

type StatusFilter = EventStatus | 'all';

const TYPE_OPTIONS = [
  { value: 'all', label: 'Tất cả loại' },
  ...EVENT_TYPE_FILTERS.map((value) => ({
    value,
    label: EVENT_TYPE_LABELS[value],
  })),
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'upcoming', label: EVENT_STATUS_LABELS.upcoming },
  { value: 'ongoing', label: EVENT_STATUS_LABELS.ongoing },
  { value: 'past', label: EVENT_STATUS_LABELS.past },
  { value: 'full', label: EVENT_STATUS_LABELS.full },
];

/** Thoi diem "bay gio" trong he thong. Dich seed de mock data co status
    on dinh (upcoming/ongoing/past), nho dat cung mot luc voi MOCK_EVENTS. */
const NOW = new Date('2026-08-09T15:00:00.000+07:00');

/** Cap nhat status theo thoi gian thuc (giong app/su-kien/page.tsx). */
const computeStatus = (event: EventItem): EventStatus => {
  const start = new Date(event.startAt).getTime();
  const end = event.endAt
    ? new Date(event.endAt).getTime()
    : start + 2 * 60 * 60 * 1000;

  if (event.capacity && event.registered >= event.capacity) return 'full';
  if (NOW.getTime() < start) return 'upcoming';
  if (NOW.getTime() >= start && NOW.getTime() <= end) return 'ongoing';
  return 'past';
};

const PAGE_SIZE = 9;
const PAGE_SIZE_OPTIONS = [9, 18, 36];

// ============================================================================
// Page
// ============================================================================

const EventsListPage = () => {
  // Snapshot status tinh theo NOW (server + client cung NOW -> khong hydration
  // warning). Khi backend co san thi thay bang server-side status.
  const events = useMemo<EventItem[]>(
    () => MOCK_EVENTS.map((event) => ({ ...event, status: computeStatus(event) })),
    [],
  );

  // ── Bo loc (client state, giong ProjectListPage) ───────────────────────
  const [search, setSearch] = useState('');
  const [type, setType] = useState<EventType | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [fromDate, setFromDate] = useState(''); // yyyy-mm-dd
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // ── Loc ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const fromMs = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const toMs = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return events.filter((event) => {
      if (type !== 'all' && event.type !== type) return false;
      if (status !== 'all' && event.status !== status) return false;

      const startMs = new Date(event.startAt).getTime();
      if (fromMs !== null && startMs < fromMs) return false;
      if (toMs !== null && startMs > toMs) return false;

      if (query) {
        // Search theo tien trich (excerpt) + tieu de + slug
        const haystack = `${event.title} ${event.excerpt} ${event.slug}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [events, search, type, status, fromDate, toDate]);

  // Sap xep: ongoing -> upcoming (gan nhat) -> full -> past (moi nhat).
  // Muc dich: trang dau luon co su kien con dang hoat dong / sap toi.
  const sorted = useMemo(() => {
    const weight: Record<EventStatus, number> = {
      ongoing: 0,
      upcoming: 1,
      full: 2,
      past: 3,
    };
    return [...filtered].sort((a, b) => {
      const diff = weight[a.status] - weight[b.status];
      if (diff !== 0) return diff;
      // Trong cung nhom: sap xep theo startAt
      // Upcoming: gan nhat truoc. Past: moi nhat (lon nhat) truoc.
      if (a.status === 'past') {
        return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
      }
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    });
  }, [filtered]);

  // ── Phan trang ─────────────────────────────────────────────────────────
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // Dam bao page khong vuot totalPages sau khi doi filter
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  // ── So o loc dang bat ──────────────────────────────────────────────────
  const activeCount =
    (search.trim() ? 1 : 0) +
    (type !== 'all' ? 1 : 0) +
    (status !== 'all' ? 1 : 0) +
    (fromDate ? 1 : 0) +
    (toDate ? 1 : 0);

  const clearAll = () => {
    setSearch('');
    setType('all');
    setStatus('all');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const onChangeType = (next: string | null) => {
    setType((next as EventType | 'all') ?? 'all');
    setPage(1);
  };
  const onChangeStatus = (next: string | null) => {
    setStatus((next as StatusFilter) ?? 'all');
    setPage(1);
  };
  const onChangeSearch = (next: string) => {
    setSearch(next);
    setPage(1);
  };
  const onChangeFrom = (next: string) => {
    setFromDate(next);
    setPage(1);
    // Neu chon tu ngay > den ngay, tu dong cat den ngay cho khop
    if (toDate && next && next > toDate) setToDate('');
  };
  const onChangeTo = (next: string) => {
    setToDate(next);
    setPage(1);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
  };

  return (
    <main className="bg-gray-50">
      <div className="site-container py-8 md:py-10">
        {/* ============ 01 TIEU DE ============ */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900">
            Sự kiện
          </h1>
          <p className="mt-1 text-theme-sm text-gray-500">
            Workshop, hội thảo, networking và open house mới nhất từ RealtyHub.
          </p>
        </header>

        {/* ============ 02 HANG TIM KIEM ============ */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <form
            onSubmit={submitSearch}
            role="search"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white py-2 pl-5 pr-2 shadow-card transition focus-within:border-brand-300 focus-within:shadow-panel lg:max-w-2xl"
          >
            <input
              type="search"
              value={search}
              onChange={(event) => onChangeSearch(event.target.value)}
              placeholder="Tìm kiếm sự kiện..."
              aria-label="Tìm kiếm sự kiện"
              className="h-9 min-w-0 flex-1 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => onChangeSearch('')}
                aria-label="Xóa từ khóa"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX aria-hidden className="text-base" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600"
            >
              <FiSearch aria-hidden className="text-lg" />
            </button>
          </form>

          <p
            aria-live="polite"
            className="min-h-5 text-theme-sm text-gray-500 lg:ml-auto"
          >
            {activeCount > 0 ? 'Tìm thấy ' : 'Có '}
            <strong className="text-gray-800">{total}</strong> sự kiện
          </p>
        </div>

        {/* ============ 03 HANG CHIP LOC ============ */}
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <FilterSelect
            variant="chip"
            label="Loại sự kiện"
            icon={<FiCalendar />}
            value={type === 'all' ? null : type}
            options={TYPE_OPTIONS.filter((o) => o.value !== 'all')}
            onChange={onChangeType}
          />
          <FilterSelect
            variant="chip"
            label="Trạng thái"
            icon={<FiClock />}
            value={status === 'all' ? null : status}
            options={STATUS_OPTIONS.filter((o) => o.value !== 'all')}
            onChange={onChangeStatus}
          />

          <span aria-hidden className="h-6 w-px shrink-0 bg-gray-200" />

          <DateChip
            label="Từ ngày"
            value={fromDate}
            onChange={onChangeFrom}
            max={toDate || undefined}
          />
          <DateChip
            label="Đến ngày"
            value={toDate}
            onChange={onChangeTo}
            min={fromDate || undefined}
          />

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="shrink-0 whitespace-nowrap px-2 text-theme-sm font-medium text-gray-500 underline underline-offset-2 transition hover:text-error-600"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* ============ 04 GRID CARD ============ */}
        {pageItems.length === 0 ? (
          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="mb-2 text-base font-semibold text-gray-800">
              Không tìm thấy sự kiện phù hợp.
            </p>
            <p className="text-theme-sm text-gray-500">
              Hãy thử đổi từ khóa, loại sự kiện, hoặc khoảng ngày khác.
            </p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-theme-sm font-medium text-gray-700 transition hover:border-brand-400 hover:text-brand-600"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((event) => (
              <EventCard key={event.publicId} event={event} />
            ))}
          </div>
        )}

        {/* ============ 05 PAGINATION ============ */}
        {total > 0 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            total={total}
            limit={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            label="Phân trang danh sách sự kiện"
            onPageChange={(next) => setPage(next)}
            onLimitChange={(next) => {
              setPageSize(next);
              setPage(1);
            }}
          />
        )}
      </div>
    </main>
  );
};

// ============================================================================
// DateChip - chip loc ngay giong pattern chip cua ProjectFilterBar
// ============================================================================

const CHIP_BASE =
  'flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-theme-sm font-medium transition';
const CHIP_ON = 'border-brand-500 bg-brand-50 text-brand-700';
const CHIP_OFF =
  'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50';

type DateChipProps = {
  label: string;
  value: string; // yyyy-mm-dd hoac rong
  onChange: (next: string) => void;
  min?: string;
  max?: string;
};

const DateChip = ({ label, value, onChange, min, max }: DateChipProps) => (
  <label
    className={`${CHIP_BASE} ${value ? CHIP_ON : CHIP_OFF} cursor-pointer`}
  >
    <span className="whitespace-nowrap">
      {value
        ? `${label}: ${new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}`
        : label}
    </span>
    <input
      type="date"
      value={value}
      min={min}
      max={max}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
      className="sr-only"
    />
    {value && (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onChange('');
        }}
        aria-label={`Xóa ${label}`}
        className="-mr-1 flex h-5 w-5 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-100 hover:text-brand-700"
      >
        <FiX aria-hidden className="text-[13px]" />
      </button>
    )}
  </label>
);

export default EventsListPage;
