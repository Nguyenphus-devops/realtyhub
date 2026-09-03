import Image from 'next/image';
import Link from 'next/link';

import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';

import PlaceholderThumb from '@/common/components/PlaceholderThumb';

import type { Metadata } from 'next';

import { MOCK_NEWS } from '@/modules/news/mocks/news.mock';
import {
  NEWS_CATEGORY_LABELS,
  type NewsArticle,
  type NewsCategory,
} from '@/modules/news/models/news.model';

/**
 * Trang /tin-tuc - Trang tin tuc & phan tich thi truong BĐS.
 *
 * Layout (server component, searchParams cho filter + phan trang):
 *   01 Hero (gradient brand, eyebrow + search bar + 3 chips filter)
 *   02 Featured article (1 bai moi nhat, full-width hero card)
 *   03 Grid articles (6 bai moi/trang, 3 col, hover lift)
 *   04 Pagination (server-side, ?page=N&category=...)
 *   05 Newsletter CTA (dark, subscribe email)
 *
 * Filter/pagination dung query string thay vi client state de:
 *   - SEO-index duoc moi state (Bing/Google crawl tung category)
 *   - Khong can 'use client' => JS bundle nho
 *   - Khi co backend: thay MOCK_NEWS bang service call, giu nguyen pattern
 *
 * Mock data: 12 bai (8 cu + 4 moi them) -> 1 featured + 6 grid + 5 con lai
 * = 2 trang (page 1: 6 grid, page 2: 5 grid).
 */
export const metadata: Metadata = {
  title: 'Tin tức & Phân tích',
  description:
    'Tin tức dự án, phân tích thị trường và nhận định chuyên gia về bất động sản Việt Nam — cập nhật hàng ngày bởi đội ngũ RealtyHub.',
};

// ============================================================================
// Route types
// ============================================================================

type PageSearchParams = {
  category?: string;
  page?: string;
};

const PAGE_SIZE = 6;
const CATEGORY_ALL = 'all' as const;
type CategoryFilter = NewsCategory | typeof CATEGORY_ALL;

const CATEGORY_FILTERS: ReadonlyArray<{
  id: CategoryFilter;
  label: string;
  /** Order trong chip filter (chip "Tat ca" luon o dau) */
  order: number;
}> = [
  { id: CATEGORY_ALL, label: 'Tất cả', order: 0 },
  { id: 'tin-tuc-du-an', label: NEWS_CATEGORY_LABELS['tin-tuc-du-an'], order: 1 },
  { id: 'phan-tich-nhan-dinh', label: NEWS_CATEGORY_LABELS['phan-tich-nhan-dinh'], order: 2 },
];

// ============================================================================
// Helpers
// ============================================================================

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));

const formatDateLong = (iso: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));

const readingTime = (article: NewsArticle): number => {
  // Tier-based: excerpt ngan -> 3ph, trung binh -> 5ph, dai -> 7ph
  const len = article.excerpt.length + article.title.length;
  if (len < 120) return 3;
  if (len < 200) return 5;
  return 7;
};

/** Sort theo publishedAt DESC (fake trigger neu ngay bang nhau) */
const sortByDateDesc = (a: NewsArticle, b: NewsArticle) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

const parseCategory = (raw: string | undefined): CategoryFilter => {
  if (raw === 'tin-tuc-du-an' || raw === 'phan-tich-nhan-dinh') return raw;
  return CATEGORY_ALL;
};

