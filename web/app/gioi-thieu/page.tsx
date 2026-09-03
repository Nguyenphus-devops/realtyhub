import Image from 'next/image';
import Link from 'next/link';

import { FiArrowRight, FiCheck, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { HiOutlineTrophy } from 'react-icons/hi2';

import MemberCompaniesTable from '@/modules/about/components/MemberCompaniesTable';
import PartnerSignupForm from '@/modules/about/components/PartnerSignupForm';
import { MEMBER_COMPANIES, MOCK_ABOUT_CONTENT } from '@/modules/about/mocks/about.mock';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về RealtyHub',
  description:
    'RealtyHub công khai giá niêm yết, pháp lý và mặt bằng của từng dự án. Nền tảng do Công ty Cổ phần Đông Tây Land vận hành.',
};

const ABOUT = MOCK_ABOUT_CONTENT;

const Eyebrow = ({ children, tone = 'dark' }: { children: string; tone?: 'dark' | 'light' }) => (
  <span
    className={`inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] ${
      tone === 'light' ? 'text-brand-300' : 'text-brand-600'
    }`}
  >
    <span aria-hidden className="h-px w-8 bg-current opacity-60" />
    {children}
    <span aria-hidden className="h-px w-8 bg-current opacity-60" />
  </span>
);

