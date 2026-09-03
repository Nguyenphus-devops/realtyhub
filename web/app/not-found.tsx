import Link from 'next/link';

import {
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiMail,
  FiMessageCircle,
  FiSearch,
} from 'react-icons/fi';

/**
 * 404 - Trang khong tim thay.
 *
 * Next.js 16 convention: file not-found.tsx o root app/ -> render khi
 * - User truy cap URL khong match (404)
 * - Component goi notFound() trong server component
 *
 * UI: full-page (khong chrome header/footer) vi user can tap trung vao
 * action de quay lai flow chinh.
 */
const NotFound = () => (
  <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-brand-950 to-cyan-950 text-white">
    {/* Background grid pattern */}
    <div
      aria-hidden
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }}
    />

    {/* Floating glow blobs */}
    <div
      aria-hidden
      className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
    />
    <div
      aria-hidden
      className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl"
    />

    {/* Top bar (minimal - just a logo link back home) */}
    <div className="site-container relative z-10 flex items-center justify-between py-6">
      <Link
        href="/"
        aria-label="Về trang chủ RealtyHub"
        className="inline-flex items-center gap-2 text-theme-sm font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
      >
        <FiHome aria-hidden className="h-4 w-4" />
        RealtyHub
      </Link>
      <Link
        href="/lien-he-chung-toi"
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-theme-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition hover:bg-white/10"
      >
        <FiMail aria-hidden className="h-3.5 w-3.5" />
        Liên hệ hỗ trợ
      </Link>
    </div>

    {/* Main content */}
    <div className="site-container relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12 text-center">
      {/* 404 - animated block */}
      <div className="relative">
        {/* Giant 404 text */}
        <h1
          aria-label="Lỗi 404 - Trang không tồn tại"
          className="font-serif text-[160px] font-bold leading-none tracking-tighter text-white md:text-[240px] lg:text-[300px]"
        >
          <span className="bg-gradient-to-br from-cyan-300 via-cyan-400 to-brand-400 bg-clip-text text-transparent">
            4
          </span>
          <span className="relative inline-block">
            <span
              aria-hidden
              className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/20 blur-2xl"
            />
            <span className="relative bg-gradient-to-br from-brand-300 via-orange-300 to-orange-400 bg-clip-text text-transparent">
              0
            </span>
          </span>
          <span className="bg-gradient-to-br from-cyan-300 via-cyan-400 to-brand-400 bg-clip-text text-transparent">
            4
          </span>
        </h1>

        {/* House icon floating */}
        <span
          aria-hidden
          className="absolute -right-6 top-12 inline-flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-theme-lg backdrop-blur-md md:-right-10 md:top-16 md:h-20 md:w-20 md:text-4xl"
          style={{ animationDuration: '3s' }}
        >
          🏠
        </span>
        <span
          aria-hidden
          className="absolute -bottom-4 -left-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-theme-lg backdrop-blur-md md:-bottom-6 md:-left-10 md:h-16 md:w-16 md:text-3xl"
          style={{ animation: 'bounce 3.5s infinite' }}
        >
          🔍
        </span>
      </div>

      {/* Heading */}
      <div className="mt-8 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
          Trang không tồn tại
        </span>
        <h2 className="mt-5 font-serif text-3xl font-light leading-tight md:text-4xl lg:text-5xl">
          Ôi, trang này{' '}
          <span className="font-bold text-cyan-400">đã &ldquo;bốc hơi&rdquo;</span>!
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
          Có thể đường dẫn bị sai, hoặc căn hộ này đã được bán. Đừng lo — RealtyHub vẫn còn rất
          nhiều lựa chọn tuyệt vời khác đang chờ bạn.
        </p>
      </div>

      {/* Search bar (decorative) */}
      <Link
        href="/gio-hang"
        className="mt-10 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-left text-white shadow-theme-md backdrop-blur-md transition hover:bg-white/15"
      >
        <FiSearch aria-hidden className="h-5 w-5 text-white/70" />
        <span className="flex-1 text-base text-white/70">
          Tìm dự án, căn hộ, khu vực bạn quan tâm...
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-white/85">
          Enter
          <FiArrowRight aria-hidden className="h-3 w-3" />
        </span>
      </Link>

      {/* Primary actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-theme-md transition hover:bg-cyan-600"
        >
          <FiHome aria-hidden className="h-4 w-4" />
          Về trang chủ
        </Link>
        <Link
          href="/gio-hang"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
        >
          Khám phá dự án
          <FiArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>

      {/* Popular links */}
      <div className="mt-16 w-full max-w-3xl">
        <p className="text-theme-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          Hoặc thử những trang phổ biến
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {POPULAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            >
              <span
                aria-hidden
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl transition group-hover:scale-110"
              >
                {link.emoji}
              </span>
              <div className="min-w-0">
                <div className="truncate font-serif text-sm font-bold text-white md:text-base">
                  {link.label}
                </div>
                <div className="truncate text-theme-xs text-white/65">{link.desc}</div>
              </div>
              <FiArrowRight
                aria-hidden
                className="ml-auto h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-cyan-300"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Help footer */}
      <div className="mt-14 flex items-center gap-2 text-theme-xs text-white/55">
        <FiMessageCircle aria-hidden className="h-3.5 w-3.5" />
        <span>
          Vẫn cần giúp?{' '}
          <Link
            href="/lien-he-chung-toi"
            className="font-semibold text-cyan-300 underline-offset-2 transition hover:text-cyan-200 hover:underline"
          >
            Chat với chúng tôi
          </Link>
        </span>
      </div>
    </div>

    {/* Back-to-top hint (visual) */}
    <Link
      href="/"
      aria-label="Quay lại"
      className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-theme-xs font-semibold text-white/65 backdrop-blur-sm transition hover:bg-white/10 md:inline-flex"
    >
      <FiArrowLeft aria-hidden className="h-3.5 w-3.5" />
      Quay lại
    </Link>
  </main>
);

// ============================================================================
// Static content
// ============================================================================

const POPULAR_LINKS = [
  { emoji: '🏗️', label: 'Dự án', desc: 'Khám phá 250+ dự án', href: '/gio-hang' },
  { emoji: '🏠', label: 'Căn hộ', desc: 'Tìm căn phù hợp', href: '/gio-hang?type=can-ho' },
  { emoji: '📰', label: 'Tin tức', desc: 'Cập nhật thị trường', href: '/tin-tuc' },
  { emoji: '🎓', label: 'Đào tạo', desc: 'Khóa học BĐS miễn phí', href: '/dao-tao' },
  { emoji: '📅', label: 'Sự kiện', desc: 'Workshop & offline event', href: '/su-kien' },
  { emoji: '💼', label: 'Trở thành môi giới', desc: 'Kiếm thu nhập không giới hạn', href: '/tro-thanh-moi-gioi' },
];

export default NotFound;