const parsePage = (raw: string | undefined): number => {
  const n = parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

/** Tao URL cho category/page da thay doi, giu lai cac param khac */
const buildHref = (next: Partial<PageSearchParams>, current: PageSearchParams): string => {
  const params = new URLSearchParams();
  const merged = { ...current, ...next };
  if (merged.category && merged.category !== CATEGORY_ALL) params.set('category', merged.category);
  if (merged.page && merged.page !== '1') params.set('page', merged.page);
  const qs = params.toString();
  return qs ? `/tin-tuc?${qs}` : '/tin-tuc';
};

// ============================================================================
// Page
// ============================================================================

const TinTucPage = async ({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) => {
  const params = await searchParams;
  const category = parseCategory(params.category);
  const page = parsePage(params.page);

  // Filter + sort
  const filtered =
    category === CATEGORY_ALL
      ? MOCK_NEWS
      : MOCK_NEWS.filter((a) => a.category === category);
  const sorted = [...filtered].sort(sortByDateDesc);

  // Phan trang
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const featured = currentPage === 1 ? sorted[0] : undefined;
  const startIdx = featured ? 1 : 0;
  const gridArticles = sorted.slice(startIdx, startIdx + PAGE_SIZE);

  // Counts theo category (de hien thi so luong trong chip)
  const countByCategory = (id: CategoryFilter): number =>
    id === CATEGORY_ALL ? MOCK_NEWS.length : MOCK_NEWS.filter((a) => a.category === id).length;

  return (
    <main className="bg-white">
      {/* ============ 01 HERO ============ */}
      <section className="relative isolate overflow-hidden bg-gray-900 py-16 text-white md:py-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/tin-tuc.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/92 via-brand-950/88 to-gray-900/92" />
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
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center justify-center gap-2 text-theme-xs text-white/60">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-white/90">Tin tức</li>
              </ol>
            </nav>

            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Cập nhật hàng ngày
            </span>

            {/* Headline */}
            <h1 className="mt-6 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Tin tức &amp;
              <br />
              <span className="font-bold text-brand-400">Phân tích thị trường</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Tin tức dự án mới nhất, góc nhìn chuyên gia và nhận định xu hướng bất động sản
              Việt Nam — tất cả ở một nơi.
            </p>

            {/* Search bar (decorative - form submit chua co backend) */}
            <form
              role="search"
              className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur-sm"
              action="/tin-tuc"
            >
              <div className="flex flex-1 items-center gap-2 px-4">
                <FiSearch aria-hidden className="h-4 w-4 shrink-0 text-white/60" />
                <input
                  type="search"
                  name="q"
                  placeholder="Tìm bài viết, dự án, chủ đề..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/50 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-brand-500 px-5 py-2 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Tìm
              </button>
            </form>

            {/* Filter chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {CATEGORY_FILTERS.map((f) => {
                const isActive = category === f.id;
                return (
                  <Link
                    key={f.id}
                    href={buildHref({ category: f.id, page: '1' }, params)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-theme-sm font-semibold transition ${
                      isActive
                        ? 'border-brand-400 bg-brand-500 text-white shadow-theme-sm'
                        : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-theme-xs font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {countByCategory(f.id)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 FEATURED ARTICLE ============ */}
      {featured && (
        <section className="site-container pt-12 md:pt-16">
          <FeaturedArticle article={featured} />
        </section>
      )}

      {/* ============ 03 GRID ARTICLES ============ */}
      <section className="site-container py-12 md:py-16">
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
              {category === CATEGORY_ALL
                ? 'Bài viết mới nhất'
                : NEWS_CATEGORY_LABELS[category as NewsCategory]}
            </h2>
            <p className="mt-1 text-theme-sm text-gray-500">
              {sorted.length} bài viết
              {currentPage > 1 ? ` · Trang ${currentPage}/${totalPages}` : ''}
            </p>
          </div>
        </div>

        {gridArticles.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((article) => (
              <ArticleCard key={article.publicId} article={article} />
            ))}
          </div>
        )}

        {/* ============ 04 PAGINATION ============ */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            currentParams={params}
          />
        )}
      </section>

      {/* ============ 05 NEWSLETTER CTA ============ */}
      <NewsletterCTA />
    </main>
  );
};

// ============================================================================
// FeaturedArticle - bai noi bat (full-width hero card)
// ============================================================================

const FeaturedArticle = ({ article }: { article: NewsArticle }) => (
  <article className="group grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-theme-md transition hover:shadow-theme-lg md:grid-cols-2">
    {/* Thumbnail */}
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="relative block aspect-[16/10] overflow-hidden md:aspect-auto"
      aria-label={article.title}
    >
      <PlaceholderThumb
        seed={article.slug}
        src={article.thumbnailUrl || undefined}
        alt={article.title}
        className="transition-transform duration-500 group-hover:scale-105"
      />
      {/* Category chip overlay */}
      <span className="absolute left-4 top-4 inline-flex rounded-full bg-brand-500 px-3 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-white shadow-theme-md">
        {NEWS_CATEGORY_LABELS[article.category]}
      </span>
    </Link>

    {/* Content */}
    <div className="flex flex-col justify-between gap-6 p-6 md:p-10">
      <div>
        <h3 className="font-serif text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-4xl">
          <Link
            href={`/tin-tuc/${article.slug}`}
            className="transition hover:text-brand-600"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          {article.excerpt}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <ul className="flex items-center gap-4 text-theme-xs text-gray-500">
          <li className="flex items-center gap-1.5">
            <FiCalendar aria-hidden className="h-3.5 w-3.5" />
            {formatDateLong(article.publishedAt)}
          </li>
          <li className="flex items-center gap-1.5">
            <FiClock aria-hidden className="h-3.5 w-3.5" />
            {readingTime(article)} phút đọc
          </li>
        </ul>
        <Link
          href={`/tin-tuc/${article.slug}`}
          className="group/btn inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-brand-600"
        >
          Đọc bài
          <FiArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
          />
        </Link>
      </div>
    </div>
  </article>
);

