'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineBuildingOffice2, HiOutlineHomeModern } from 'react-icons/hi2';
import type { HomeBannerSlide } from '../models/home.model';
import HeroCarousel from './HeroCarousel';

const QUICK_FILTERS = [
  { label: 'Căn hộ', segment: 'cao-tang' as const, icon: HiOutlineBuildingOffice2 },
  { label: 'Thấp tầng', segment: 'thap-tang' as const, icon: HiOutlineHomeModern },
];


const SEARCH_PROMPTS = [
  'Tên dự án, khu vực, chủ đầu tư...',
  'Vinhomes Grand Park',
  'Căn hộ Quận 2 dưới 3 tỷ',
  'Shophouse mặt tiền lớn',
  'Khu đô thị vệ tinh Hà Nội',
];

const TYPE_SPEED_MS = 70; // thoi gian giua cac lan go mot chu
const DELETE_SPEED_MS = 35; // xoa nhanh hon go
const PAUSE_AFTER_TYPE_MS = 1400; // dung lai khi go xong truoc khi xoa

type HeroSearchProps = {
  /** Tat ca banner se xoay vong trong carousel. Neu chi co 1 van render binh thuong. */
  slides: HomeBannerSlide[];
};


type TypePhase = 'typing' | 'pausing' | 'deleting';

const HeroSearch = ({ slides }: HeroSearchProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [state, setState] = useState<{ index: number; charCount: number; phase: TypePhase }>({
    index: 0,
    charCount: 0,
    phase: 'typing',
  });

  // Hieu ung typewriter: go chu -> pause -> xoa -> next cau. Khi user da go
  // vao input (keyword !rỗng) thi dung hanh vi nay lai.
  useEffect(() => {
    if (keyword) return undefined;
    let delay: number;
    switch (state.phase) {
      case 'typing':
        delay = TYPE_SPEED_MS;
        break;
      case 'pausing':
        delay = PAUSE_AFTER_TYPE_MS;
        break;
      case 'deleting':
        delay = DELETE_SPEED_MS;
        break;
      default:
        delay = TYPE_SPEED_MS;
    }
    const id = setTimeout(() => {
      setState((prev) => {
        const text = SEARCH_PROMPTS[prev.index] ?? '';
        if (prev.phase === 'typing') {
          if (prev.charCount >= text.length) {
            return { ...prev, phase: 'pausing' };
          }
          return { ...prev, charCount: prev.charCount + 1 };
        }
        if (prev.phase === 'pausing') {
          return { ...prev, phase: 'deleting' };
        }
        // deleting
        if (prev.charCount <= 0) {
          const nextIndex = (prev.index + 1) % SEARCH_PROMPTS.length;
          return { index: nextIndex, charCount: 0, phase: 'typing' };
        }
        return { ...prev, charCount: prev.charCount - 1 };
      });
    }, delay);
    return () => clearTimeout(id);
  }, [keyword, state]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = keyword.trim();
    router.push(trimmed ? `/gio-hang?q=${encodeURIComponent(trimmed)}` : '/gio-hang');
  };

  const [firstBanner] = slides;

  return (
    
    <section className="relative isolate -mt-16 flex min-h-[704px] items-center overflow-hidden pt-16 lg:min-h-[824px]">
      {/* Carousel 3 anh that - mobile/desktop rieng */}
      <HeroCarousel slides={slides} />

      
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-black/35"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/55"
      />

      <div className="site-container pb-20 md:pb-28 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-wide [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)] md:text-4xl lg:text-5xl">
            {firstBanner?.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-theme-sm leading-relaxed [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)] md:text-base">
            {firstBanner?.subtitle}
          </p>
        </div>

        {/* Thanh tim kiem - card trang noi bat nen nen mau dam */}
        <form
          onSubmit={submitSearch}
          role="search"
          aria-label="Tìm kiếm dự án"
          className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 shadow-panel md:mt-10"
        >
          <label htmlFor="home-search" className="sr-only">
            Tìm dự án
          </label>
          <div className="flex flex-1 items-center gap-2 pl-4">
            <div className="relative flex-1">
              <input
                id="home-search"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                aria-label="Tìm dự án"
                className="w-full bg-transparent py-2.5 text-theme-sm text-gray-800 outline-none"
                autoComplete="off"
              />
              
              {keyword === '' && (() => {
                const text = SEARCH_PROMPTS[state.index] ?? '';
                const visible = text.slice(0, state.charCount);
                return (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
                  >
                    <span className="whitespace-nowrap text-theme-sm text-gray-400">
                      {visible}
                      <span className="ml-0.5 inline-block h-4 w-px -translate-y-0.5 bg-gray-400 align-middle animate-pulse" />
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          <button
            type="submit"
            aria-label="Tìm kiếm"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-500 px-3 py-2.5 text-theme-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 sm:px-5"
          >
            
            <span className="hidden sm:inline">Tìm kiếm</span>
            <svg
              data-testid="icon-ai-search"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="currentColor"
              className="inline-block size-5 shrink-0 sm:size-4"
            >
              <path
                fillRule="evenodd"
                d="m17.998 11.181-.243.445c-.759 1.387-2.751 1.387-3.51 0l-.75-1.371-1.37-.75c-1.388-.759-1.388-2.751 0-3.51l1.37-.75.75-1.37c.759-1.388 2.751-1.388 3.51 0l.75 1.37 1.37.75c1.388.759 1.388 2.75.001 3.51l-1.371.75zM16 4.834l-.459.839-.572 1.046-1.885 1.031 1.885 1.031L16 10.666l1.031-1.885 1.885-1.03-1.885-1.032z"
              />
              <path d="M11 18a7 7 0 0 0 6.046-3.47 3.94 3.94 0 0 0 2.463-1.944l.46-.842a8.96 8.96 0 0 1-1.937 4.874l3.675 3.675a1 1 0 0 1-1.414 1.414l-3.675-3.675A9 9 0 1 1 12.97 2.217q-.27.313-.48.698l-.47.857-.457.25A7 7 0 1 0 11 18m9.125-15.486a.4.4 0 0 1 .75 0l.101.273a.4.4 0 0 0 .237.237l.273.1a.4.4 0 0 1 0 .751l-.273.101a.4.4 0 0 0-.237.237l-.1.273a.4.4 0 0 1-.751 0l-.101-.273a.4.4 0 0 0-.237-.237l-.273-.1a.4.4 0 0 1 0-.751l.273-.101a.4.4 0 0 0 .237-.237l.1-.273Z" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSearch;