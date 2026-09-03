import Image from 'next/image';
import Link from 'next/link';

import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiThumbsUp,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

import FeedbackForm from '@/modules/feedback/components/FeedbackForm';

import type { Metadata } from 'next';

import {
  FEEDBACK_CATEGORY_ICONS,
  FEEDBACK_CATEGORY_LABELS,
  FEEDBACK_RATING_TONE,
  FEEDBACK_STATS,
  type FeedbackItem,
  FEEDBACK_STATUS_LABELS,
  FEEDBACK_STATUS_TONE,
  FEEDBACK_ROADMAP,
  MOCK_RECENT_FEEDBACKS,
} from '@/modules/feedback/mocks/feedback.mock';

/**
 * Trang /gop-y-va-phan-hoi - Bang tin gop y cong khai cua RealtyHub.
 *
 * Layout (server component + 1 client form):
 *   01 Hero (gradient navy -> orange, breadcrumb + 3 so lieu stat)
 *   02 Form + sidebar (form 3 col, sidebar 2 col)
 *   03 Recent feedbacks (6 mock card, public wall)
 *   04 Roadmap (4 features sap ra mat dua tren feedback)
 *   05 CTA (len y tuong / bao loi)
 *
 * Tone: orange (warm - gop y la "doi thoai", khong phai "mua ban").
 * Phan biet voi /lien-he-chung-toi (jade = lien lac kinh doanh).
 */
export const metadata: Metadata = {
  title: 'Góp ý & phản hồi',
  description:
    'Chia sẻ góp ý, báo lỗi hoặc đề xuất tính năng cho RealtyHub. Mọi phản hồi đều được đội ngũ xem xét và phản hồi công khai.',
};

// ============================================================================
// Helpers
// ============================================================================

const formatTimeAgo = (iso: string): string => {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} ngày trước`;
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(iso));
};

// ============================================================================
// Page
// ============================================================================

const FeedbackPage = () => (
  <main className="bg-white">
    {/* ============ 01 HERO ============ */}
    <section className="relative isolate overflow-hidden bg-gray-900 py-16 text-white md:py-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/gop-y-va-phan-hoi.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/92 via-brand-950/88 to-orange-950/92" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="site-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-theme-xs text-white/60">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/90">Góp ý & phản hồi</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            Lắng nghe từ bạn
          </span>

          <h1 className="mt-6 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
            Giúp RealtyHub
            <br />
            <span className="font-bold text-orange-400">tốt hơn mỗi ngày</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            Mỗi góp ý đều được đội ngũ đọc và phản hồi công khai. Gửi lỗi, đề xuất
            tính năng hoặc đánh giá trải nghiệm — không cần đăng nhập.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <HeroStat
              icon={FiUsers}
              value={FEEDBACK_STATS.totalReceived.toLocaleString('vi-VN')}
              label="Góp ý đã nhận"
            />
            <HeroStat
              icon={FiCheckCircle}
              value={FEEDBACK_STATS.totalShipped.toString()}
              label="Đã triển khai"
              accent="text-orange-300"
            />
            <HeroStat
              icon={FiClock}
              value={`${FEEDBACK_STATS.avgResponseHours}h`}
              label="Phản hồi trung bình"
            />
            <HeroStat
              icon={FiThumbsUp}
              value={`${FEEDBACK_STATS.upvoteRate}%`}
              label="Được đồng thuận"
            />
          </div>
        </div>
      </div>
    </section>

    {/* ============ 02 FORM + SIDEBAR ============ */}
    <section className="site-container py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        {/* Form (trai - 3 col) */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              Gửi góp ý
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              Chia sẻ của bạn
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Càng chi tiết, team càng xử lý nhanh. Bạn có thể đính kèm ảnh minh hoạ
              hoặc gửi ẩn danh nếu muốn.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-theme-xs md:p-10">
            <FeedbackForm />
          </div>
        </div>

        {/* Sidebar (phai - 2 col) */}
        <aside className="lg:col-span-2">
          <div className="sticky top-8 space-y-6">
            {/* Guidelines card */}
            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 md:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-theme-sm">
                <FiThumbsUp aria-hidden className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">
                Góp ý hiệu quả
              </h3>
              <ul className="mt-4 space-y-3 text-theme-sm text-gray-700">
                <li className="flex gap-2">
                  <FiCheckCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>Mô tả rõ <strong>vấn đề</strong> hoặc <strong>đề xuất</strong></span>
                </li>
                <li className="flex gap-2">
                  <FiCheckCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>Kèm <strong>ảnh chụp màn hình</strong> nếu là lỗi</span>
                </li>
                <li className="flex gap-2">
                  <FiCheckCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>Ghi rõ <strong>trình duyệt / thiết bị</strong> gặp lỗi</span>
                </li>
                <li className="flex gap-2">
                  <FiCheckCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>Tôn trọng cộng đồng — không spam hoặc quảng cáo</span>
                </li>
              </ul>
            </div>

            {/* Public wall note */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-700">
                <FiTrendingUp aria-hidden className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">
                Minh bạch & công khai
              </h3>
              <p className="mt-3 text-theme-sm leading-relaxed text-gray-700">
                Mọi góp ý (trừ ẩn danh) đều hiển thị ở{' '}
                <strong>bảng tin công khai</strong> bên dưới — kèm trạng thái xử lý
                và phản hồi từ team. Bạn có thể upvote các góp ý hay.
              </p>
            </div>

            {/* Categories */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Chuyên mục phổ biến
              </h3>
              <ul className="mt-4 space-y-2 text-theme-sm text-gray-700">
                {(['tinh-nang', 'ui-ux', 'hieu-nang', 'noi-dung', 'dich-vu'] as const).map(
                  (cat) => (
                    <li key={cat} className="flex items-center gap-2">
                      <span aria-hidden className="text-base">
                        {FEEDBACK_CATEGORY_ICONS[cat]}
                      </span>
                      <span>{FEEDBACK_CATEGORY_LABELS[cat]}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* ============ 03 RECENT FEEDBACKS ============ */}
    <section className="border-y border-gray-200 bg-gray-50/60 py-16 md:py-24">
      <div className="site-container">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
            Bảng tin công khai
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            Góp ý gần đây
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Cộng đồng đã nói gì — và đội ngũ RealtyHub đã phản hồi ra sao.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_RECENT_FEEDBACKS.map((fb) => (
            <FeedbackCard key={fb.publicId} feedback={fb} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-theme-sm font-semibold text-gray-700 shadow-theme-xs transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
          >
            Xem tất cả góp ý
            <FiArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* ============ 04 ROADMAP ============ */}
    <section className="site-container py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
          Lộ trình cải tiến
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
          Tính năng đang được xây dựng
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          Dựa trên các góp ý có nhiều upvote nhất. Bạn có thể upvote góp ý để tăng độ ưu tiên.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {FEEDBACK_ROADMAP.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs md:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {item.title}
              </h3>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-theme-xs font-bold uppercase tracking-[0.15em] text-orange-700">
                <FiThumbsUp aria-hidden className="h-3 w-3" />
                {item.relatedFeedbackCount}
              </span>
            </div>
            <p className="mt-2 text-theme-sm leading-relaxed text-gray-600">
              {item.description}
            </p>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-theme-xs text-gray-500">
                <span className="font-semibold uppercase tracking-[0.15em]">
                  Tiến độ
                </span>
                <span className="font-bold text-orange-700">{item.progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={item.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Tiến độ ${item.title}`}
                className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* ============ 05 CTA ============ */}
    <section className="bg-gradient-to-br from-gray-900 via-brand-950 to-orange-950 py-16 text-white md:py-20">
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white">
            Cùng xây dựng
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Mỗi góp ý đều có giá trị
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            218 tính năng đã được triển khai nhờ góp ý của cộng đồng. Cảm ơn bạn đã
            đồng hành cùng RealtyHub.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tro-thanh-moi-gioi"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-orange-600"
            >
              Trở thành môi giới
              <FiArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link
              href="/dao-tao"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Khám phá khoá học
            </Link>
          </div>
        </div>
      </div>
    </section>
  </main>
);

