import Image from 'next/image';
import Link from 'next/link';

import UserAvatar from '@/common/components/UserAvatar';

import { FiArrowRight, FiCheck, FiClock, FiMapPin, FiPlay, FiUsers, FiVideo } from 'react-icons/fi';
import {
  HiOutlineSparkles,
} from 'react-icons/hi2';

import type { Metadata } from 'next';

import {
  MOCK_TRAINING_CONTENT,
  type TrainingCourse,
  type TrainingSession,
  type TrainingTestimonial,
} from '@/modules/training/mocks/training.mock';

/**
 * Trang /dao-tao - RealtyHub Academy.
 *
 * Layout noi dung theo mau editorial + feature matrix:
 *   01 Hero (gradient navy -> orange-950, eyebrow + headline + 4 so lieu)
 *   02 Lo trinh 4 cap do (staircase grid)
 *   03 Khoa hoc noi bat (6 card, category-tagged)
 *   04 Giang vien (4 mentor)
 *   05 Lich khai giang sap toi (4 session card)
 *   06 Hoc vien noi gi (3 testimonial)
 *   07 CTA cuoi
 *
 * Tone chinh: orange (theo dang ky FEATURE_TONE trong tinh-nang).
 * Server component vi trang tinh, mock data.
 */
export const metadata: Metadata = {
  title: 'Đào tạo môi giới',
  description:
    'Lộ trình 4 cấp độ từ nền tảng đến quản lý — giúp bạn trở thành môi giới chuyên nghiệp trong 12 tháng.',
};

// ============================================================================
// Helpers
// ============================================================================

