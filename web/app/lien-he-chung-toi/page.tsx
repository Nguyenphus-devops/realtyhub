import Image from 'next/image';
import Link from 'next/link';

import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiTwitch,
} from 'react-icons/fi';
import { FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';

import ContactForm from '@/modules/contact/components/ContactForm';
import MemberCompaniesTable from '@/modules/about/components/MemberCompaniesTable';
import { MEMBER_COMPANIES } from '@/modules/about/mocks/about.mock';

import type { Metadata } from 'next';

/**
 * Trang /lien-he-chung-toi - Trang lien he chinh cua RealtyHub.
 *
 * Layout (server component + 1 client component cho form):
 *   01 Hero (gradient navy -> jade, breadcrumb + 4 contact info cards)
 *   02 Form + sidebar (2 cot: form trai, info phai)
 *   03 Branches (3 chi nhanh HN/HCM/DN)
 *   04 Cong ty thanh vien (bang dia chi tru so)
 *   05 FAQ (4 cau hoi thuong gap)
 *   06 CTA cuối (hotline + social)
 *
 * Tone chinh: jade (xanh ngoc - matching ComingSoon tone).
 * Form do ContactForm.tsx (client) handle rieng.
 */
export const metadata: Metadata = {
  title: 'Liên hệ chúng tôi',
  description:
    'Liên hệ với đội ngũ RealtyHub — Email, hotline, chi nhánh Hà Nội, TP.HCM, Đà Nẵng. Phản hồi trong 24 giờ làm việc.',
};

// ============================================================================
// Static data
// ============================================================================

const CONTACT_CARDS = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'info@realtyhub.vn',
    href: 'mailto:info@realtyhub.vn',
    sub: 'Phản hồi trong 24 giờ',
  },
  {
    icon: FiPhone,
    label: 'Hotline',
    value: '024 7100 0000',
    href: 'tel:+842471000000',
    sub: 'T2 - T7 | 8:00 - 21:00',
  },
  {
    icon: FiMessageCircle,
    label: 'Trò chuyện trực tiếp',
    value: 'Mở Live Chat',
    href: '#live-chat',
    sub: 'Hỗ trợ tức thì 8:00 - 22:00',
  },
  {
    icon: FiMapPin,
    label: 'Văn phòng chính',
    value: 'Hà Nội',
    href: '#branches',
    sub: 'Xem 3 chi nhánh',
  },
];

const BRANCHES = [
  {
    city: 'Hà Nội',
    role: 'Trụ sở chính',
    address: 'Tầng 12, Tòa nhà Capital Place, 29 Liễu Giai, Ba Đình',
    phone: '024 7100 0000',
    email: 'hanoi@realtyhub.vn',
    hours: 'T2 - T7: 8:00 - 21:00',
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=105.8100%2C21.0250%2C105.8250%2C21.0400&layer=mapnik&marker=21.0325%2C105.8175',
  },
  {
    city: 'TP. Hồ Chí Minh',
    role: 'Chi nhánh phía Nam',
    address: 'Tầng 8, Tòa nhà Bitexco Financial, 2 Hải Triều, Quận 1',
    phone: '028 7100 0000',
    email: 'hcm@realtyhub.vn',
    hours: 'T2 - T7: 8:00 - 21:00',
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=106.6950%2C10.7700%2C106.7100%2C10.7850&layer=mapnik&marker=10.7775%2C106.7025',
  },
  {
    city: 'Đà Nẵng',
    role: 'Chi nhánh miền Trung',
    address: 'Tầng 5, Tòa nhà Indochina Riverside, 74 Bạch Đằng',
    phone: '023 6710 0000',
    email: 'danang@realtyhub.vn',
    hours: 'T2 - T7: 8:00 - 18:00',
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=108.2150%2C16.0600%2C108.2300%2C16.0750&layer=mapnik&marker=16.0675%2C108.2225',
  },
];

