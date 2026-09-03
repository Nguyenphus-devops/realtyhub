'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import { MOCK_NEWS } from '../mocks/news.mock';
import { NEWS_CATEGORY_LABELS, type NewsArticle } from '../models/news.model';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(iso));

const NewsCard = ({ article }: { article: NewsArticle }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition hover:shadow-card-hover">
    <div className="relative aspect-video w-full overflow-hidden">
      <Link href={`/tin-tuc/${article.slug}`} className="block h-full w-full">
        <PlaceholderThumb
          seed={article.publicId}
          src={article.thumbnailUrl || undefined}
          alt={`Ảnh bài viết ${article.title}`}
        />
      </Link>
      <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-semibold text-white">
        {NEWS_CATEGORY_LABELS[article.category]}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-2 p-3">
      <h3 className="line-clamp-2 text-theme-sm font-semibold leading-snug text-gray-800">
        <Link href={`/tin-tuc/${article.slug}`} className="transition hover:text-brand-600">
          {article.title}
        </Link>
      </h3>

      <div className="mt-auto flex items-center justify-between pt-2 text-theme-xs text-gray-500">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        <Link
          href={`/tin-tuc/${article.slug}`}
          className="font-medium text-gray-700 underline underline-offset-2 transition hover:text-brand-600"
        >
          Đọc thêm
        </Link>
      </div>
    </div>
  </article>
);

type NewsSectionProps = {
  /**
   * So bai hien thi o section. Mac dinh 8 (8 moi nhat tu MOCK_NEWS).
   * Mock co 12 bai de phuc vu /tin-tuc listing page - NewsSection (homepage)
   * chi can 8 de carousel/grid khong qua dai.
   */
  limit?: number;
  /** Du lieu tuy bien. Neu khong truyen -> dung MOCK_NEWS (mock only). */
  articles?: NewsArticle[];
};

/**
 * Khoi "Tin tuc" o trang chu - carousel Embla mobile, grid responsive desktop.
 *
 * Layout responsive:
 *   - Mobile (<sm): CAROUSEL Embla, moi lan 1 card full-width (~88vw) + peek
 *     12vw card ke ben canh. Co nut prev/next + dots indicator.
 *   - Tablet (sm): grid 2 cot.
 *   - Desktop (lg): grid 4 cot (toi da 4 tin/row).
 *
 * So luong:
 *   - Mac dinh 8 bai (slice tu MOCK_NEWS). Truyen `limit` khac neu muon.
 *   - 4 cot desktop x 2 row = 8 bai -> can doi: khong thua khong thieu.
 *   - 2 cot tablet x 4 row = 8 bai.
 *
 * Embla pattern giong FeaturedProjects - xem comment o do de biet chi tiet
 * (drag, snap, loop, dot indicator).
 */
const NewsSection = ({ limit = 8, articles }: NewsSectionProps) => {
  const data = (articles ?? MOCK_NEWS).slice(0, limit);
  // Loop can it nhat 3 slides, < 3 thi tat loop de khong co empty space.
  const canLoop = data.length > 3;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: canLoop,
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('reInit', onReInit);
    emblaApi.on('select', onSelect);
    emblaApi.reInit();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="pb-8 pt-2">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">Tin tức</h2>
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1 text-theme-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Xem thêm bài viết
          <FiChevronRight aria-hidden />
        </Link>
      </div>

      {/* ── Mobile carousel (<sm) ───────────────────────────────────────── */}
      <div className="sm:hidden">
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4">
              {data.map((article) => (
                <div key={article.publicId} className="flex-[0_0_88%] min-w-0">
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canLoop && selectedIndex === 0}
            aria-label="Bài viết trước"
            className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:bg-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700"
          >
            <FiChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canLoop && selectedIndex === scrollSnaps.length - 1}
            aria-label="Bài viết tiếp theo"
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:bg-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700"
          >
            <FiChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </div>

        {scrollSnaps.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Đi đến bài viết ${idx + 1}`}
                aria-current={idx === selectedIndex ? 'true' : undefined}
                className={`h-2 rounded-full transition-all ${
                  idx === selectedIndex
                    ? 'w-6 bg-brand-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop grid (sm+) ──────────────────────────────────────────── */}
      <div className="hidden grid-cols-1 gap-5 sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-4">
        {data.map((article) => (
          <NewsCard key={article.publicId} article={article} />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