const GioiThieuPage = () => (
  <main className="bg-white">
    {/* ============ 01 HERO ============
        Lop phu chi 82-55% de anh nen con nhin thay - ban truoc dat 97% khien
        anh thanh mang mau phang, mat han chieu sau. */}
    <section className="relative isolate overflow-hidden bg-navy-900 pb-44 pt-20 text-white md:pb-52 md:pt-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={ABOUT.hero.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-900/95 via-navy-900/80 to-navy-900/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-navy-900 to-transparent" />
      </div>

      <div className="site-container">
        <div className="max-w-3xl">
          <Eyebrow tone="light">{ABOUT.hero.eyebrow}</Eyebrow>

          <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            {ABOUT.hero.headline}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {ABOUT.hero.lead}
          </p>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {ABOUT.hero.promises.map((promise) => (
              <li
                key={promise}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-2 pl-2 pr-4 text-theme-sm text-white backdrop-blur-sm"
              >
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500"
                >
                  <FiCheck className="h-3 w-3" />
                </span>
                {promise}
              </li>
            ))}
          </ul>

          <Link
            href={ABOUT.cta.buyerHref}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-theme-sm font-semibold shadow-card-hover transition hover:bg-brand-600"
          >
            {ABOUT.cta.buyerLabel}
            <FiArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>

    {/* ============ 02 DẢI PHÁP NHÂN — the trang de len hero ============ */}
    <section className="site-container -mt-28 md:-mt-32">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-gray-200 shadow-card-hover lg:grid-cols-4">
        {ABOUT.hero.facts.map((fact) => (
          <div key={fact.label} className="bg-white px-5 py-6 text-center md:px-6 md:py-7">
            <dt className="text-theme-xs uppercase tracking-wide text-gray-500">{fact.label}</dt>
            <dd className="mt-2 text-base font-bold leading-snug text-navy-800 md:text-lg">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>

    {/* ============ 03 CAM KẾT — lech truc: anh trai, danh sach phai ============ */}
    <section className="site-container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal relative lg:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-gray-100 shadow-card-hover">
            <Image
              src={ABOUT.commitments.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900/80 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -right-4 max-w-xs rounded-2xl bg-brand-600 p-6 text-white shadow-card-hover md:-right-8">
            <p className="text-3xl font-bold leading-none">24 giờ</p>
            <p className="mt-2 text-theme-sm leading-relaxed text-white/85">
              là thời gian tối đa để chúng tôi sửa một thông tin sai sau khi bạn báo.
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Eyebrow>Cam kết</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-800 md:text-4xl">
            {ABOUT.commitments.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {ABOUT.commitments.subtitle}
          </p>

          <ul className="mt-9 space-y-4">
            {ABOUT.commitments.items.map((item, index) => (
              <li
                key={item.title}
                className="reveal group relative flex gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-card"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white"
                >
                  <item.icon />
                </span>

                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-base font-bold text-navy-800">
                    <FiCheck aria-hidden className="shrink-0 text-brand-500" />
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-theme-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="absolute right-4 top-4 text-theme-xs font-bold tracking-[0.2em] text-gray-200"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* ============ 04 SỐ LIỆU — chu so co lon lam diem nhan ============ */}
    <section className="site-container py-20 md:py-28">
      <div className="relative overflow-hidden rounded-3xl bg-gray-50">
        <div aria-hidden className="absolute inset-0">
          <Image
            src={ABOUT.stats.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-15"
          />
        </div>

        <div className="relative px-6 py-14 md:px-12 md:py-16">
          <div className="mb-12 text-center">
            <Eyebrow>Số liệu</Eyebrow>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
              {ABOUT.stats.title}
            </h2>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-theme-xs text-gray-600">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-jade-500" />
              {ABOUT.stats.updatedAt}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {ABOUT.stats.items.map((stat) => (
              <div key={stat.label} className="reveal text-center">
                <dd className="text-4xl font-bold leading-none tracking-tight text-brand-600 md:text-5xl">
                  {stat.value}
                </dd>
                <dt className="mt-3 text-theme-sm font-bold text-navy-800">{stat.label}</dt>
                <p className="mt-1 text-theme-xs text-gray-500">{stat.note}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>

    {/* ============ 05 QUY TRÌNH — lech truc: buoc trai, anh phai ============ */}
    <section className="border-y border-gray-200 bg-gray-50/70 py-20 md:py-28">
      <div className="site-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow>Quy trình</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-800 md:text-4xl">
            {ABOUT.curation.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            {ABOUT.curation.subtitle}
          </p>

          <ol className="mt-10 space-y-6">
            {ABOUT.curation.steps.map((step, index) => (
              <li key={step.title} className="reveal flex gap-5">
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-500 text-theme-sm font-bold text-brand-600"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 border-b border-gray-200 pb-6">
                  <h3 className="text-base font-bold text-navy-800">{step.title}</h3>
                  <p className="mt-1.5 text-theme-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="reveal lg:col-span-5">
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-white shadow-card-hover">
            <Image
              src={ABOUT.curation.image}
              alt="Mặt bằng phân lô được số hoá trên RealtyHub"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-center text-theme-xs text-gray-500">
            Mặt bằng phân lô được số hoá theo bản chủ đầu tư công bố
          </p>
        </div>
      </div>
    </section>

    {/* ============ 06 CÔNG CỤ — the dau chiem 2 cot lam diem nhan ============ */}
    <section className="site-container py-20 md:py-28">
      <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Sản phẩm</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-800 md:text-4xl">
            {ABOUT.modules.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {ABOUT.modules.subtitle}
          </p>
        </div>

        <Link
          href="/tinh-nang"
          className="group inline-flex shrink-0 items-center gap-2 text-theme-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Xem toàn bộ tính năng
          <FiArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ABOUT.modules.items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={`reveal group relative flex flex-col overflow-hidden rounded-2xl bg-navy-900 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
              index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
            }`}
          >
            <div className={`relative ${index === 0 ? 'aspect-video' : 'aspect-16/10'}`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes={index === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/45 to-transparent" />
            </div>

            {/* Chu dat trong lop phu chu khong duoi anh: khoi lien mach, dac
                hon hai o roi rac va anh duoc dung to hon. */}
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl text-white backdrop-blur-sm"
              >
                <item.icon />
              </span>
              <h3
                className={`mt-4 font-bold text-white ${
                  index === 0 ? 'text-xl md:text-2xl' : 'text-base'
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-2 leading-relaxed text-white/75 ${
                  index === 0 ? 'max-w-lg text-theme-sm md:text-base' : 'text-theme-sm'
                }`}
              >
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-theme-sm font-semibold text-brand-300">
                Xem chi tiết
                <FiArrowRight
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* ============ 07 THÀNH TỰU ============ */}
    <section className="site-container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Thành tựu</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-800 md:text-4xl">
            Được thị trường ghi nhận
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Những giải thưởng dành cho Đông Tây Land — đơn vị vận hành RealtyHub.
          </p>

          <div className="reveal mt-10 flex items-center gap-5 rounded-2xl border border-gold-200 bg-gold-200/30 p-6">
            <span
              aria-hidden
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-3xl text-white"
            >
              <HiOutlineTrophy />
            </span>
            <div className="min-w-0">
              <p className="text-4xl font-bold leading-none tracking-tight text-navy-800">
                {ABOUT.company.awards.length}
              </p>
              <p className="mt-1.5 text-theme-sm leading-snug text-gray-600">
                giải thưởng ngành trong 4 năm liên tiếp
              </p>
            </div>
          </div>
        </div>

        <ol className="min-w-0 lg:col-span-7">
          {ABOUT.company.awards.map((award) => (
            <li
              key={award.title}
              className="reveal group flex items-start gap-5 border-b border-gray-200 py-5 first:pt-0 last:border-b-0"
            >
              <span className="w-24 shrink-0 pt-0.5 text-theme-sm font-bold tabular-nums text-gold-500">
                {award.period}
              </span>
              <span className="min-w-0 flex-1 text-base font-semibold leading-snug text-navy-800 transition group-hover:text-brand-600">
                {award.title}
              </span>
              <HiOutlineTrophy
                aria-hidden
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-gold-400"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* ============ 08 PHÁP NHÂN — khoi toi, anh nen toa nha ============ */}
    <section className="relative isolate overflow-hidden bg-navy-900 py-20 text-white md:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image src={ABOUT.stats.image} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-br from-navy-900/96 via-navy-900/92 to-brand-900/85" />
      </div>

      <div className="site-container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow tone="light">Pháp nhân</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {ABOUT.company.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {ABOUT.company.subtitle}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="reveal lg:col-span-5">
            <div className="overflow-hidden rounded-2xl bg-white text-navy-800 shadow-card-hover">
              <div className="bg-brand-600 px-7 py-5">
                <p className="text-theme-xs uppercase tracking-[0.2em] text-white/70">
                  Đơn vị vận hành
                </p>
                <p className="mt-1 text-lg font-bold leading-snug text-white">
                  {ABOUT.company.legalName}
                </p>
              </div>

              <div className="p-7">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Giấy phép ĐKKD', value: ABOUT.company.license },
                    { label: 'Đăng ký lần đầu', value: ABOUT.company.since },
                  ].map((row) => (
                    <div key={row.label} className="rounded-xl bg-gray-50 px-4 py-3">
                      <dt className="text-theme-xs uppercase tracking-wide text-gray-500">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-lg font-bold tabular-nums text-navy-800">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 text-theme-sm leading-relaxed text-gray-600">
                  <span className="text-gray-500">Đại diện pháp luật: </span>
                  <span className="font-semibold text-gray-800">
                    {ABOUT.company.representative}
                  </span>
                </p>

                <ul className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-theme-sm">
                  <li className="flex items-start gap-2.5">
                    <FiMapPin aria-hidden className="mt-1 shrink-0 text-brand-500" />
                    <span className="text-gray-600">{ABOUT.company.headquarters}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiPhone aria-hidden className="mt-1 shrink-0 text-brand-500" />
                    <span className="flex flex-wrap gap-x-3">
                      {ABOUT.company.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="font-semibold text-gray-700 transition hover:text-brand-600"
                        >
                          {phone}
                        </a>
                      ))}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiMail aria-hidden className="mt-1 shrink-0 text-brand-500" />
                    <a
                      href={`mailto:${ABOUT.company.email}`}
                      className="text-gray-600 transition hover:text-brand-600"
                    >
                      {ABOUT.company.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <h3 className="text-theme-sm font-bold uppercase tracking-[0.2em] text-white/60">
              Văn phòng trên toàn quốc
            </h3>

            {/* Luoi thay cot doc: 5 van phong bay ra thanh mang luoi cho cam
                giac quy mo, mot cot chu hep thi doc nhu danh ba. */}
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {ABOUT.company.offices.map((office) => (
                <li
                  key={office.city}
                  className="reveal rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition hover:border-brand-400/50 hover:bg-white/10"
                >
                  <span className="flex items-center gap-2 text-base font-bold text-white">
                    <FiMapPin aria-hidden className="h-4 w-4 shrink-0 text-brand-300" />
                    {office.city}
                  </span>
                  <span className="mt-2 block text-theme-sm leading-relaxed text-white/65">
                    {office.address}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="text-theme-xs uppercase tracking-[0.2em] text-white/50">Chứng nhận</p>
              <ul className="mt-4 flex flex-wrap items-center gap-4">
                {ABOUT.company.certifications.map((cert) => (
                  <li key={cert.label}>
                    <a
                      href={cert.href}
                      aria-label={cert.label}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block rounded-md bg-white/95 p-1.5 transition hover:bg-white"
                    >
                      <Image
                        src={cert.image}
                        alt={cert.label}
                        width={767}
                        height={263}
                        className="h-11 w-auto"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ============ 09 CÔNG TY THÀNH VIÊN ============ */}
    <section id="cong-ty-thanh-vien" className="site-container py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Eyebrow>Hệ thống</Eyebrow>
        <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-800 md:text-4xl">
          {MEMBER_COMPANIES.length} công ty thành viên
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Địa chỉ trụ sở của các công ty trong hệ thống Đông Tây Group.
        </p>
      </div>

      <MemberCompaniesTable />
    </section>

    {/* ============ 10 CÂU HỎI THẲNG ============ */}
    <section className="site-container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>Minh bạch</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-800 md:text-4xl">
            {ABOUT.faq.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">{ABOUT.faq.subtitle}</p>

          <div className="mt-8 rounded-2xl bg-brand-25 p-6">
            <p className="text-theme-sm font-bold text-navy-800">Còn câu hỏi khác?</p>
            <p className="mt-1.5 text-theme-sm leading-relaxed text-gray-600">
              Gọi {ABOUT.company.phones[0]} hoặc gửi email — chúng tôi trả lời trong 24 giờ làm
              việc.
            </p>
            <Link
              href="/lien-he-chung-toi"
              className="group mt-4 inline-flex items-center gap-1.5 text-theme-sm font-semibold text-brand-600"
            >
              Liên hệ chúng tôi
              <FiArrowRight
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8">
          <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200">
            {ABOUT.faq.items.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="group bg-white px-6 py-5 open:bg-gray-50/70"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-navy-800 marker:content-none">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-lg leading-none text-gray-500 transition group-open:rotate-45 group-open:border-brand-500 group-open:bg-brand-500 group-open:text-white"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-11 text-theme-sm leading-relaxed text-gray-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ============ 11 CTA ============ */}
    <section className="relative isolate overflow-hidden bg-navy-900 py-20 text-white md:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/heroes/tinh-nang.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-900/96 via-navy-900/88 to-brand-900/80" />
      </div>

      <div className="site-container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow tone="light">Bắt đầu</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {ABOUT.cta.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">
            {ABOUT.cta.body}
          </p>

          <Link
            href={ABOUT.cta.buyerHref}
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-theme-sm font-semibold text-navy-800 transition hover:bg-white/90"
          >
            {ABOUT.cta.buyerLabel}
            <FiArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="mt-10 border-t border-white/15 pt-6 text-theme-sm text-white/65">
            {ABOUT.cta.agentNote}
          </p>
        </div>

        <div className="lg:col-span-6">
          <PartnerSignupForm />
        </div>
      </div>
    </section>
  </main>
);

export default GioiThieuPage;