const FAQ_ITEMS = [
  {
    q: 'RealtyHub có tính phí tư vấn không?',
    a: 'Tư vấn qua hotline, email và live chat hoàn toàn miễn phí. Phí dịch vụ chỉ áp dụng khi bạn sử dụng gói đăng tin dự án cao cấp hoặc dịch vụ môi giới trọn gói.',
  },
  {
    q: 'Tôi có thể đăng ký làm môi giới như thế nào?',
    a: 'Truy cập trang "Trở thành môi giới" để đăng ký tài khoản miễn phí. Sau đó hoàn thành khóa đào tạo nền tảng (12 giờ) để được cấp chứng nhận RealtyHub Certified.',
  },
  {
    q: 'RealtyHub có hỗ trợ pháp lý không?',
    a: 'Có. Đội ngũ luật sư đối tác của RealtyHub hỗ trợ tư vấn pháp lý miễn phí cho mọi giao dịch được thực hiện qua nền tảng. Phí dịch vụ pháp lý chỉ áp dụng cho thủ tục công chứng và sang tên.',
  },
  {
    q: 'Làm sao để báo cáo tin đăng không đúng sự thật?',
    a: 'Bạn có thể nhấn nút "Báo cáo" trên mỗi tin đăng hoặc gửi email đến report@realtyhub.vn. Đội ngũ kiểm duyệt sẽ phản hồi trong vòng 4 giờ làm việc.',
  },
];



const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: FaFacebookF, color: 'bg-blue-600' },
  { label: 'YouTube', href: '#', icon: FaYoutube, color: 'bg-red-600' },
  { label: 'TikTok', href: '#', icon: FaTiktok, color: 'bg-gray-900' },
  { label: 'Zalo', href: '#', icon: FiMessageCircle, color: 'bg-blue-500' },
];

// ============================================================================
// Page
// ============================================================================