const formatPrice = (price: number): string => {
  if (price === 0) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const COURSE_CATEGORY_LABEL: Record<TrainingCourse['category'], string> = {
  foundation: 'Nền tảng',
  sales: 'Bán hàng',
  legal: 'Pháp lý',
  marketing: 'Marketing',
  advanced: 'Nâng cao',
};

const COURSE_CATEGORY_TONE: Record<
  TrainingCourse['category'],
  { chip: string; icon: string; accent: string }
> = {
  foundation: {
    chip: 'bg-brand-50 text-brand-700',
    icon: 'bg-brand-500 text-white',
    accent: 'text-brand-600',
  },
  sales: {
    chip: 'bg-orange-50 text-orange-700',
    icon: 'bg-orange-500 text-white',
    accent: 'text-orange-600',
  },
  legal: {
    chip: 'bg-cyan-50 text-cyan-700',
    icon: 'bg-cyan-500 text-white',
    accent: 'text-cyan-600',
  },
  marketing: {
    chip: 'bg-purple-50 text-purple-700',
    icon: 'bg-purple-500 text-white',
    accent: 'text-purple-600',
  },
  advanced: {
    chip: 'bg-green-50 text-green-700',
    icon: 'bg-green-500 text-white',
    accent: 'text-green-600',
  },
};

// ============================================================================
// Page
// ============================================================================

const DaoTaoPage = () => {
  const { hero, metrics, levels, courses, instructors, upcomingSessions, testimonials } =
    MOCK_TRAINING_CONTENT;

  return (
    <main className="bg-white">
      {/* ============ 01 HERO ============ */}
      <section className="relative overflow-hidden bg-gray-900 py-20 text-white md:py-28">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/dao-tao/hero.jpg"
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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <HiOutlineSparkles aria-hidden className="h-3.5 w-3.5 text-orange-300" />
              {hero.eyebrow}
            </span>

            <h1 className="mt-6 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              {hero.headline.split(' ').slice(0, -2).join(' ')}
              <br />
              <span className="font-bold text-orange-400">
                {hero.headline.split(' ').slice(-2).join(' ')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {hero.tagline}
            </p>

            <p className="mt-6 text-theme-xs uppercase tracking-[0.25em] text-white/55">
              {hero.byline}
            </p>

            {/* So lieu */}
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="font-serif text-3xl font-bold leading-none text-orange-400 md:text-4xl">
                    {metric.value}
                    {metric.suffix && <span className="text-orange-300">{metric.suffix}</span>}
                  </div>
                  <div className="mt-2 text-theme-xs uppercase tracking-[0.15em] text-white/70">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#khoa-hoc"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-orange-600"
              >
                Xem khóa học
                <FiArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="#lich-khai-giang"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Lịch khai giảng
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 LỘ TRÌNH 4 CẤP ĐỘ ============ */}
      <section className="site-container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
            Lộ trình
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            4 cấp độ, 12 tháng thành chuyên gia
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Đi từ nền tảng đến quản lý — mỗi cấp độ có khóa học bắt buộc và dự án thực chiến để bạn
            không bỏ lỡ kiến thức trọng tâm.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {levels.map((level, idx) => (
            <article
              key={level.id}
              className="group relative flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md md:p-7"
            >
              {/* Step connector (decorative, only on md+) */}
              {idx < levels.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 translate-x-full bg-orange-200 lg:block"
                />
              )}

              {/* Code badge */}
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-theme-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                {level.code}
              </span>

              {/* Icon */}
              <span className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white md:h-14 md:w-14">
                <level.icon aria-hidden className="h-6 w-6 md:h-7 md:h-7" />
              </span>

              {/* Title */}
              <h3 className="mt-5 font-serif text-xl font-bold text-gray-900 md:text-2xl">
                {level.title}
              </h3>
              <p className="mt-1 text-theme-xs uppercase tracking-[0.18em] text-gray-500">
                {level.subtitle}
              </p>

              {/* Outcomes */}
              <ul className="mt-5 space-y-2.5">
                {level.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-theme-sm text-gray-700">
                    <FiCheck
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                    />
                    <span className="leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ============ 03 KHÓA HỌC NỔI BẬT ============ */}
      <section id="khoa-hoc" className="border-y border-gray-200 bg-gray-50/60 py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              Khóa học
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              {courses.length} khóa học thực chiến
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              Tất cả khóa học được thiết kế bởi môi giới có trên 7 năm kinh nghiệm, dạy theo ca
              thực tế và cập nhật hàng quý theo thị trường.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const tone = COURSE_CATEGORY_TONE[course.category];
              return (
                <article
                  key={course.publicId}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md"
                >
                  {/* Header tone */}
                  <div className="flex items-start gap-4 border-b border-gray-100 p-6">
                    <span
                      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.icon} md:h-14 md:w-14`}
                    >
                      <course.icon aria-hidden className="h-6 w-6 md:h-7 md:w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-theme-xs font-semibold uppercase tracking-[0.15em] ${tone.chip}`}
                      >
                        {COURSE_CATEGORY_LABEL[course.category]}
                      </span>
                      <h3 className="mt-2 font-serif text-lg font-bold leading-tight text-gray-900 md:text-xl">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-base leading-relaxed text-gray-600">{course.description}</p>

                    <ul className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-theme-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <FiPlay aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
                        <span>
                          <span className="font-semibold">{course.sessions}</span> buổi ·{' '}
                          <span className="font-semibold">{course.hours}</span> giờ
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiUsers aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
                        <span>GV: {course.instructor}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-theme-xs font-bold uppercase ${tone.chip}`}
                        >
                          {course.level}
                        </span>
                      </li>
                    </ul>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                      <span className={`font-serif text-xl font-bold ${tone.accent}`}>
                        {formatPrice(course.price)}
                      </span>
                      <Link
                        href="#lich-khai-giang"
                        className={`group/btn inline-flex items-center gap-1 text-theme-sm font-semibold ${tone.accent} hover:underline`}
                      >
                        Đăng ký
                        <FiArrowRight
                          aria-hidden
                          className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 04 GIẢNG VIÊN ============ */}
      <section className="site-container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
            Giảng viên
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            Học từ người đã làm thật
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Mỗi giảng viên đều có tối thiểu 7 năm kinh nghiệm thực chiến trên thị trường BĐS Việt Nam.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((instructor) => (
            <article
              key={instructor.publicId}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md"
            >
              <UserAvatar
                name={instructor.name}
                src={instructor.avatar}
                size={112}
                className="mx-auto shadow-theme-md ring-4 ring-white"
              />

              <h3 className="mt-5 font-serif text-lg font-bold text-gray-900 md:text-xl">
                {instructor.name}
              </h3>
              <p className="mt-1 text-theme-xs uppercase tracking-[0.18em] text-orange-600">
                {instructor.role}
              </p>

              <p className="mt-3 text-theme-sm font-semibold text-gray-700">
                {instructor.experience} kinh nghiệm
              </p>

              <p className="mt-3 text-theme-sm leading-relaxed text-gray-600">{instructor.bio}</p>

              <ul className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                {instructor.specialties.map((spec) => (
                  <li
                    key={spec}
                    className="rounded-full bg-orange-50 px-2.5 py-0.5 text-theme-xs font-semibold text-orange-700"
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ============ 05 LỊCH KHAI GIẢNG ============ */}
      <section
        id="lich-khai-giang"
        className="border-y border-gray-200 bg-gradient-to-br from-orange-50 via-white to-brand-50 py-16 md:py-24"
      >
        <div className="site-container">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              Lịch khai giảng
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              Các lớp sắp khai giảng
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              Đăng ký sớm để giữ chỗ — học viên đăng ký trước 7 ngày được giảm 15%.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.publicId} session={session} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 06 HỌC VIÊN NÓI GÌ ============ */}
      <section className="site-container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
            Cảm nhận học viên
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            2.500+ học viên đã tốt nghiệp
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.publicId} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* ============ 07 CTA CUỐI ============ */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-950 to-orange-950 py-16 text-white md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white/5 p-10 text-center backdrop-blur-sm md:p-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white">
              <HiOutlineSparkles aria-hidden className="h-3.5 w-3.5 text-orange-300" />
              Sẵn sàng bắt đầu?
            </span>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Học miễn phí, học có định hướng
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Đăng ký khóa Nhập môn BĐS miễn phí để đánh giá phong cách giảng dạy trước khi đầu tư
              lộ trình dài hơn.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#khoa-hoc"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-orange-600"
              >
                Đăng ký miễn phí
                <FiArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/tro-thanh-moi-gioi"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Trở thành môi giới
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// ============================================================================
// SessionCard - the hien 1 lich khai giang
// ============================================================================

const SessionCard = ({ session }: { session: TrainingSession }) => {
  const isFull = session.seats.remaining === 0;
  const seatsPercent = ((session.seats.total - session.seats.remaining) / session.seats.total) * 100;

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition hover:-translate-y-0.5 hover:shadow-theme-md md:p-7">
      <div className="flex items-start gap-4">
        {/* Date badge */}
        <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-orange-500 px-3 py-3 text-white shadow-theme-md md:w-24">
          <span className="font-serif text-2xl font-bold leading-none md:text-3xl">
            {session.startDate.split('/')[0]}
          </span>
          <span className="mt-1 text-theme-xs uppercase tracking-[0.2em] opacity-90">
            Tháng {session.startDate.split('/')[1]}
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-bold leading-tight text-gray-900 md:text-xl">
            {session.title}
          </h3>
          <ul className="mt-3 space-y-1.5 text-theme-sm text-gray-600">
            <li className="flex items-center gap-2">
              <FiClock aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
              {session.schedule}
            </li>
            <li className="flex items-center gap-2">
              {session.format === 'Online' ? (
                <FiVideo aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
              ) : session.format === 'Offline' ? (
                <FiMapPin aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
              ) : (
                // Hybrid: video + map
                <span className="flex shrink-0 items-center gap-0.5 text-gray-400">
                  <FiVideo aria-hidden className="h-3.5 w-3.5" />
                  <FiMapPin aria-hidden className="h-3.5 w-3.5" />
                </span>
              )}
              <span>
                {session.format}
                {session.location ? ` · ${session.location}` : ''}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer: seats + price */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="min-w-0 flex-1 pr-4">
          <div className="flex items-center justify-between text-theme-xs text-gray-600">
            <span>Còn {session.seats.remaining}/{session.seats.total} chỗ</span>
            <span className="font-semibold">
              {isFull ? 'Đã đầy' : seatsPercent >= 75 ? 'Sắp hết' : 'Còn chỗ'}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                seatsPercent >= 90
                  ? 'bg-rose-500'
                  : seatsPercent >= 70
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${seatsPercent}%` }}
            />
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-serif text-lg font-bold text-orange-600 md:text-xl">
            {formatPrice(session.price)}
          </div>
        </div>
      </div>

      <Link
        href="/lien-he"
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-theme-sm font-semibold transition ${
          isFull
            ? 'border border-gray-200 bg-gray-50 text-gray-400'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {isFull ? 'Đã đầy · Đăng ký danh sách chờ' : 'Đăng ký ngay'}
      </Link>
    </article>
  );
};

// ============================================================================
// TestimonialCard
// ============================================================================

const TestimonialCard = ({ testimonial }: { testimonial: TrainingTestimonial }) => (
  <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs md:p-7">
    <svg
      aria-hidden
      className="h-7 w-7 text-orange-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9.13 14.5H4.75c-.41 0-.75-.34-.75-.75 0-3.62 2.88-6.5 6.5-6.5.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75-2.21 0-4 1.79-4 4v.5h2.63c.41 0 .75.34.75.75s-.34.75-.75.75zm9 0h-4.38c-.41 0-.75-.34-.75-.75 0-3.62 2.88-6.5 6.5-6.5.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75-2.21 0-4 1.79-4 4v.5h2.63c.41 0 .75.34.75.75s-.34.75-.75.75z" />
    </svg>

    <blockquote className="mt-4 flex-1 font-serif text-base italic leading-relaxed text-gray-800">
      {testimonial.quote}
    </blockquote>

    <footer className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
      <div
        aria-hidden
        className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-700"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(${
            testimonial.publicId.charCodeAt(testimonial.publicId.length - 1) * 7
          }, 70%, 60%), hsl(${
            testimonial.publicId.charCodeAt(testimonial.publicId.length - 1) * 11
          }, 60%, 45%))`,
        }}
      />
      <div className="min-w-0">
        <p className="text-theme-sm font-bold text-gray-900">{testimonial.name}</p>
        <p className="text-theme-xs text-gray-500">{testimonial.role}</p>
        <p className="mt-0.5 text-theme-xs italic text-orange-600">&ldquo;{testimonial.course}&rdquo;</p>
      </div>
    </footer>
  </article>
);

export default DaoTaoPage;