'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useInvestorList } from '@/modules/developer/hooks/useInvestors';
import type { Investor, InvestorSummary } from '@/modules/developer/models/investor.model';

/**
 * Section "CAC CHU DAU TU" tren trang chu.
 *
 * Source data la `useInvestorList()` hook (InvestorService - single source
 * of truth cho 25 investor). Server component route doc data qua
 * HomeService.content() roi truyen xuong qua `initialInvestors` de HTML
 * tra ve co ngay 25 logo (quan trong cho SEO va first paint). Client chi
 * refetch khi stale (5 phut).
 *
 * Khong hard-code logo hay ten o day - data duy nhat tu INVESTORS (25
 * record, khong duplicate).
 *
 * Click logo hoac ten -> /chu-dau-tu/[slug] (route detail da co).
 */
type DoitacProps = {
  initialInvestors?: InvestorSummary[];
};

const Doitac = ({ initialInvestors }: DoitacProps) => {
  const { data, isLoading, isError, refetch } = useInvestorList();
  // Lay data tu hook; initialData (staleTime 5 phut) se co san tu query,
  // nen khong can truyen prop xuong hook. Nhung van fallback neu hook chua
  // co data (trang thai ngay sau SSR).
  const investors = useMemo<Investor[]>(
    () => data?.investors ?? initialInvestors ?? [],
    [data, initialInvestors],
  );

  // Embla carousel - `loop: true` de logo chay vô hanh. Khi chi co 1 logo,
  // embla van cho phep loop nhung khong co hieu ung nen ta van cho phep.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: investors.length > 4,
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
  }, [emblaApi, onSelect, investors.length]);

  const showSkeleton = isLoading && investors.length === 0;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="site-container">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 md:text-2xl">
              Các chủ đầu tư
            </h2>
            <p className="mt-1 text-theme-sm text-gray-500">
              Những chủ đầu tư uy tín đang triển khai dự án trên RealtyHub.
            </p>
          </div>

          <Link
            href="/chu-dau-tu"
            className="inline-flex items-center gap-1 text-theme-sm font-medium text-brand-600 transition hover:text-brand-700"
          >
            Xem tất cả
            <FiChevronRight aria-hidden />
          </Link>
        </div>

        {/* ── Error/Skeleton fallback ───────────────────────────────────── */}
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : showSkeleton ? (
          <LogoSkeletonStrip />
        ) : (
          <div className="relative">
            {/* Embla viewport - mobile/tablet */}
            <div
              ref={emblaRef}
              className="overflow-hidden lg:hidden"
            >
              <div className="flex gap-4">
                {investors.map((investor) => (
                  <div
                    key={investor.slug}
                    className="flex-[0_0_45%] min-w-0 sm:flex-[0_0_30%] md:flex-[0_0_22%]"
                  >
                    <InvestorLogoCard investor={investor} />
                  </div>
                ))}
              </div>
            </div>

            {/* Grid chi desktop */}
            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-4">
              {investors.map((investor) => (
                <InvestorLogoCard key={investor.slug} investor={investor} />
              ))}
            </div>

            {/* Nav buttons: chi hien tren mobile/tablet */}
            {investors.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  aria-label="Chủ đầu tư trước"
                  className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:bg-brand-500 hover:text-white lg:hidden"
                >
                  <FiChevronLeft aria-hidden className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  aria-label="Chủ đầu tư tiếp theo"
                  className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:bg-brand-500 hover:text-white lg:hidden"
                >
                  <FiChevronRight aria-hidden className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Dot indicator - chi mobile/tablet */}
        {!showSkeleton && scrollSnaps.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Đi đến nhóm chủ đầu tư ${idx + 1}`}
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
    </section>
  );
};

/** Card logo + ten. Click chuyen den /chu-dau-tu/[slug]. */
const InvestorLogoCard = ({ investor }: { investor: Investor }) => (
  <Link
    href={`/chu-dau-tu/${investor.slug}`}
    aria-label={`Xem chi tiết chủ đầu tư ${investor.name}`}
    className="group flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
  >
    {/* Logo khung co dinh (aspect-square) de cac logo PNG/WebP kich thuoc
        khac nhau deu render can doi. object-contain giup khong crop. */}
    <span className="relative flex h-16 w-full items-center justify-center overflow-hidden">
      <img
        src={investor.logo}
        alt={investor.name}
        loading="lazy"
        width={128}
        height={128}
        className="max-h-16 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </span>

    <span className="line-clamp-1 text-center text-theme-xs font-semibold uppercase tracking-wide text-gray-700 transition group-hover:text-brand-600">
      {investor.name}
    </span>
  </Link>
);

/** Skeleton cho luc loading - 5 the logo de giu layout on dinh. */
const LogoSkeletonStrip = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-5"
      >
        <div className="h-16 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="rounded-xl border border-error-500/30 bg-error-50 p-6 text-center">
    <p className="mb-3 text-theme-sm text-error-600">
      Không tải được danh sách chủ đầu tư.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-md bg-brand-500 px-4 py-2 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
    >
      Thử lại
    </button>
  </div>
);

export default Doitac;
