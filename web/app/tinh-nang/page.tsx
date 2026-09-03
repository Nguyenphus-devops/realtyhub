import Image from 'next/image';
import Link from 'next/link';

import { FiArrowRight } from 'react-icons/fi';

import { FEATURE_TONE_CLASSES, type FeatureTone } from '@/modules/features/components/tones';
import { MOCK_FEATURE_GROUPS, type FeatureGroup, type FeatureItem } from '@/modules/features/mocks/features.mock';

/**
 * Trang /tinh-nang - Bang tinh nang phan mem (feature matrix).
 *
 * Layout: 9 nhom tinh nang, moi nhom 1 card rieng voi:
 *   - Header (icon + eyebrow "01" + title + subtitle)
 *   - Grid cac tinh nang con (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
 *
 * Moi tinh nang con: icon + label (semibold) + description (1 dong).
 *
 * Hover: lift -translate-y-0.5, icon doi bg tone đậm + text trang.
 *
 * Server component vi day la trang tinh.
 *
 * Tone mapping (9 nhom):
 *   01 Tìm kiếm     → brand
 *   02 Tư vấn       → accent (orange)
 *   03 Phong thủy   → green
 *   04 Thiết kế     → purple
 *   05 Đào tạo     → orange
 *   06 CRM          → teal
 *   07 Pháp lý      → cyan
 *   08 Tiện ích     → gold
 *   09 Hệ thống     → red
 */

const GROUP_TONES: FeatureTone[] = [
  'brand', // 01 Tìm kiếm & Khám phá
  'accent', // 02 Tư vấn & Giao dịch
  'green', // 03 Phong thủy
  'purple', // 04 Thiết kế & Nội thất
  'orange', // 05 Đào tạo
  'teal', // 06 CRM
  'cyan', // 07 Pháp lý
  'gold', // 08 Công cụ
  'red', // 09 Hệ thống
];

const TinhNangPage = () => {
  const totalFeatures = MOCK_FEATURE_GROUPS.reduce((sum, group) => sum + group.features.length, 0);

  return (
    <main className="bg-white">
      {/* ============ HERO ============ */}
      <section className="relative isolate overflow-hidden bg-gray-900 py-20 text-white md:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/tinh-nang.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/92 via-brand-950/88 to-gray-900/92" />
      </div>
        {/* Background decoration */}
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
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Tính năng phần mềm
            </span>

            {/* Headline */}
            <h1 className="mt-6 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Mọi công cụ bạn cần
              <br />
              <span className="font-bold text-brand-400">cho bất động sản</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              RealtyHub không chỉ là nơi đăng tin. Đó là hệ sinh thái đầy đủ cho môi giới
              và khách hàng: từ tìm kiếm, tư vấn, phong thủy, đến pháp lý và quản lý khách hàng.
            </p>

            {/* Stats inline */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="font-bold text-brand-400">{MOCK_FEATURE_GROUPS.length}</span>
                <span className="text-white/70">nhóm tính năng</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-2">
                <span className="font-bold text-brand-400">{totalFeatures}+</span>
                <span className="text-white/70">tính năng</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-2">
                <span className="font-bold text-brand-400">100%</span>
                <span className="text-white/70">miễn phí cơ bản</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-theme-sm font-semibold text-gray-900 shadow-theme-sm transition hover:bg-gray-100"
              >
                Bắt đầu miễn phí
                <FiArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CÁC NHÓM TÍNH NĂNG ============ */}
      <section className="site-container py-16 md:py-24">
        <div className="space-y-16 md:space-y-20">
          {MOCK_FEATURE_GROUPS.map((group, idx) => (
            <FeatureGroupBlock
              key={group.publicId}
              group={group}
              tone={GROUP_TONES[idx] ?? 'brand'}
            />
          ))}
        </div>
      </section>

      {/* ============ CTA CUỐI ============ */}
      <section className="border-t border-gray-200 bg-gray-50/60 py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-10 text-center text-white shadow-2xl md:p-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white">
              Sẵn sàng bắt đầu?
            </span>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Tất cả tính năng, miễn phí cơ bản
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
              Đăng ký tài khoản để trải nghiệm đầy đủ {totalFeatures}+ tính năng. Không cần thẻ tín dụng.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-theme-sm font-semibold text-brand-700 shadow-theme-sm transition hover:bg-gray-50"
              >
                Đăng ký miễn phí
                <FiArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Nói chuyện với tư vấn viên
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TinhNangPage;

// ============================================================================
// FeatureGroupBlock - 1 nhom tinh nang (render inline vi chi dung o 1 page)
// ============================================================================

type FeatureGroupBlockProps = {
  group: FeatureGroup;
  tone: FeatureTone;
};

const FeatureGroupBlock = ({ group, tone }: FeatureGroupBlockProps) => {
  const cls = FEATURE_TONE_CLASSES[tone];

  return (
    <section
      id={group.publicId}
      aria-labelledby={`group-${group.publicId}`}
      className={`overflow-hidden rounded-3xl border ${cls.cardBorder} ${cls.cardBg} shadow-theme-xs`}
    >
      {/* Header */}
      <header className="flex items-start gap-4 border-b border-gray-100 px-6 py-6 md:gap-5 md:px-10 md:py-8">
        <span
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 ${cls.sectionIcon} md:h-14 md:w-14`}
        >
          <group.icon aria-hidden className="h-6 w-6 md:h-7 md:w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <span
            className={`font-mono text-theme-xs font-bold uppercase tracking-[0.2em] ${cls.sectionEyebrow}`}
          >
            {group.eyebrow}
          </span>
          <h2
            id={`group-${group.publicId}`}
            className="mt-1 font-serif text-2xl font-bold leading-tight text-gray-900 md:text-3xl"
          >
            {group.title}
          </h2>
          <p className="mt-1.5 text-theme-sm text-gray-600 md:text-base">
            {group.subtitle}
          </p>
        </div>
      </header>

      {/* Grid features */}
      <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
        {group.features.map((feature) => (
          <FeatureItemCard
            key={feature.publicId}
            feature={feature}
            tone={tone}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================================================
// FeatureItemCard - 1 tinh nang con trong grid
// ============================================================================

type FeatureItemCardProps = {
  feature: FeatureItem;
  tone: FeatureTone;
};

const FeatureItemCard = ({ feature, tone }: FeatureItemCardProps) => {
  const cls = FEATURE_TONE_CLASSES[tone];

  return (
    <div className="group flex items-start gap-4 bg-white p-5 transition hover:bg-gray-50/60 md:p-7">
      <span
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cls.itemIconBg} ${cls.itemIconText} transition ${cls.itemHover} md:h-12 md:w-12`}
      >
        <feature.icon aria-hidden className="h-5 w-5 md:h-6 md:w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={`text-base font-bold leading-tight ${cls.itemText} md:text-lg`}>
          {feature.label}
        </h3>
        <p className="mt-1 text-theme-sm leading-relaxed text-gray-600">
          {feature.description}
        </p>
      </div>
    </div>
  );
};