const LienHeChungToiPage = () => (
  <main className="bg-white">
    {/* ============ 01 HERO ============ */}
    <section className="relative isolate overflow-hidden bg-gray-900 py-16 text-white md:py-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/lien-he-chung-toi.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/92 via-brand-950/88 to-jade-950/92" />
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
              <li className="text-white/90">Liên hệ chúng tôi</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-jade-400" />
            Hỗ trợ 24/7
          </span>

          <h1 className="mt-6 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
            Chúng tôi luôn sẵn sàng
            <br />
            <span className="font-bold text-jade-400">lắng nghe bạn</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            Đội ngũ RealtyHub phản hồi trong vòng 24 giờ làm việc. Đối với câu hỏi gấp,
            vui lòng gọi hotline hoặc dùng live chat bên dưới.
          </p>
        </div>

        {/* Contact cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-jade-500/20 text-jade-300 transition group-hover:bg-jade-500 group-hover:text-white">
                <card.icon aria-hidden className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-theme-xs uppercase tracking-[0.18em] text-white/55">
                  {card.label}
                </div>
                <div className="mt-0.5 font-serif text-lg font-bold text-white">
                  {card.value}
                </div>
                <div className="mt-0.5 text-theme-xs text-white/65">{card.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* ============ 02 FORM + SIDEBAR ============ */}
    <section className="site-container py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        {/* Form (trai - 3 col) */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-jade-600">
              Gửi yêu cầu
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              Điền form và chúng tôi sẽ liên hệ lại
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Vui lòng mô tả chi tiết nhu cầu của bạn. Đội ngũ tư vấn sẽ chọn đúng chuyên viên
              phụ trách lĩnh vực để phản hồi nhanh nhất.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-theme-xs md:p-10">
            <ContactForm />
          </div>
        </div>

        {/* Sidebar (phai - 2 col) */}
        <aside className="lg:col-span-2">
          <div className="sticky top-8 space-y-6">
            {/* Working hours card */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-jade-50 text-jade-600">
                <FiClock aria-hidden className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">
                Giờ làm việc
              </h3>
              <ul className="mt-4 space-y-2.5 text-theme-sm text-gray-700">
                <li className="flex items-center justify-between gap-2">
                  <span>Thứ 2 - Thứ 6</span>
                  <span className="font-semibold">8:00 - 21:00</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Thứ 7</span>
                  <span className="font-semibold">8:00 - 18:00</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Chủ nhật</span>
                  <span className="font-semibold text-rose-600">Nghỉ</span>
                </li>
              </ul>
            </div>

            {/* Response time card */}
            <div className="rounded-2xl border border-jade-100 bg-gradient-to-br from-jade-50 to-white p-6 md:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-jade-500 text-white shadow-theme-sm">
                <FiMessageCircle aria-hidden className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">
                Cam kết phản hồi
              </h3>
              <p className="mt-3 text-theme-sm leading-relaxed text-gray-700">
                95% yêu cầu được phản hồi trong vòng{' '}
                <span className="font-bold text-jade-700">4 giờ làm việc</span>.
                Trường hợp khẩn cấp, vui lòng gọi hotline.
              </p>
            </div>

            {/* Social */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Kết nối với chúng tôi
              </h3>
              <p className="mt-2 text-theme-sm text-gray-600">
                Cập nhật tin tức và sự kiện mới nhất.
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-theme-sm transition hover:-translate-y-0.5 ${social.color}`}
                    >
                      <social.icon aria-hidden className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* ============ 03 BRANCHES ============ */}
    <section
      id="branches"
      className="border-y border-gray-200 bg-gray-50/60 py-16 md:py-24"
    >
      <div className="site-container">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-jade-600">
            Chi nhánh
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            3 văn phòng trên toàn quốc
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Đến gặp trực tiếp tại bất kỳ chi nhánh nào dưới đây — luôn có chuyên viên tư vấn
            sẵn sàng hỗ trợ bạn.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BRANCHES.map((branch) => (
            <article
              key={branch.city}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-xs transition hover:-translate-y-1 hover:shadow-theme-md"
            >
              {/* Map embed */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <iframe
                  src={branch.mapEmbed}
                  title={`Bản đồ ${branch.city}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <span className="absolute left-3 top-3 inline-flex rounded-full bg-white px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-gray-900 shadow-theme-sm">
                  {branch.city}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-jade-50 px-2.5 py-0.5 text-theme-xs font-bold uppercase tracking-[0.15em] text-jade-700">
                    <FiTwitch aria-hidden className="h-3 w-3" />
                    {branch.role}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl font-bold text-gray-900">
                  {branch.city}
                </h3>
                <p className="mt-2 text-theme-sm leading-relaxed text-gray-600">
                  {branch.address}
                </p>

                <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-theme-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <FiPhone aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
                    <a
                      href={`tel:${branch.phone.replace(/\s/g, '')}`}
                      className="transition hover:text-jade-600"
                    >
                      {branch.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiMail aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
                    <a
                      href={`mailto:${branch.email}`}
                      className="transition hover:text-jade-600"
                    >
                      {branch.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiClock aria-hidden className="h-4 w-4 shrink-0 text-gray-400" />
                    {branch.hours}
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* ============ 04 CÔNG TY THÀNH VIÊN ============ */}
    <section id="cong-ty-thanh-vien" className="site-container py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-jade-600">
          Hệ thống công ty thành viên
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
          {MEMBER_COMPANIES.length} công ty thành viên
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          Địa chỉ trụ sở của các công ty trong hệ thống Đông Tây Group.
        </p>
      </div>
      <MemberCompaniesTable />
    </section>

    {/* ============ 05 FAQ ============ */}
    <section className="site-container py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <span className="inline-block text-theme-xs font-semibold uppercase tracking-[0.25em] text-jade-600">
          Câu hỏi thường gặp
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
          Trước khi liên hệ, có thể bạn quan tâm
        </h2>
      </div>

      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        {FAQ_ITEMS.map((item, idx) => (
          <article
            key={item.q}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs md:p-7"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jade-50 font-serif text-sm font-bold text-jade-700">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <h3 className="font-serif text-lg font-bold text-gray-900">{item.q}</h3>
            </div>
            <p className="mt-3 text-theme-sm leading-relaxed text-gray-600">{item.a}</p>
          </article>
        ))}
      </div>
    </section>

    {/* ============ 06 CTA CUỐI ============ */}
    <section className="bg-gradient-to-br from-gray-900 via-brand-950 to-jade-950 py-16 text-white md:py-20">
      <div className="site-container">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/5 p-10 text-center backdrop-blur-sm md:p-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.2em] text-white">
            <FiPhone aria-hidden className="h-3.5 w-3.5" />
            Hotline 24/7
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Vấn đề khẩn cấp?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Gọi ngay hotline — đội ngũ tư vấn viên trực đường dây 24/7 sẵn sàng hỗ trợ bạn.
          </p>

          <a
            href="tel:+842471000000"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-jade-500 px-8 py-4 text-lg font-bold text-white shadow-theme-sm transition hover:bg-jade-600 md:text-xl"
          >
            <FiPhone aria-hidden className="h-5 w-5" />
            024 7100 0000
          </a>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Đọc tin tức
            </Link>
            <Link
              href="/su-kien"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Lịch sự kiện
              <FiArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default LienHeChungToiPage;