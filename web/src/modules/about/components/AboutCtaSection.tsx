'use client';

/**
 * Section "TRO THANH CONG TAC VIEN" - CTA cuoi trang gioi thieu.
 *
 * Reusable trong trang /gioi-thieu. Khong tao form moi - chi lien ket
 * den cac route da co trong he thong (config trong about-page.mock.ts).
 *
 * Phu thuoc:
 *  - useRouter tu next/navigation de pre-warm route
 *  - cac icon tu react-icons/fi + hi2 (giong design system)
 */

import Link from 'next/link';

import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

import type { AboutCta } from '../models/about.model';

type AboutCtaSectionProps = {
  cta: AboutCta;
};

const AboutCtaSection = ({ cta }: AboutCtaSectionProps) => (
  <section
    className="relative isolate overflow-hidden bg-navy-900 py-20 text-white md:py-28"
    aria-labelledby="about-cta-heading"
  >
    {/* Anh nen + lop phu gradient - dam mau de chu trang noi bat */}
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-linear-to-br from-navy-900 via-navy-900 to-brand-900" />
      {/* Vong sang mo phong tech - 2 vong tron, opacity thap */}
      <div className="absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-jade-500/10 blur-3xl" />
    </div>

    <div className="site-container">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.18em] text-brand-300 backdrop-blur-sm">
          <HiOutlineSparkles aria-hidden className="h-4 w-4" />
          Cộng tác viên
        </span>

        <h2
          id="about-cta-heading"
          className="mt-6 text-3xl font-bold uppercase leading-tight tracking-wide md:text-4xl lg:text-5xl"
        >
          {cta.title}
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
          {cta.body}
        </p>

        {/* Nut chinh + nut phu, can giua */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href={cta.primaryCta.href}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-4 text-theme-sm font-bold uppercase tracking-wide shadow-card-hover transition hover:bg-brand-600 sm:w-auto"
          >
            {cta.primaryCta.label}
            <FiArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>

          {cta.secondaryCta && (
            <Link
              href={cta.secondaryCta.href}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-theme-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 sm:w-auto"
            >
              {cta.secondaryCta.label}
            </Link>
          )}
        </div>

        {cta.footnote && (
          <p className="mt-7 inline-flex items-center gap-2 text-theme-sm text-white/65">
            <FiCheckCircle aria-hidden className="h-4 w-4 shrink-0 text-brand-300" />
            <span>{cta.footnote}</span>
          </p>
        )}
      </div>
    </div>
  </section>
);

export default AboutCtaSection;
