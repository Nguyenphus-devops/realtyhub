'use client';

/**
 * HERO cho trang /gioi-thieu - phien ban viet lai ngay 05/09/2026.
 *
 * Truoc day hero thuoc MOCK_ABOUT_CONTENT (anh that, navbar gradient, stats
 * row ben duoi) - phu hop cho gioi thieu doanh nghiep truyen thong.
 *
 * Phien ban moi: nhan manh "NEN TANG CONG NGHE DANH CHO MOI GIOI" voi
 * phong cach hien dai - nen gradient dam, cac chip promise, CTA chinh +
 * CTA phu, va bang stats (placeholder khong tu tao so lieu khong nguon).
 */

import Link from 'next/link';

import { FiArrowRight, FiCheck } from 'react-icons/fi';

import type { AboutHero } from '../models/about.model';

type AboutHeroSectionProps = {
  hero: AboutHero;
};

const AboutHeroSection = ({ hero }: AboutHeroSectionProps) => (
  <section
    className="relative isolate overflow-hidden bg-navy-900 pb-44 pt-20 text-white md:pb-52 md:pt-28"
    aria-labelledby="about-hero-heading"
  >
    {/* Lop phu nen gradient - giu phong cach dark, khong can anh that */}
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-linear-to-br from-navy-900 via-navy-900 to-brand-900" />
      {/* Grid cong nghe mo phong - hinh vuong nho, opacity thap */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      {/* 2 vong sang lon - cam giac tech, hien dai */}
      <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-jade-500/10 blur-3xl" />
    </div>

    <div className="site-container">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-300">
          <span aria-hidden className="h-px w-8 bg-current opacity-60" />
          {hero.eyebrow}
          <span aria-hidden className="h-px w-8 bg-current opacity-60" />
        </span>

        <h1
          id="about-hero-heading"
          className="mt-6 text-3xl font-bold uppercase leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
        >
          {hero.headline}
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
          {hero.lead}
        </p>

        {/* Chip promises */}
        <ul className="mt-9 flex flex-wrap gap-2.5">
          {hero.promises.map((promise) => (
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

        {/* CTA chinh + CTA phu */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href={hero.primaryCta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-theme-sm font-bold uppercase tracking-wide shadow-card-hover transition hover:bg-brand-600 sm:w-auto"
          >
            {hero.primaryCta.label}
            <FiArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>

          {hero.secondaryCta && (
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-theme-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 sm:w-auto"
            >
              {hero.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default AboutHeroSection;
