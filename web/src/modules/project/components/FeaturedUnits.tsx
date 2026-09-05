'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import UnitCard from './UnitCard';
import type { UnitWithProject } from '../models/project-detail.model';

/**
 * Section "SAN PHAM NOI BAT" tren trang chu.
 *
 * Gom can tu TAT CA du an (khong phai mot du an cu the), chon theo thu tu:
 *   con hang -> du an HOT -> da dang du an (round-robin, toi da 3 can/du an).
 *
 * Data truyen qua `initialUnits` tu HomeService.content() - server side, nen
 * SSR co HTML ngay lan paint dau (tot cho SEO va LCP). Khong can hook vi
 * trang chu khong co tuong tac lam moi danh sach nay.
 *
 * Khi backend co `/units/featured` thi chi can doi service trong home.service.ts.
 */
type FeaturedUnitsProps = {
  /** SSR seed: route page goi service server-side roi truyen xuong */
  initialUnits: UnitWithProject[];
  /** So can lay (mac dinh 12). Gioi han de trang chu khong bi qua nang. */
  limit?: number;
  /** Gioi han so can toi da cua moi du an (mac dinh 3). */
  perProjectLimit?: number;
};

const FeaturedUnits = ({ initialUnits }: FeaturedUnitsProps) => {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="site-container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 md:text-2xl">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-1 text-theme-sm text-gray-500">
              {/* Căn hộ/biệt thự đang mở bán từ nhiều dự án trên toàn hệ thống. */}
            </p>
          </div>
          <Link
            href="/du-an"
            className="inline-flex items-center gap-1 text-theme-sm font-medium text-brand-600 transition hover:text-brand-700"
          >
            Xem tất cả
            <FiChevronRight aria-hidden />
          </Link>
        </div>

        {initialUnits.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-25 p-10 text-center">
            <p className="text-theme-sm text-gray-500">Chưa có sản phẩm nổi bật.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialUnits.map((unit) => (
              <UnitCard key={unit.publicId} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedUnits;
