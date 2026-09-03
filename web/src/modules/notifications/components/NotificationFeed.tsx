'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import {
  FiBellOff,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiFilter,
  FiInbox,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';

import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_TONE,
  MOCK_NOTIFICATIONS,
  PRIORITY_LABELS,
  PRIORITY_TONE,
  type NotificationCategory,
  type NotificationItem,
} from '@/modules/notifications/mocks/notifications.mock';

/**
 * Feed trang thong bao - client component.
 *
 * Chuc nang:
 *   - Filter theo category (5 category + tat ca)
 *   - Search theo title/source (don gian, client-side)
 *   - Chon nhieu notification (checkbox) -> mark-as-read / xoa
 *   - Mark 1 notification as read khi click
 *   - "Đánh dấu tất cả đã đọc" button
 *
 * Khi co backend:
 *   - Thay MOCK_NOTIFICATIONS bang useQuery('notifications', () => fetch('/notifications'))
 *   - PATCH /notifications/:id/read (single)
 *   - POST /notifications/read-all (bulk)
 *   - DELETE /notifications/:id (bulk)
 *   - Optimistic update: cap nhat state truoc, rollback neu API fail
 */

// ============================================================================
// Helpers
// ============================================================================

type Group = { id: string; label: string; items: NotificationItem[] };

const TODAY_LABEL = 'Hôm nay';
const YESTERDAY_LABEL = 'Hôm qua';
const THIS_WEEK_LABEL = 'Tuần này';
const EARLIER_LABEL = 'Trước đó';

const groupByDate = (items: NotificationItem[]): Group[] => {
  const today = new Date('2026-08-09T00:00:00.000Z').getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;
  const weekStart = today - 6 * 24 * 60 * 60 * 1000;

  const todayItems: NotificationItem[] = [];
  const yesterdayItems: NotificationItem[] = [];
  const weekItems: NotificationItem[] = [];
  const earlierItems: NotificationItem[] = [];

  items.forEach((item) => {
    const t = new Date(item.createdAt).getTime();
    if (t >= today) todayItems.push(item);
    else if (t >= yesterday) yesterdayItems.push(item);
    else if (t >= weekStart) weekItems.push(item);
    else earlierItems.push(item);
  });

  const groups: Group[] = [];
  if (todayItems.length) groups.push({ id: 'today', label: TODAY_LABEL, items: todayItems });
  if (yesterdayItems.length)
    groups.push({ id: 'yesterday', label: YESTERDAY_LABEL, items: yesterdayItems });
  if (weekItems.length)
    groups.push({ id: 'week', label: THIS_WEEK_LABEL, items: weekItems });
  if (earlierItems.length)
    groups.push({ id: 'earlier', label: EARLIER_LABEL, items: earlierItems });

  return groups;
};

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

