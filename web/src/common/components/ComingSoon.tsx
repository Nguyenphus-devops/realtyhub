import Link from 'next/link';

import { FiArrowLeft, FiClock } from 'react-icons/fi';

/**
 * Trang placeholder "Chức năng đang phát triển" - dung cho cac route
 * /pdf-converter, /lich-am, /la-ban-phong-thuy... Khi feature ready,
 * the file route tuong ung se duoc thay the.
 *
 * Props:
 *   - title: tien ich (VD: "PDF Converter")
 *   - description: mo ta ngan
 *   - Icon: react-icon component (render to trong card)
 */
type ComingSoonProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  /** Mau toa nen icon: brand (xanh) | jade (xanh la) | accent (cam) | gold (vang) */
  tone?: 'brand' | 'jade' | 'accent' | 'gold';
};

const TONE_BG: Record<NonNullable<ComingSoonProps['tone']>, string> = {
  brand: 'bg-brand-50 text-brand-600',
  jade: 'bg-jade-50 text-jade-600',
  accent: 'bg-accent-50 text-accent-600',
  gold: 'bg-gold-200 text-gold-500',
};

const ComingSoon = ({ title, description, icon: Icon, tone = 'brand' }: ComingSoonProps) => (
  <div className="site-container flex min-h-[calc(100vh-4rem)] items-center py-16">
    <div className="mx-auto max-w-2xl text-center">
      {/* Icon to noi bat */}
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl shadow-theme-sm md:h-32 md:w-32">
        <span
          className={`flex h-full w-full items-center justify-center rounded-3xl ${TONE_BG[tone]}`}
        >
          <Icon aria-hidden className="h-12 w-12 md:h-16 md:w-16" />
        </span>
      </div>

      {/* Eyebrow */}
      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
        <FiClock aria-hidden className="h-3.5 w-3.5" />
        Sắp ra mắt
      </span>

      {/* Title */}
      <h1 className="mt-5 text-3xl font-light leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
        {title}
      </h1>

      {/* Description */}
      <p className="mx-auto mt-5 max-w-xl text-base text-gray-600 md:text-lg">
        {description}
      </p>

      {/* Status card */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-theme-xs">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-warning-500" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-gray-900 md:text-lg">
              Đang trong quá trình phát triển
            </h2>
            <p className="mt-1 text-theme-sm text-gray-600">
              Chúng tôi đang xây dựng tính năng này. Bạn sẽ nhận được thông báo
              ngay khi nó sẵn sàng.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600"
        >
          <FiArrowLeft aria-hidden className="h-4 w-4" />
          Về trang chủ
        </Link>
        <Link
          href="/tro-thanh-moi-gioi"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-theme-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          Đề xuất tính năng
        </Link>
      </div>
    </div>
  </div>
);

export default ComingSoon;