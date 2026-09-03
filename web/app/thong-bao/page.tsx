import Image from 'next/image';
import Link from 'next/link';

import {
  FiArrowRight,
  FiBell,
  FiCheck,
  FiHelpCircle,
  FiMail,
  FiSmartphone,
} from 'react-icons/fi';

import NotificationFeed from '@/modules/notifications/components/NotificationFeed';

import type { Metadata } from 'next';

import {
  CHANNEL_DESCRIPTIONS,
  CHANNEL_LABELS,
  CATEGORY_LABELS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/modules/notifications/mocks/notifications.mock';

/**
 * Trang /thong-bao - Trung tam thong bao cua toi.
 *
 * Layout (server component + 1 client feed):
 *   01 Page header (gradient navy -> indigo, breadcrumb + page title + bell icon)
 *   02 Main grid (feed 3 col + sidebar settings 1 col)
 *   03 CTA (lien he support)
 *
 * Tone chinh: indigo (utility / system) - phan biet brand/jade/orange/cyan.
 */
export const metadata: Metadata = {
  title: 'Thông báo của tôi',
  description:
    'Quản lý tất cả thông báo RealtyHub: cập nhật dự án, phản hồi môi giới, tin tức thị trường và cảnh báo hệ thống.',
};

// ============================================================================
// Page
// ============================================================================

const ThongBaoPage = () => (
  <main className="bg-white">
    {/* ============ 01 PAGE HEADER ============ */}
    <section className="relative isolate overflow-hidden bg-gray-900 py-12 text-white md:py-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/thong-bao.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/92 via-brand-950/88 to-indigo-950/92" />
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
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-theme-xs text-white/60">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/tai-khoan" className="transition hover:text-white">
                    Tài khoản
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-white/90">Thông báo</li>
              </ol>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <FiBell aria-hidden className="h-3.5 w-3.5" />
              Trung tâm thông báo
            </span>

            <h1 className="mt-5 font-serif text-3xl font-light leading-tight md:text-4xl lg:text-5xl">
              Thông báo
              <span className="font-bold text-indigo-400"> của tôi</span>
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Mọi cập nhật về dự án quan tâm, phản hồi môi giới và tin tức thị trường — tập trung tại một nơi.
            </p>
          </div>

          <span
            aria-hidden
            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-300 backdrop-blur-sm md:h-24 md:w-24"
          >
            <FiBell className="h-10 w-10 md:h-12 md:w-12" />
          </span>
        </div>
      </div>
    </section>

    {/* ============ 02 MAIN GRID ============ */}
    <section className="site-container py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-4 lg:gap-10">
        {/* Feed (3 col) */}
        <div className="lg:col-span-3">
          <NotificationFeed />
        </div>

        {/* Sidebar settings (1 col) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Notification settings card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs md:p-7">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-gray-900">
                <FiHelpCircle aria-hidden className="h-4 w-4 text-indigo-500" />
                Cài đặt thông báo
              </h3>
              <p className="mt-2 text-theme-xs text-gray-600">
                Chọn kênh nhận thông báo cho từng loại. Có thể thay đổi bất cứ lúc nào.
              </p>

              <div className="mt-5 space-y-4">
                <ChannelRow icon={FiMail} label={CHANNEL_LABELS.email} desc={CHANNEL_DESCRIPTIONS.email} />
                <ChannelRow icon={FiSmartphone} label={CHANNEL_LABELS.push} desc={CHANNEL_DESCRIPTIONS.push} />
                <ChannelRow icon={FiCheck} label={CHANNEL_LABELS.sms} desc={CHANNEL_DESCRIPTIONS.sms} />
              </div>

              <p className="mt-5 border-t border-gray-100 pt-4 text-theme-xs text-gray-500">
                Để chỉnh chi tiết cho từng loại, vào{' '}
                <Link
                  href="/tai-khoan/cai-dat"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Cài đặt tài khoản
                </Link>
                .
              </p>
            </div>

            {/* Per-category quick summary */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-6 shadow-theme-xs md:p-7">
              <h3 className="font-serif text-base font-bold text-gray-900">
                Phân loại thông báo
              </h3>
              <ul className="mt-4 space-y-2.5 text-theme-sm text-gray-700">
                {DEFAULT_NOTIFICATION_SETTINGS.map((setting) => (
                  <li key={setting.category} className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-theme-xs font-bold uppercase tracking-[0.15em] ${
                        setting.emailEnabled
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      title={
                        setting.emailEnabled
                          ? `Bật thông báo ${CATEGORY_LABELS[setting.category]} qua email`
                          : `Tắt thông báo ${CATEGORY_LABELS[setting.category]} qua email`
                      }
                    >
                      {setting.emailEnabled ? 'ON' : 'OFF'}
                    </span>
                    <span>{CATEGORY_LABELS[setting.category]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip card */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
              <p className="text-theme-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Mẹo
              </p>
              <p className="mt-2 text-theme-sm leading-relaxed text-gray-700">
                Tick vào{' '}
                <span className="font-semibold">checkbox</span> bên trái mỗi thông báo để chọn
                nhiều rồi đánh dấu đã đọc hoặc xoá hàng loạt.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* ============ 03 CTA ============ */}
    <section className="border-t border-gray-200 bg-gray-50/60 py-12 md:py-16">
      <div className="site-container">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-theme-xs md:p-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
            Cần hỗ trợ về thông báo?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Nếu bạn nhận thông báo sai hoặc muốn thay đổi tần suất, đội ngũ hỗ trợ sẵn sàng giúp.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lien-he-chung-toi"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-indigo-600"
            >
              Liên hệ hỗ trợ
              <FiArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link
              href="/huong-dan?audience=buyer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-theme-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Xem hướng dẫn
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

const ChannelRow = ({
  icon: Icon,
  label,
  desc,
}: {
  icon: React.ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  label: string;
  desc: string;
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/40 p-3">
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-theme-xs">
      <Icon aria-hidden className="h-4 w-4" />
    </span>
    <div>
      <div className="text-theme-sm font-semibold text-gray-900">{label}</div>
      <div className="text-theme-xs text-gray-500">{desc}</div>
    </div>
  </div>
);

export default ThongBaoPage;