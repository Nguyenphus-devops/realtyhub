'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiVideo,
} from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_TONE,
  type EventItem,
} from '@/modules/events/models/event.model';
import { MOCK_EVENTS } from '@/modules/events/mocks/events.mock';

/**
 * Section "SỰ KIỆN" trên trang chủ.
 *
 * Nguồn data duy nhất: MOCK_EVENTS (module events) - khong duplicate, khong
 * hard-code. Khi backend co GET /events, chỉ cần đổi MOCK_EVENTS thành
 * service call (giống pattern của FeaturedProjects / Doitac).
 *
 * Section này chỉ hiển thị các sự kiện NỔI BẬT/MỚI NHẤT (upcoming + ongoing,
 * sắp xếp theo ngày bắt đầu gần nhất, lấy tối đa 4).
 *
 * Click vào card -> /su-kien/[slug] (route detail đã tồn tại).
 * Click "Xem tất cả" -> /su-kien (route list đã tồn tại).
 *
 * Design đồng bộ với FeaturedProjects và Doitac:
 *   - bg-white, padding y-12 md:y-16
 *   - Header: title uppercase bold + subtitle gray-500 + "Xem tất cả" màu brand-600
 *   - Mobile: embla carousel (peek card kế bên)
 *   - Desktop: grid 4 cột
 */

const HOME_EVENTS_LIMIT = 4;

/** Tính status theo thời gian thực (giống app/su-kien/page.tsx). */
const NOW = new Date('2026-08-09T15:00:00.000+07:00');

const computeStatus = (event: EventItem): EventItem['status'] => {
  const start = new Date(event.startAt).getTime();
  const end = event.endAt
    ? new Date(event.endAt).getTime()
    : start + 2 * 60 * 60 * 1000;
  const nowMs = NOW.getTime();

  if (event.capacity && event.registered >= event.capacity) return 'full';
  if (nowMs < start) return 'upcoming';
  if (nowMs >= start && nowMs <= end) return 'ongoing';
  return 'past';
};

/** Lấy N sự kiện nổi bật để hiển thị trên home (chỉ upcoming + ongoing + full). */
const pickFeaturedEvents = (limit: number): EventItem[] => {
  const withStatus = MOCK_EVENTS.map((e) => ({ ...e, status: computeStatus(e) }));
  return withStatus
    .filter((e) => e.status === 'upcoming' || e.status === 'ongoing' || e.status === 'full')
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, limit);
};

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(iso));

const formatTime = (iso: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(iso));

const EventsSection = () => {
  // Khong duplicate data - doc thang tu MOCK_EVENTS (1 lan).
  const events = useMemo(() => pickFeaturedEvents(HOME_EVENTS_LIMIT), []);

  // Embla carousel: chi hien thi tren mobile/tablet (<lg). Desktop dung grid.
  const canLoop = events.length > 3;
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
  }, [emblaApi, onSelect, events.length]);

  if (events.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="site-container">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 md:text-2xl">
              Sự kiện
            </h2>
            <p className="mt-1 text-theme-sm text-gray-500">
              {/* Workshop, hội thảo và networking mới nhất từ RealtyHub. */}
            </p>
          </div>
          <Link
            href="/su-kien"
            className="inline-flex items-center gap-1 text-theme-sm font-medium text-brand-600 transition hover:text-brand-700"
          >
            Xem tất cả
            <FiArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile carousel (<lg) */}
        <div className="lg:hidden">
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">
                {events.map((event) => (
                  <div
                    key={event.publicId}
                    className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_45%] md:flex-[0_0_32%]"
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>

            {events.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  aria-label="Sự kiện trước"
                  className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:bg-brand-500 hover:text-white"
                >
                  <FiChevronLeft aria-hidden className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  aria-label="Sự kiện tiếp theo"
                  className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-card transition hover:bg-brand-500 hover:text-white"
                >
                  <FiChevronRight aria-hidden className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {scrollSnaps.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {scrollSnaps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(idx)}
                  aria-label={`Đi đến sự kiện ${idx + 1}`}
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

        {/* Desktop grid (lg+) */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
          {events.map((event) => (
            <EventCard key={event.publicId} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

/** Card 1 sự kiện - click chuyển đến /su-kien/[slug]. */
const EventCard = ({ event }: { event: EventItem }) => {
  const tone = EVENT_TYPE_TONE[event.type];
  const isOngoing = event.status === 'ongoing';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md">
      {/* Thumbnail */}
      <Link
        href={`/su-kien/${event.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={event.title}
      >
        <PlaceholderThumb
          seed={event.slug}
          src={event.coverImage}
          label={event.title}
          alt={event.title}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Date badge (top-left) */}
        <div className="absolute left-3 top-3 flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-white px-2 py-2 text-center shadow-theme-md">
          <span className="font-serif text-xl font-bold leading-none text-gray-900">
            {new Date(event.startAt).getDate()}
          </span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
            Th{new Date(event.startAt).getMonth() + 1}
          </span>
        </div>

        {/* Type chip (top-right) */}
        <span
          className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] ${tone.chip}`}
        >
          {EVENT_TYPE_LABELS[event.type]}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {isOngoing && (
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-theme-xs font-bold uppercase tracking-[0.15em] text-rose-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            Đang diễn ra
          </div>
        )}

        <h3 className="font-serif text-lg font-bold leading-tight text-gray-900 md:text-xl">
          <Link href={`/su-kien/${event.slug}`} className="transition hover:text-purple-600">
            {event.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-theme-sm leading-relaxed text-gray-600">
          {event.excerpt}
        </p>

        {/* Meta */}
        <ul className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-theme-xs text-gray-500">
          <li className="flex items-center gap-1.5">
            <FiClock aria-hidden className="h-3.5 w-3.5" />
            <span>
              {formatDate(event.startAt)} · {formatTime(event.startAt)}
            </span>
          </li>
          <li className="flex items-center gap-1.5">
            {event.location.isOnline ? (
              <FiVideo aria-hidden className="h-3.5 w-3.5" />
            ) : (
              <FiMapPin aria-hidden className="h-3.5 w-3.5" />
            )}
            <span className="truncate">{event.location.name}</span>
          </li>
        </ul>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className={`font-serif text-base font-bold ${tone.accent}`}>
            {event.isFree
              ? 'Miễn phí'
              : new Intl.NumberFormat('vi-VN').format(event.price ?? 0) + 'đ'}
          </span>
          <Link
            href={`/su-kien/${event.slug}`}
            className="inline-flex items-center gap-1 text-theme-sm font-semibold text-purple-600 hover:underline"
          >
            Xem chi tiết
            <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventsSection;
