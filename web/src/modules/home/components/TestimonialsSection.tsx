'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

import UserAvatar from '@/common/components/UserAvatar';

import type { HomeTestimonial } from '../models/home.model';


const TestimonialsSection = ({ testimonials }: { testimonials: HomeTestimonial[] }) => {
  if (testimonials.length === 0) return null;

  return (
    <section
      className="bg-white py-10 md:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="site-container">
        {/* Header: eyebrow + h2 + sub */}
        <Header />

        {/* Carousel */}
        <Carousel testimonials={testimonials} />
      </div>
    </section>
  );
};

// ============ Header ============
const Header = () => (
  <div className="mx-auto max-w-2xl text-center">
    <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      Khách hàng nói gì
    </span>
    <h2
      id="testimonials-heading"
      className="mt-4 text-3xl font-light leading-tight tracking-tight text-gray-900 md:text-4xl"
    >
      Được khách hàng
      <br className="hidden md:inline" />
      <span className="font-bold text-brand-600"> tin tưởng và lựa chọn</span>
    </h2>
    <p className="mt-4 text-theme-sm text-gray-600 md:text-base">
      Hơn 50.000 khách hàng đã sử dụng RealtyHub để tìm và chọn mua bất động sản.
    </p>
  </div>
);

// ============ Carousel ============
type CarouselProps = { testimonials: HomeTestimonial[] };

const Carousel = ({ testimonials }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [perView, setPerView] = useState(3);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Responsive: 1 card mobile, 2 tablet, 3 desktop
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // maxIndex = vi tri cuoi cung ma van show du 1 card day (vi du 4 testimonials,
  // perView 3 -> maxIndex = 1, scroll 0->1).
  const maxIndex = Math.max(0, testimonials.length - perView);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.min(Math.max(0, index), maxIndex));
    },
    [maxIndex],
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (isPaused || testimonials.length <= perView) return undefined;
    timerRef.current = setTimeout(goNext, 6000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isPaused, goNext, testimonials.length, perView]);

  // % translate theo perView (vi du 3 cards -> translate 33.333%)
  const translatePercent = perView === 1 ? 100 : perView === 2 ? 50 : 33.3333;

  return (
    <div
      className="mt-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* Track wrapper - overflow hidden, giu kich thuoc */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${activeIndex * translatePercent}%)`,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.publicId}
              className="shrink-0 px-3"
              style={{
                width: `${100 / perView}%`,
              }}
            >
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls: arrows + dots */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <ArrowButton direction="prev" onClick={goPrev} disabled={testimonials.length <= perView} />
        <Dots
          count={maxIndex + 1}
          active={activeIndex}
          onSelect={(i) => goTo(i)}
        />
        <ArrowButton direction="next" onClick={goNext} disabled={testimonials.length <= perView} />
      </div>
    </div>
  );
};

// ============ Card ============
const TestimonialCard = ({ testimonial }: { testimonial: HomeTestimonial }) => (
  <article
    className="group relative h-full rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-xs transition hover:-translate-y-1 hover:border-gray-200 hover:shadow-theme-md md:p-8"
  >
    {/* Quote icon decor */}
    <div
      aria-hidden
      className="absolute right-6 top-6 text-5xl font-serif leading-none text-brand-100 md:text-6xl"
    >
      &ldquo;
    </div>

    {/* Rating */}
    <div className="flex items-center gap-0.5" aria-label={`${testimonial.rating} trên 5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          aria-hidden
          className={`h-4 w-4 ${
            i < testimonial.rating
              ? 'fill-warning-500 text-warning-500'
              : 'text-gray-200'
          }`}
        />
      ))}
    </div>

    {/* Quote */}
    <blockquote className="mt-5 text-base leading-relaxed text-gray-800 md:text-lg">
      &ldquo;{testimonial.quote}&rdquo;
    </blockquote>

    {/* Footer: avatar + name + role + project */}
    <footer className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
      <UserAvatar
        name={testimonial.authorName}
        src={testimonial.avatar}
        size={48}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-theme-sm font-bold text-gray-900">
          {testimonial.authorName}
        </div>
        <div className="truncate text-theme-xs text-gray-500">
          {testimonial.authorRole}
        </div>
      </div>
    </footer>

    {testimonial.relatedProject && (
      <div className="mt-3 flex items-center gap-1.5 text-theme-xs text-gray-500">
        <span className="h-1 w-1 rounded-full bg-gray-400" />
        <span>Dự án: {testimonial.relatedProject}</span>
      </div>
    )}
  </article>
);

// ============ Arrow ============
const ArrowButton = ({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}) => {
  const Icon = direction === 'prev' ? FiChevronLeft : FiChevronRight;
  const label = direction === 'prev' ? 'Đánh giá trước' : 'Đánh giá tiếp theo';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-theme-xs transition hover:border-brand-500 hover:bg-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700"
    >
      <Icon aria-hidden className="h-5 w-5" />
    </button>
  );
};

// ============ Dots ============
const Dots = ({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) => (
  <div className="flex gap-2" role="tablist" aria-label="Chọn trang đánh giá">
    {Array.from({ length: count }).map((_, i) => {
      const isActive = i === active;
      return (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={`Đi tới trang ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-2 rounded-full transition-all ${
            isActive
              ? 'w-8 bg-brand-500'
              : 'w-2 bg-gray-300 hover:bg-gray-400'
          }`}
        />
      );
    })}
  </div>
);

export default TestimonialsSection;