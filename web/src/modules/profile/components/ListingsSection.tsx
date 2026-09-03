'use client';

import { useState } from 'react';

import { FiPlus } from 'react-icons/fi';

type Tab = 'active' | 'sold';

/**
 * Section "Tat ca tin dang" voi 2 tab (Tin dang hoat dong / Da ban).
 * Hien tai mock rong -> hien empty state voi CTA "Dang tin ngay".
 */
const ListingsSection = () => {
  const [tab, setTab] = useState<Tab>('active');
  const counts = { all: 0, active: 0, sold: 0 };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm">
      <div className="border-b border-gray-100 px-5 pt-5">
        <h2 className="text-base font-bold text-gray-900">
          Tất cả tin đăng ({counts.all})
        </h2>

        {/* Tabs */}
        <div className="mt-4 flex gap-1" role="tablist">
          <TabButton active={tab === 'active'} onClick={() => setTab('active')}>
            Tin đang hoạt động ({counts.active})
          </TabButton>
          <TabButton active={tab === 'sold'} onClick={() => setTab('sold')}>
            Đã bán ({counts.sold})
          </TabButton>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center px-5 py-12 text-center md:py-16">
        <div
          aria-hidden
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400"
        >
          🏠
        </div>
        <p className="text-theme-sm font-semibold text-gray-700">
          {tab === 'active'
            ? 'Chưa có tin đăng nào đang hoạt động'
            : 'Chưa có tin đăng nào đã bán'}
        </p>
        <p className="mt-1 max-w-md text-theme-xs text-gray-500">
          Đăng tin để tiếp cận hàng nghìn khách hàng đang tìm kiếm bất động sản mỗi ngày.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-theme-sm font-bold text-white shadow-theme-md transition hover:bg-brand-600"
        >
          <FiPlus aria-hidden className="h-4 w-4" />
          Đăng tin ngay
        </button>
      </div>
    </section>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`relative -mb-px border-b-2 px-4 py-2.5 text-theme-sm font-semibold transition ${
      active
        ? 'border-brand-500 text-brand-700'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

export default ListingsSection;