// ============================================================================
// Sub-components
// ============================================================================

const HeroStat = ({
  icon: Icon,
  value,
  label,
  accent = 'text-white',
}: {
  icon: React.ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  value: string;
  label: string;
  accent?: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
    <Icon aria-hidden className="mx-auto h-6 w-6 text-white/70" />
    <div className={`mt-2 font-serif text-2xl font-bold leading-none md:text-3xl ${accent}`}>
      {value}
    </div>
    <div className="mt-1.5 text-theme-xs uppercase tracking-[0.15em] text-white/70">
      {label}
    </div>
  </div>
);

const FeedbackCard = ({ feedback }: { feedback: FeedbackItem }) => {
  const tone = FEEDBACK_RATING_TONE[feedback.rating];

  return (
    <article className={`flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-theme-xs ${tone.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-2xl shadow-theme-xs"
          >
            {tone.emoji}
          </span>
          <div>
            <div className="font-serif text-base font-bold text-gray-900">
              {feedback.title}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-theme-xs text-gray-600">
              <span>{feedback.isAnonymous ? 'Ẩn danh' : feedback.authorName}</span>
              <span aria-hidden>·</span>
              <span>{formatTimeAgo(feedback.submittedAt)}</span>
            </div>
          </div>
        </div>
        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-theme-xs font-bold uppercase tracking-[0.15em] ${FEEDBACK_STATUS_TONE[feedback.status]}`}>
          {FEEDBACK_STATUS_LABELS[feedback.status]}
        </span>
      </div>

      {/* Category + screenshot flag */}
      <div className="flex items-center gap-2 text-theme-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-gray-700">
          <span aria-hidden>{FEEDBACK_CATEGORY_ICONS[feedback.category]}</span>
          {FEEDBACK_CATEGORY_LABELS[feedback.category]}
        </span>
        {feedback.hasScreenshot && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-gray-500">
            📎 có ảnh
          </span>
        )}
        <span className="ml-auto text-gray-500">{feedback.displayId}</span>
      </div>

      {/* Content */}
      <p className="text-theme-sm leading-relaxed text-gray-700">{feedback.content}</p>

      {/* Admin reply */}
      {feedback.adminReply && (
        <div className="rounded-xl border-l-4 border-orange-500 bg-white/70 px-4 py-3 text-theme-sm">
          <div className="text-theme-xs font-bold uppercase tracking-[0.15em] text-orange-700">
            Phản hồi từ RealtyHub
          </div>
          <p className="mt-1 text-gray-700">{feedback.adminReply}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/40 pt-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-theme-xs font-bold text-gray-700 shadow-theme-xs transition hover:bg-orange-50 hover:text-orange-700"
        >
          <FiThumbsUp aria-hidden className="h-3.5 w-3.5" />
          {feedback.upvotes} đồng thuận
        </button>
        <span className="text-theme-xs text-gray-500">
          Xem chi tiết →
        </span>
      </div>
    </article>
  );
};

export default FeedbackPage;