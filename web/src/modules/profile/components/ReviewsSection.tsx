'use client';

import { useState } from 'react';

type Rating = 'good' | 'medium' | 'bad';

const RATINGS: { id: Rating; label: string }[] = [
  { id: 'good', label: 'Tốt' },
  { id: 'medium', label: 'Trung bình' },
  { id: 'bad', label: 'Kém' },
];

/**
 * Section "Danh gia" voi filter dropdown + 3 tab (Tot/TB/Kem) + empty state.
 * Mac dinh tab "Tot" duoc chon.
 */
const ReviewsSection = () => {
  const [rating, setRating] = useState<Rating>('good');

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-bold text-gray-900">Đánh giá</h2>
        <p className="mt-1 text-theme-xs text-gray-500">Chưa có đánh giá</p>

        {/* Filter row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-theme-xs text-gray-500">Lọc đánh giá theo:</span>
          <select
            aria-label="Lọc đánh giá"
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-theme-xs text-gray-700 outline-none focus:border-brand-500"
          >
            <option>Tất cả</option>
            <option>Đã xác minh</option>
            <option>Chưa xác minh</option>
          </select>
        </div>

        {/* Tabs rating */}
        <div className="mt-4 flex gap-1" role="tablist">
          {RATINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={rating === r.id}
              onClick={() => setRating(r.id)}
              className={`relative -mb-4 border-b-2 px-4 py-2.5 text-theme-sm font-semibold transition ${
                rating === r.id
                  ? 'border-brand-500 text-brand-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {r.label} (0)
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center px-5 py-12 text-center md:py-16">
        <div
          aria-hidden
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400"
        >
          ⭐
        </div>
        <p className="text-theme-sm font-semibold text-gray-700">Chưa có đánh giá</p>
        <p className="mt-1 max-w-md text-theme-xs text-gray-500">
          Khi có đánh giá mới, chúng sẽ hiển thị tại đây.
        </p>
      </div>
    </section>
  );
};

export default ReviewsSection;