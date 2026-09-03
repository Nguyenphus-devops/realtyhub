'use client';

import { useState } from 'react';

import { FiSearch, FiX } from 'react-icons/fi';

/**
 * Thanh search/filter o dau trang /tien-ich.
 *
 * Filter theo label + description + keywords cua moi nut. Stat live: "X / Y
 * tinh nang" hien thi cung luc.
 */
type UtilitySearchHeaderProps = {
  value: string;
  onChange: (value: string) => void;
  /** Tong so nut dang hien thi (sau filter) */
  visibleCount: number;
  /** Tong so nut tren toan trang */
  totalCount: number;
};

const UtilitySearchHeader = ({ value, onChange, visibleCount, totalCount }: UtilitySearchHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    {/* Search input */}
    <div className="relative flex-1">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <FiSearch aria-hidden className="h-5 w-5" />
      </div>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm tiện ích (VD: tính vay, phong thủy, CRM...)"
        aria-label="Tìm tiện ích"
        className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-12 text-theme-sm text-gray-800 shadow-theme-xs outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Xóa tìm kiếm"
          className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <FiX aria-hidden className="h-4 w-4" />
        </button>
      )}
    </div>

    {/* Live count */}
    <div className="flex shrink-0 items-center gap-2 text-theme-sm text-gray-600">
      <span className="font-bold text-brand-600">{visibleCount}</span>
      <span>/</span>
      <span className="text-gray-500">{totalCount}</span>
      <span>tính năng</span>
    </div>
  </div>
);

// Re-export state hook de trang su dung
export const useUtilitySearch = () => useState<string>('');

export default UtilitySearchHeader;