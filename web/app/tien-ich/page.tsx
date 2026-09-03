'use client';

import { useCallback, useMemo, useState } from 'react';

import ComingSoonModal from '@/common/components/ComingSoonModal';

import UtilitySearchHeader, { useUtilitySearch } from '@/modules/utilities/components/UtilitySearchHeader';
import UtilitySectionCard from '@/modules/utilities/components/UtilitySectionCard';
import { TONE_CLASSES } from '@/modules/utilities/components/tones';
import { MOCK_UTILITY_SECTIONS } from '@/modules/utilities/mocks/utilities.mock';
import type { UtilityAction } from '@/modules/utilities/models/utility.model';

/**
 * Trang /tien-ich - Bộ tiện ích cho môi giới và khách hàng.
 *
 * Cau truc:
 *   - Header: tieu de trang + mo ta
 *   - Search: filter live theo label/description/keywords + hien thi count
 *   - 7 section cards (Tư vấn, Phong thủy, Thiết kế, Đào tạo, Quản lý,
 *     Pháp lý, Tiện ích khác) - moi section 1 tone mau rieng
 *   - Section 7 (Tien ich khac) full-width cung hang voi grid khac
 *
 * Khi click 1 nut -> mo ComingSoonModal.
 *
 * Data hien tai tu MOCK_UTILITY_SECTIONS (7 sections × ~6-8 actions).
 * Khi co backend: thay bang GET /utilities.
 */
const TienIchPage = () => {
  const [searchKeyword, setSearchKeyword] = useUtilitySearch();
  const [modalAction, setModalAction] = useState<UtilityAction | null>(null);

  const onActionClick = useCallback((action: UtilityAction) => {
    setModalAction(action);
  }, []);

  const onModalClose = useCallback(() => {
    setModalAction(null);
  }, []);

  // Tong so nut dang hien thi (sau filter) + tong so nut
  const { visibleCount, totalCount } = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    let visible = 0;
    let total = 0;
    MOCK_UTILITY_SECTIONS.forEach((section) => {
      section.actions.forEach((action) => {
        total += 1;
        if (!keyword) {
          visible += 1;
          return;
        }
        const matched =
          action.label.toLowerCase().includes(keyword) ||
          action.description.toLowerCase().includes(keyword) ||
          action.keywords?.some((k) => k.toLowerCase().includes(keyword));
        if (matched) visible += 1;
      });
    });
    return { visibleCount: visible, totalCount: total };
  }, [searchKeyword]);

  // Tone class cho modal (lay theo section cua action dang mo)
  const modalToneClass = useMemo(() => {
    if (!modalAction) return 'bg-blue-50 text-blue-600';
    const section = MOCK_UTILITY_SECTIONS.find((s) =>
      s.actions.some((a) => a.publicId === modalAction.publicId),
    );
    if (!section) return 'bg-blue-50 text-blue-600';
    const t = TONE_CLASSES[section.tone];
    return `${t.buttonBg} ${t.buttonIcon}`;
  }, [modalAction]);

  // Khi search khong co ket qua
  const hasNoResults = searchKeyword.trim() && visibleCount === 0;

  return (
    <main className="bg-gray-50/40">
      <div className="site-container py-8 md:py-12">
        {/* Page header */}
        <header className="mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Bộ tiện ích
          </span>
          <h1 className="mt-4 text-3xl font-light leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            Tất cả tiện ích
            <span className="font-bold text-brand-600"> cho môi giới & khách hàng</span>
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600 md:text-lg">
            Công cụ giúp bạn tìm dự án, tư vấn khách hàng, quản lý bán hàng, tra cứu phong thủy và pháp lý — tất cả trong một nền tảng.
          </p>
        </header>

        {/* Search */}
        <div className="mb-8 md:mb-10">
          <UtilitySearchHeader
            value={searchKeyword}
            onChange={setSearchKeyword}
            visibleCount={visibleCount}
            totalCount={totalCount}
          />
        </div>

        {/* Sections grid */}
        {hasNoResults ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-theme-sm text-gray-500">
              Không tìm thấy tiện ích nào khớp với &ldquo;
              <span className="font-semibold text-gray-900">{searchKeyword}</span>&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-theme-xs font-semibold text-white transition hover:bg-brand-600"
            >
              Xóa tìm kiếm
            </button>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {MOCK_UTILITY_SECTIONS.map((section) => (
              <UtilitySectionCard
                key={section.publicId}
                section={section}
                searchKeyword={searchKeyword}
                onActionClick={onActionClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ComingSoonModal
        open={modalAction !== null}
        onClose={onModalClose}
        title={modalAction?.label ?? ''}
        description={modalAction?.description ?? ''}
        icon={modalAction?.icon ?? (() => null)}
        toneClass={modalToneClass}
      />
    </main>
  );
};

export default TienIchPage;