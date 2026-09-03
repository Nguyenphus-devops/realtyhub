import Image from 'next/image';
import Link from 'next/link';

import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiPlay,
  FiSearch,
  FiZap,
} from 'react-icons/fi';

import PlaceholderThumb from '@/common/components/PlaceholderThumb';

import type { Metadata } from 'next';

import {
  AUDIENCES,
  FAQS,
  GUIDE_ARTICLES,
  GUIDE_GROUPS,
  QUICK_LINKS,
  VIDEOS,
  type Audience,
} from '@/modules/help/mocks/help.mock';

/**
 * Trang /huong-dan - Trung tam ho tro cua RealtyHub.
 *
 * Layout (server component):
 *   01 Hero (gradient navy -> cyan, search bar + 4 audience tabs)
 *   02 Getting started (5 buoc nhanh cho moi doi tuong, ko filter)
 *   03 Guide groups (sidebar TOC 1 col + articles 3 col, filter theo audience)
 *   04 Videos (5 tutorial embed)
 *   05 FAQ (8 cau hoi, native <details> de a11y)
 *   06 Quick links CTA (4 kenh ho tro)
 *   07 Final CTA (lien he / gop y)
 *
 * Tone chinh: cyan (info / learn / docs) - phan biet brand/jade/orange.
 */
export const metadata: Metadata = {
  title: 'Hướng dẫn sử dụng',
  description:
    'Trung tâm hỗ trợ RealtyHub — hướng dẫn chi tiết cho người mua, môi giới, chủ đầu tư và đối tác. Video tutorial, FAQ và liên hệ support.',
};

// ============================================================================
// Route types
// ============================================================================

type PageSearchParams = {
  audience?: string;
};

const parseAudience = (raw: string | undefined): Audience | null => {
  if (raw === 'buyer' || raw === 'agent' || raw === 'developer' || raw === 'partner') {
    return raw;
  }
  return null;
};

const buildAudienceHref = (audience: Audience | null): string =>
  audience ? `/huong-dan?audience=${audience}` : '/huong-dan';

// ============================================================================
// Helpers
// ============================================================================

const formatNumber = (n: number): string =>
  new Intl.NumberFormat('vi-VN').format(n);

// ============================================================================
// Page
// ============================================================================