// ============================================================================
// ArticleCard - 1 bai trong grid
// ============================================================================

const ArticleCard = ({ article }: { article: NewsArticle }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md">
    {/* Thumbnail */}
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="relative block aspect-[16/10] overflow-hidden"
      aria-label={article.title}
    >
      <PlaceholderThumb
        seed={article.slug}
        src={article.thumbnailUrl || undefined}
        alt={article.title}
        className="transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute right-3 top-3 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-gray-900 backdrop-blur-sm">
        {NEWS_CATEGORY_LABELS[article.category]}
      </span>
    </Link>

    {/* Content */}
    <div className="flex flex-1 flex-col p-5">
      <h3 className="font-serif text-lg font-bold leading-tight text-gray-900 md:text-xl">
        <Link
          href={`/tin-tuc/${article.slug}`}
          className="transition hover:text-brand-600"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-2.5 line-clamp-3 text-theme-sm leading-relaxed text-gray-600">
        {article.excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-theme-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <FiCalendar aria-hidden className="h-3.5 w-3.5" />
          {formatDate(article.publishedAt)}
        </span>
        <Link
          href={`/tin-tuc/${article.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
        >
          Đọc tiếp
          <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </article>
);

// ============================================================================
// Pagination
// ============================================================================

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  currentParams: PageSearchParams;
};

const Pagination = ({ currentPage, totalPages, currentParams }: PaginationProps) => {
  const pages: Array<number | 'ellipsis'> = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push('ellipsis');
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref({ page: String(currentPage - 1) }, currentParams)}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-theme-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          <FiArrowLeft aria-hidden className="h-4 w-4" />
          Trước
        </Link>
      ) : (
        <span
          aria-disabled
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-4 py-2.5 text-theme-sm font-semibold text-gray-400"
        >
          <FiArrowLeft aria-hidden className="h-4 w-4" />
          Trước
        </span>
      )}

      {/* Page numbers */}
      <ol className="flex items-center gap-1.5">
        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <li key={`e-${idx}`} aria-hidden className="px-2 text-gray-400">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={buildHref({ page: String(p) }, currentParams)}
                aria-current={p === currentPage ? 'page' : undefined}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-theme-sm font-semibold transition ${
                  p === currentPage
                    ? 'bg-brand-500 text-white shadow-theme-sm'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </Link>
            </li>
          )
        )}
      </ol>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref({ page: String(currentPage + 1) }, currentParams)}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-theme-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          Sau
          <FiArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      ) : (
        <span
          aria-disabled
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-4 py-2.5 text-theme-sm font-semibold text-gray-400"
        >
          Sau
          <FiArrowRight aria-hidden className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
};

// ============================================================================
// EmptyState
// ============================================================================

const EmptyState = ({ category }: { category: CategoryFilter }) => (
  <div className="mx-auto max-w-md rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center md:py-20">
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-theme-xs">
      <FiSearch aria-hidden className="h-6 w-6 text-gray-400" />
    </span>
    <h3 className="mt-5 font-serif text-xl font-bold text-gray-900">
      Chưa có bài viết nào
    </h3>
    <p className="mt-2 text-theme-sm text-gray-600">
      {category === CATEGORY_ALL
        ? 'Chúng tôi đang cập nhật thêm bài viết mới.'
        : `Chuyên mục "${NEWS_CATEGORY_LABELS[category as NewsCategory]}" hiện chưa có bài viết.`}
    </p>
    <Link
      href="/tin-tuc"
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-brand-600"
    >
      Xem tất cả bài viết
    </Link>
  </div>
);

// ============================================================================
// NewsletterCTA
// ============================================================================

const NewsletterCTA = () => (
  <section className="bg-gray-900 py-16 text-white md:py-20">
    <div className="site-container">
      <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-brand-700 to-brand-950 p-10 text-center shadow-2xl md:p-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white">
          Bản tin RealtyHub
        </span>
        <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
          Cập nhật thị trường mỗi tuần
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
          Nhận bản tin email với 5 bài viết nổi bật, 1 phân tích xu hướng và cơ hội đầu tư mới —
          miễn phí, hủy bất cứ lúc nào.
        </p>

        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
          action="/tin-tuc"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="email@example.com"
            aria-label="Email của bạn"
            className="w-full flex-1 rounded-full bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-theme-sm font-semibold text-brand-700 shadow-theme-sm transition hover:bg-gray-100"
          >
            Đăng ký
          </button>
        </form>

        <p className="mt-4 text-theme-xs text-white/60">
          Chúng tôi tôn trọng quyền riêng tư. Email chỉ dùng cho bản tin.
        </p>
      </div>
    </div>
  </section>
);

export default TinTucPage;