const formatRelative = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} ngày trước`;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(iso));
};

const CATEGORY_FILTERS: Array<{ id: NotificationCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'project', label: CATEGORY_LABELS.project },
  { id: 'lead', label: CATEGORY_LABELS.lead },
  { id: 'price', label: CATEGORY_LABELS.price },
  { id: 'news', label: CATEGORY_LABELS.news },
  { id: 'system', label: CATEGORY_LABELS.system },
];

// ============================================================================
// Component
// ============================================================================

const NotificationFeed = () => {
  const [items, setItems] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // Filter + group
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCategory) return false;
      if (!term) return true;
      return (
        item.title.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term) ||
        item.excerpt.toLowerCase().includes(term)
      );
    });
  }, [items, activeCategory, search]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const unread = items.filter((i) => !i.isRead).length;
    const today = items.filter((i) => {
      const t = new Date(i.createdAt).getTime();
      const todayStart = new Date('2026-08-09T00:00:00.000Z').getTime();
      return t >= todayStart;
    }).length;
    const important = items.filter((i) => i.priority !== 'normal').length;
    return { total, unread, today, important };
  }, [items]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<NotificationCategory | 'all', number> = {
      all: items.length,
      project: 0,
      lead: 0,
      news: 0,
      system: 0,
      price: 0,
    };
    items.forEach((i) => {
      counts[i.category]++;
      if (!i.isRead) {
        // Don't have a separate unread counter here
      }
    });
    return counts;
  }, [items]);

  // Actions
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    const visibleIds = filtered.map((i) => i.publicId);
    setSelectedIds(new Set(visibleIds));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const markAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.publicId === id ? { ...i, isRead: true } : i))
    );
  };

  const markAllAsRead = async () => {
    setBulkBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
    setSelectedIds(new Set());
    setBulkBusy(false);
  };

  const bulkMarkAsRead = async () => {
    setBulkBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) =>
      prev.map((i) => (selectedIds.has(i.publicId) ? { ...i, isRead: true } : i))
    );
    setSelectedIds(new Set());
    setBulkBusy(false);
  };

  const bulkDelete = async () => {
    setBulkBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.publicId)));
    setSelectedIds(new Set());
    setBulkBusy(false);
  };

  // Empty state
  if (items.length === 0) {
    return <EmptyState icon={FiBellOff} title="Chưa có thông báo" message="Mọi cập nhật sẽ xuất hiện ở đây." />;
  }

  if (filtered.length === 0) {
    return <EmptyState icon={FiInbox} title="Không có kết quả" message="Thử bỏ bộ lọc hoặc từ khoá khác." />;
  }

  return (
    <div className="space-y-6">
      {/* ============ Stats row ============ */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Tổng" value={stats.total.toString()} />
        <MiniStat label="Chưa đọc" value={stats.unread.toString()} tone="text-indigo-600" />
        <MiniStat label="Hôm nay" value={stats.today.toString()} />
        <MiniStat label="Quan trọng" value={stats.important.toString()} tone="text-amber-600" />
      </div>

      {/* ============ Filter bar ============ */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-theme-xs md:p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2">
            <FiSearch aria-hidden className="h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Tìm theo tiêu đề, nguồn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-theme-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Mark all read */}
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={bulkBusy || stats.unread === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-theme-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCheck aria-hidden className="h-4 w-4" />
            <span className="hidden md:inline">Đánh dấu tất cả đã đọc</span>
            <span className="md:hidden">Đọc tất cả</span>
          </button>
        </div>

        {/* Category chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          <FiFilter aria-hidden className="h-4 w-4 text-gray-400" />
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-theme-xs font-semibold transition ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-theme-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/50'
                }`}
              >
                {cat.id !== 'all' && <span aria-hidden>{CATEGORY_ICONS[cat.id]}</span>}
                {cat.label}
                <span
                  className={`ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bulk actions bar (sticky o top khi co selection) */}
        {selectedIds.size > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2 text-theme-sm">
            <span className="font-semibold text-indigo-700">
              Đã chọn {selectedIds.size} thông báo
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllVisible}
                className="rounded-lg px-2.5 py-1 font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                Chọn tất cả ({filtered.length})
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg px-2.5 py-1 text-gray-700 hover:bg-indigo-100"
              >
                Bỏ chọn
              </button>
              <span className="hidden h-4 w-px bg-indigo-200 md:inline" />
              <button
                type="button"
                onClick={bulkMarkAsRead}
                disabled={bulkBusy}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1 font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
              >
                <FiCheck aria-hidden className="h-3.5 w-3.5" />
                Đánh dấu đã đọc
              </button>
              <button
                type="button"
                onClick={bulkDelete}
                disabled={bulkBusy}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1 font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
              >
                <FiTrash2 aria-hidden className="h-3.5 w-3.5" />
                Xoá
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============ Feed groups ============ */}
      <div className="space-y-8">
        {grouped.map((group) => (
          <section key={group.id}>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-theme-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                {group.label}
              </h2>
              <span className="text-theme-xs text-gray-400">
                {group.items.length} thông báo
              </span>
              <span aria-hidden className="h-px flex-1 bg-gray-200" />
            </div>

            <ul className="space-y-2">
              {group.items.map((item) => (
                <NotificationRow
                  key={item.publicId}
                  item={item}
                  isSelected={selectedIds.has(item.publicId)}
                  onToggleSelect={() => toggleSelect(item.publicId)}
                  onMarkRead={() => markAsRead(item.publicId)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

const MiniStat = ({
  label,
  value,
  tone = 'text-gray-900',
}: {
  label: string;
  value: string;
  tone?: string;
}) => (
  <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-theme-xs md:p-4">
    <div className="text-theme-xs uppercase tracking-[0.18em] text-gray-500">{label}</div>
    <div className={`mt-1 font-serif text-2xl font-bold leading-none ${tone}`}>{value}</div>
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  message,
}: {
  icon: React.ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  title: string;
  message: string;
}) => (
  <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/40 p-12 text-center">
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-theme-xs">
      <Icon aria-hidden className="h-8 w-8" />
    </span>
    <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-1 text-theme-sm text-gray-600">{message}</p>
  </div>
);

const NotificationRow = ({
  item,
  isSelected,
  onToggleSelect,
  onMarkRead,
}: {
  item: NotificationItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onMarkRead: () => void;
}) => {
  const handleClick = () => {
    if (!item.isRead) onMarkRead();
  };

  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border transition ${
        isSelected
          ? 'border-indigo-300 bg-indigo-50/40 shadow-theme-xs'
          : item.isRead
            ? 'border-gray-100 bg-white'
            : 'border-indigo-100 bg-indigo-50/30 shadow-theme-xs'
      }`}
    >
      {/* Unread indicator dot */}
      {!item.isRead && (
        <span
          aria-hidden
          className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-indigo-500"
        />
      )}

      <div className="flex items-start gap-3 p-4 md:gap-4 md:p-5">
        {/* Checkbox */}
        <label className="flex shrink-0 items-start pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            aria-label={`Chọn thông báo: ${item.title}`}
            className="h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400"
          />
        </label>

        {/* Icon */}
        <span
          aria-hidden
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base md:h-11 md:w-11 ${CATEGORY_TONE[item.category]}`}
        >
          {item.icon}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-theme-xs text-gray-500">
            <span className="font-semibold uppercase tracking-[0.15em] text-gray-600">
              {item.source}
            </span>
            <span aria-hidden>·</span>
            <span title={new Date(item.createdAt).toLocaleString('vi-VN')}>
              {formatRelative(item.createdAt)}
            </span>
            {item.priority !== 'normal' && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold uppercase tracking-[0.15em] ${PRIORITY_TONE[item.priority]}`}
              >
                {PRIORITY_LABELS[item.priority]}
              </span>
            )}
          </div>

          <Link
            href={item.href}
            onClick={handleClick}
            className={`mt-1 block font-serif text-base font-bold transition md:text-lg ${
              item.isRead ? 'text-gray-700 hover:text-indigo-600' : 'text-gray-900 hover:text-indigo-700'
            }`}
          >
            {item.title}
          </Link>

          <p
            className={`mt-1 line-clamp-2 text-theme-sm leading-relaxed ${
              item.isRead ? 'text-gray-500' : 'text-gray-700'
            }`}
          >
            {item.excerpt}
          </p>

          <div className="mt-2 flex items-center gap-2 text-theme-xs text-gray-500">
            <span>{formatTime(item.createdAt)}</span>
            {item.isRead && (
              <span className="inline-flex items-center gap-1 text-gray-400">
                <FiCheckCircle aria-hidden className="h-3 w-3" />
                Đã đọc
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <Link
          href={item.href}
          onClick={handleClick}
          aria-label={`Mở: ${item.title}`}
          className="hidden shrink-0 items-center justify-center self-center rounded-full p-2 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600 md:flex"
        >
          <FiChevronRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </li>
  );
};

export default NotificationFeed;