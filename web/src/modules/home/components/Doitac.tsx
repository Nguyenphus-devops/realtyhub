'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useInvestorList } from '@/modules/developer/hooks/useInvestors';
import type { Investor, InvestorSummary } from '@/modules/developer/models/investor.model';

/**
 * Section "CAC CHU DAU TU" tren trang chu - dang CAROUSEL 4 logo/slide
 * desktop, 2-3 logo/slide tablet/mobile.
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
 *
 * Carousel: embla-carousel-react, responsive slidesToScroll:
 *   - mobile (<sm):    2 logo / slide
 *   - tablet (sm..md): 3 logo / slide
 *   - desktop (md..lg): 4 logo / slide
 *   - wide (>=lg):     4 logo / slide
 *
 * Auto-play: 5s/slide, pause khi hover, pause khi user tuong tac.
 */
type DoitacProps = {
  initialInvestors?: InvestorSummary[];
};

const Doitac = ({ initialInvestors }: DoitacProps) => {
  const { data, isLoading, isError, refetch } = useInvestorList();
  const investors = useMemo<Investor[]>(
    () => data?.investors ?? initialInvestors ?? [],
    [data, initialInvestors],
  );

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="site-container">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-3 text-left md:mb-10">

          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 md:text-2xl">
            Đối tác chiến lược của Realty HUB
          </h2>

          <p className="text-theme-sm text-gray-500">
            {/* Những chủ đầu tư uy tín đang triển khai dự án trên RealtyHub. */}
          </p>

        </div>

        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : isLoading && investors.length === 0 ? (
          <LogoSkeletonStrip />
        ) : (
          <InvestorCarousel investors={investors} />
        )}
      </div>
    </section>
  );
};

// ============================================================================
// InvestorCarousel - embla responsive, 4 logo/slide desktop, 2-3 mobile/tablet
// ============================================================================

const InvestorCarousel = ({ investors }: { investors: Investor[] }) => {
  // Responsive slidesToScroll theo viewport.
  // embla khong ho tro reactive breakpoint, nen ta dung ref callback de
  // reInit khi viewport doi (qua matchMedia).
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [canLoop, setCanLoop] = useState(investors.length > 4);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: canLoop,
      slidesToScroll: 1,
      skipSnaps: false,
      containScroll: 'trimSnaps',
    },
    [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // ── Responsive: cap nhat slidesToScroll theo viewport ───────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const compute = () => {
      const width = window.innerWidth;
      let per = 4;
      if (width < 640) per = 2;
      else if (width < 1024) per = 3;
      else per = 4;
      setSlidesPerView(per);
      setCanLoop(investors.length > per);
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [investors.length]);

  // ── Auto-play 5s/slide, pause khi hover ──────────────────────────────
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveredRef = useRef(false);
  const userInteractedRef = useRef(false);

  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;
    if (autoplayTimerRef.current) return;
    autoplayTimerRef.current = setInterval(() => {
      if (isHoveredRef.current) return;
      if (!emblaApi) return;
      // CanLoop moi auto-play, neu khong loop thi dung.
      if (!emblaApi.canScrollNext()) return;
      emblaApi.scrollNext();
    }, 5000);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('reInit', onReInit);
    emblaApi.on('select', onSelect);
    emblaApi.on('pointerUp', () => {
      userInteractedRef.current = true;
    });

    onReInit();
    startAutoplay();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onReInit);
      stopAutoplay();
    };
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    userInteractedRef.current = true;
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    userInteractedRef.current = true;
  }, [emblaApi]);

  const scrollTo = useCallback(
    (idx: number) => {
      emblaApi?.scrollTo(idx);
      userInteractedRef.current = true;
    },
    [emblaApi],
  );

  const showControls = investors.length > slidesPerView;

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* ── Carousel viewport ─────────────────────────────────────────── */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {investors.map((investor) => (
            <div
              key={investor.slug}
              className="min-w-0 flex-[0_0_50%] sm:flex-[0_0_33.333%] lg:flex-[0_0_25%]"
              style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
            >
              <InvestorLogoCard investor={investor} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Prev/Next buttons ─────────────────────────────────────────── */}
      {showControls && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Chủ đầu tư trước"
            className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:border-brand-300 hover:bg-brand-500 hover:text-white md:-translate-x-2"
          >
            <FiChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Chủ đầu tư tiếp theo"
            className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:border-brand-300 hover:bg-brand-500 hover:text-white md:translate-x-2"
          >
            <FiChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </>
      )}

      {/* ── Dot indicators ────────────────────────────────────────────── */}
      {scrollSnaps.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
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
  );
};

// ============================================================================
// InvestorLogoCard - card logo + ten. Click chuyen den /chu-dau-tu/[slug]
// ============================================================================

const InvestorLogoCard = ({ investor }: { investor: Investor }) => (
  <Link
    href={`/chu-dau-tu/${investor.slug}`}
    aria-label={`Xem chi tiết chủ đầu tư ${investor.name}`}
    className="group flex h-full aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-theme-xs transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
  >
    {/* Logo container co dinh ty le de cac logo PNG/WebP khac nhau deu
        render can doi. object-contain giup khong crop, khong meo. */}
    <span className="relative flex w-full max-w-[160px] flex-1 items-center justify-center overflow-hidden">
      <img
        src={investor.logo}
        alt={investor.name}
        loading="lazy"
        width={160}
        height={70}
        className="max-h-[70px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </span>

    <span className="line-clamp-1 text-center text-theme-xs font-semibold uppercase tracking-wide text-gray-700 transition group-hover:text-brand-600">
      {investor.name}
    </span>
  </Link>
);

// ============================================================================
// LogoSkeletonStrip - 4 the logo placeholder luc loading
// ============================================================================

const LogoSkeletonStrip = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-6"
      >
        <div className="h-12 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

// ============================================================================
// ErrorState
// ============================================================================

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