const HuongDanPage = async ({ searchParams }: { searchParams: Promise<PageSearchParams> }) => {
  const params = await searchParams;
  const activeAudience = parseAudience(params.audience);

  // Filter articles + faqs + videos theo audience
  const filteredArticles = activeAudience
    ? GUIDE_ARTICLES.filter((a) => a.audience === activeAudience)
    : GUIDE_ARTICLES;

  const filteredFaqs = activeAudience
    ? FAQS.filter((f) => f.audience === activeAudience)
    : FAQS;

  const filteredVideos = activeAudience
    ? VIDEOS.filter((v) => v.audience === activeAudience)
    : VIDEOS;

  // Article IDs visible sau khi filter -> suy ra groups con hien thi
  const visibleArticleIds = new Set(filteredArticles.map((a) => a.publicId));
  const visibleGroups = activeAudience
    ? GUIDE_GROUPS.filter((g) => g.articleIds.some((id) => visibleArticleIds.has(id)))
    : GUIDE_GROUPS;

  const stats = {
    articles: GUIDE_ARTICLES.length,
    videos: VIDEOS.length,
    faqs: FAQS.length,
    audiences: AUDIENCES.length,
  };

  return (
    <main className="bg-white">
      {/* ============ 01 HERO ============ */}
      <section className="relative isolate overflow-hidden bg-gray-900 py-16 text-white md:py-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/huong-dan.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/92 via-brand-950/88 to-cyan-950/92" />
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
                <li className="text-white/90">Hướng dẫn sử dụng</li>
              </ol>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <FiBookOpen aria-hidden className="h-3.5 w-3.5" />
              Trung tâm hỗ trợ
            </span>

            <h1 className="mt-6 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Bạn cần hỗ trợ?
              <br />
              <span className="font-bold text-cyan-400">Chúng tôi ở đây</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {formatNumber(stats.articles)} bài viết, {stats.videos} video tutorial và{' '}
              {formatNumber(stats.faqs)} câu hỏi thường gặp — dành cho người mua, môi giới,
              chủ đầu tư và đối tác.
            </p>

            {/* Search bar (decorative - search route /help/search) */}
            <Link
              href="#guides"
              className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-left text-white shadow-theme-sm backdrop-blur-sm transition hover:bg-white/15"
            >
              <FiSearch aria-hidden className="h-5 w-5 text-white/70" />
              <span className="flex-1 text-base text-white/70">
                Tìm kiếm bài viết, video, FAQ...
              </span>
              <span className="hidden rounded-full bg-white/15 px-3 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-white/80 sm:inline">
                ⌘ K
              </span>
            </Link>

            {/* Audience tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <AudienceTab
                href={buildAudienceHref(null)}
                label="Tất cả"
                isActive={activeAudience === null}
                count={stats.audiences}
              />
              {AUDIENCES.map((a) => (
                <AudienceTab
                  key={a.id}
                  href={buildAudienceHref(a.id)}
                  label={a.label}
                  isActive={activeAudience === a.id}
                  count={a.count}
                  emoji={a.emoji}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <HeroStat
                icon={FiBookOpen}
                value={`${stats.articles}`}
                label="Bài viết"
                accent="text-cyan-300"
              />
              <HeroStat icon={FiPlay} value={`${stats.videos}`} label="Video tutorial" />
              <HeroStat
                icon={FiHelpCircle}
                value={`${stats.faqs}`}
                label="Câu hỏi FAQ"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 GETTING STARTED (5 STEPS) ============ */}
      <section className="site-container py-12 md:py-16">
        <div className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50/60 to-white p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-3 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-white">
                <FiZap aria-hidden className="h-3 w-3" />
                Bắt đầu nhanh
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                Hoàn tất thiết lập trong 5 phút
              </h2>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Làm theo 5 bước dưới đây để sử dụng RealtyHub hiệu quả, dù bạn là người mua,
                môi giới hay chủ đầu tư.
              </p>
              <Link
                href="#guides"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-cyan-600"
              >
                Xem hướng dẫn chi tiết
                <FiArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>

            <ol className="space-y-4">
              {GETTING_STARTED_STEPS.map((step, idx) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-cyan-100 bg-white p-4 shadow-theme-xs"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-serif text-base font-bold text-white shadow-theme-sm">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-theme-sm leading-relaxed text-gray-600">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ 03 GUIDE GROUPS (sidebar TOC + articles) ============ */}
      <section id="guides" className="site-container pb-12 md:pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
              {activeAudience
                ? AUDIENCES.find((a) => a.id === activeAudience)?.label
                : 'Tất cả hướng dẫn'}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              {filteredArticles.length} bài viết
              {activeAudience && ' cho vai trò của bạn'}
            </h2>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Sidebar TOC (1 col) */}
          <aside className="lg:col-span-1">
            <nav
              aria-label="Mục lục"
              className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs"
            >
              <h3 className="mb-4 text-theme-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Mục lục
              </h3>
              <ul className="space-y-1.5">
                {visibleGroups.map((group) => (
                  <li key={group.publicId}>
                    <a
                      href={`#group-${group.publicId}`}
                      className="group flex items-center gap-2 rounded-lg px-3 py-2 text-theme-sm font-semibold text-gray-700 transition hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      <span aria-hidden className="text-base">
                        {group.icon}
                      </span>
                      <span className="flex-1">{group.title}</span>
                      <span className="text-theme-xs text-gray-400">
                        {group.articleIds.filter((id) => visibleArticleIds.has(id)).length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-theme-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Không tìm thấy?
                </p>
                <Link
                  href="/gop-y-va-phan-hoi"
                  className="mt-2 inline-flex items-center gap-1 text-theme-sm font-semibold text-cyan-600 hover:underline"
                >
                  Gửi câu hỏi mới
                  <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
                </Link>
              </div>
            </nav>
          </aside>

          {/* Content (3 col) */}
          <div className="space-y-12 lg:col-span-3">
            {visibleGroups.length === 0 ? (
              <EmptyState audience={activeAudience} />
            ) : (
              visibleGroups.map((group) => {
                const groupArticles = filteredArticles.filter((a) => a.groupId === group.publicId);
                if (groupArticles.length === 0) return null;
                return (
                  <div key={group.publicId} id={`group-${group.publicId}`} className="scroll-mt-24">
                    {/* Group header */}
                    <div className="mb-5 flex items-start gap-3">
                      <span aria-hidden className="text-3xl">
                        {group.icon}
                      </span>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-gray-900">
                          {group.title}
                        </h3>
                        <p className="mt-1 text-theme-sm text-gray-600">{group.description}</p>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="grid gap-5 md:grid-cols-2">
                      {groupArticles.map((article) => (
                        <article
                          key={article.publicId}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-xs transition hover:-translate-y-0.5 hover:shadow-theme-md"
                        >
                          <Link
                            href={`#article-${article.publicId}`}
                            className="relative block aspect-[16/10] overflow-hidden"
                            aria-label={article.title}
                          >
                            <PlaceholderThumb
                              seed={article.publicId}
                              src={article.coverImage}
                              label={article.title}
                              alt={article.title}
                              className="transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-theme-xs font-bold text-gray-700 backdrop-blur-sm">
                              <FiClock aria-hidden className="h-3 w-3" />
                              {article.readMinutes} phút
                            </span>
                          </Link>

                          <div className="flex flex-1 flex-col p-5">
                            <h4 className="font-serif text-lg font-bold text-gray-900">
                              <Link
                                href={`#article-${article.publicId}`}
                                className="transition hover:text-cyan-600"
                              >
                                {article.title}
                              </Link>
                            </h4>
                            <p className="mt-2 text-theme-sm leading-relaxed text-gray-600">
                              {article.excerpt}
                            </p>
                            <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-theme-xs text-gray-500">
                              <span>
                                {article.steps.length} bước
                                {article.tips && ` · ${article.tips.length} mẹo`}
                              </span>
                              <Link
                                href={`#article-${article.publicId}`}
                                className="inline-flex items-center gap-1 font-semibold text-cyan-600 hover:underline"
                              >
                                Đọc tiếp
                                <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ============ 04 ARTICLES DETAIL (collapsible step-by-step) ============ */}
      <section className="border-y border-gray-200 bg-gray-50/60 py-16 md:py-20">
        <div className="site-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
              Hướng dẫn chi tiết
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              Từng bước một, có ảnh minh hoạ
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              Mỗi bài viết dưới đây đều có step-by-step đầy đủ. Click để mở rộng.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-5">
            {filteredArticles.map((article) => (
              <details
                key={article.publicId}
                id={`article-${article.publicId}`}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs open:shadow-theme-md scroll-mt-24 md:p-6"
              >
                <summary className="flex cursor-pointer items-start gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 font-serif text-base font-bold text-cyan-700 transition group-open:bg-cyan-500 group-open:text-white">
                    {article.steps.length}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-bold text-gray-900">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-theme-sm text-gray-600">{article.excerpt}</p>
                    <div className="mt-2 flex items-center gap-3 text-theme-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FiClock aria-hidden className="h-3 w-3" />
                        {article.readMinutes} phút đọc
                      </span>
                      <span aria-hidden>·</span>
                      <span>{article.steps.length} bước</span>
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-open:rotate-45 group-open:bg-cyan-500 group-open:text-white"
                  >
                    +
                  </span>
                </summary>

                {/* Content */}
                <div className="mt-6 space-y-5 border-t border-gray-100 pt-6">
                  {article.steps.map((step, idx) => (
                    <div key={idx} className="grid gap-4 md:grid-cols-5">
                      <div className="md:col-span-2">
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                          <PlaceholderThumb
                            seed={`${article.publicId}-${idx}`}
                            label={step.title}
                            alt={step.title}
                            className="h-full w-full"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-theme-xs font-bold text-white">
                            {idx + 1}
                          </span>
                          <h4 className="font-serif text-base font-bold text-gray-900">
                            {step.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-theme-sm leading-relaxed text-gray-700">
                          {step.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {article.tips && article.tips.length > 0 && (
                    <div className="rounded-xl border-l-4 border-cyan-500 bg-cyan-50/50 px-5 py-4">
                      <p className="text-theme-xs font-bold uppercase tracking-[0.15em] text-cyan-700">
                        Mẹo hay
                      </p>
                      <ul className="mt-2 space-y-1.5 text-theme-sm text-gray-700">
                        {article.tips.map((tip) => (
                          <li key={tip} className="flex gap-2">
                            <FiCheckCircle
                              aria-hidden
                              className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600"
                            />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 05 VIDEOS ============ */}
      {filteredVideos.length > 0 && (
        <section className="site-container py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
              Video tutorial
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              Xem nhanh, hiểu ngay
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              Các video ngắn gọn giúp bạn làm quen với RealtyHub trong vài phút.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <article
                key={video.publicId}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md"
              >
                <Link
                  href={video.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block aspect-video overflow-hidden bg-gray-900"
                  aria-label={video.title}
                >
                  <PlaceholderThumb
                    seed={video.publicId}
                    src={video.thumbnailUrl}
                    label={video.title}
                    alt={video.title}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Play overlay */}
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/55"
                  >
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-cyan-600 shadow-theme-md transition group-hover:scale-110">
                      <FiPlay className="h-6 w-6 translate-x-0.5" aria-hidden />
                    </span>
                  </span>
                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 inline-flex rounded-full bg-black/80 px-2 py-0.5 text-theme-xs font-bold text-white">
                    {video.duration}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-base font-bold text-gray-900">
                    {video.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-theme-sm text-gray-600">
                    {video.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ============ 06 FAQ ============ */}
      {filteredFaqs.length > 0 && (
        <section className="border-y border-gray-200 bg-gray-50/60 py-16 md:py-24">
          <div className="site-container">
            <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
              <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
                Câu hỏi thường gặp
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                {filteredFaqs.length} câu hỏi phổ biến nhất
              </h2>
            </div>

            <div className="mx-auto max-w-3xl space-y-3">
              {filteredFaqs.map((faq) => (
                <details
                  key={faq.publicId}
                  className="group rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-theme-xs open:shadow-theme-md md:px-6"
                >
                  <summary className="flex cursor-pointer items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 transition group-open:bg-cyan-500 group-open:text-white">
                      <FiHelpCircle aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="flex-1 font-serif text-base font-bold text-gray-900">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-open:rotate-45 group-open:bg-cyan-500 group-open:text-white"
                    >
                      +
                    </span>
                  </summary>
                  <div className="mt-3 border-t border-gray-100 pt-3 pl-12 text-theme-sm leading-relaxed text-gray-700">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ 07 QUICK LINKS CTA ============ */}
      <section className="site-container py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
            Liên hệ hỗ trợ
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            Vẫn cần trợ giúp?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Chọn kênh hỗ trợ phù hợp — đội ngũ RealtyHub luôn sẵn sàng.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-theme-md"
            >
              <span aria-hidden className="text-2xl">
                {link.icon}
              </span>
              <div>
                <div className="font-serif text-base font-bold text-gray-900 group-hover:text-cyan-600">
                  {link.title}
                </div>
                <div className="mt-0.5 text-theme-xs text-gray-600">{link.description}</div>
              </div>
              <FiArrowRight
                aria-hidden
                className="ml-auto h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-cyan-600"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 08 FINAL CTA ============ */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-950 to-cyan-950 py-16 text-white md:py-20">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white">
              Cộng đồng
            </span>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Góp ý giúp chúng tôi tốt hơn
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Bạn không tìm thấy câu trả lời? Gửi câu hỏi mới — team sẽ bổ sung vào
              trung tâm hỗ trợ trong 48 giờ.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/gop-y-va-phan-hoi"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-cyan-600"
              >
                Gửi câu hỏi mới
                <FiArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                href="/lien-he-chung-toi"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Liên hệ chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// ============================================================================
// Static content
// ============================================================================

const GETTING_STARTED_STEPS = [
  {
    title: 'Tạo tài khoản miễn phí',
    desc: 'Đăng ký bằng email, Google hoặc Zalo trong vòng 60 giây.',
  },
  {
    title: 'Hoàn thiện hồ sơ cá nhân',
    desc: 'Thêm avatar, sở thích và khu vực quan tâm để nhận đề xuất phù hợp.',
  },
  {
    title: 'Khám phá tính năng chính',
    desc: 'Tìm kiếm dự án, lưu yêu thích, so sánh — tất cả đều miễn phí.',
  },
  {
    title: 'Kết nối với môi giới',
    desc: 'Nhắn tin trực tiếp qua hệ thống — bảo mật và an toàn.',
  },
  {
    title: 'Đăng ký nhận thông báo',
    desc: 'Nhận email khi có BĐS mới phù hợp với tiêu chí của bạn.',
  },
];

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

const AudienceTab = ({
  href,
  label,
  isActive,
  count,
  emoji,
}: {
  href: string;
  label: string;
  isActive: boolean;
  count: number;
  emoji?: string;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-theme-sm font-semibold transition ${
      isActive
        ? 'border-cyan-400 bg-cyan-500 text-white shadow-theme-sm'
        : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
    }`}
  >
    {emoji && <span aria-hidden>{emoji}</span>}
    {label}
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-theme-xs font-bold ${
        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
      }`}
    >
      {count}
    </span>
  </Link>
);

const EmptyState = ({ audience: _audience }: { audience: Audience | null }) => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
    <span aria-hidden className="text-4xl">
      🔍
    </span>
    <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">
      Chưa có hướng dẫn cho đối tượng này
    </h3>
    <p className="mt-2 text-theme-sm text-gray-600">
      Bạn có thể gửi yêu cầu để đội ngũ bổ sung nội dung phù hợp.
    </p>
    <Link
      href="/gop-y-va-phan-hoi"
      className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-cyan-600"
    >
      Gửi yêu cầu
      <FiArrowRight aria-hidden className="h-4 w-4" />
    </Link>
  </div>
);

export default HuongDanPage;