import { Suspense } from 'react';
import type { Metadata } from 'next';
import UnitInventoryPage from '@/modules/project/components/UnitInventoryPage';

export const metadata: Metadata = {
  title: 'Quỹ căn',
  description:
    'Tổng hợp toàn bộ căn/sản phẩm đang có trên tất cả dự án của RealtyHub. Lọc theo dự án, khu vực, phân khu, loại hình, khoảng giá và diện tích.',
};

/**
 * Khung xuong hien trong luc doi Suspense doc tham so URL. Phai khop GRID_CLASS
 * trong UnitInventoryPage, neu khong luoi se nhay mot nhip khi nha skeleton.
 */
const PageFallback = () => (
  <div className="site-container py-8">
    <div className="mx-auto mb-2 h-8 w-40 animate-pulse rounded bg-gray-200" />
    <div className="mx-auto mb-6 h-4 w-80 animate-pulse rounded bg-gray-100" />

    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-11 animate-pulse rounded-md bg-gray-100" />
      ))}
    </div>

    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
          <div className="aspect-16/10 w-full animate-pulse bg-gray-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function QuyCanRoutePage() {
  // UnitInventoryPage doc bo loc qua useSearchParams nen bat buoc Suspense,
  // neu khong Next se bao loi khi prerender trang tinh.
  return (
    <Suspense fallback={<PageFallback />}>
      <UnitInventoryPage />
    </Suspense>
  );
}
