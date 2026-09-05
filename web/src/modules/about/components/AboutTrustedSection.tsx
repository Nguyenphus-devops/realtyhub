'use client';

/**
 * Section "DUOC KHACH HANG TIN TUONG VA LUA CHON".
 *
 * Tap trung vao GIA TRI mang lai - khong tu tao so lieu khach hang /
 * giao dich khong co nguon (theo yeu cau product).
 *
 * Layout: header trung tam + grid 3 cot (mobile 1) cac the gia tri.
 *
 * Ghi chu SSR: icon duoc truyen duoi dang `iconKey` (string).
 */

import { resolveAboutIcon } from './iconRegistry';
import type { AboutTrusted } from '../models/about.model';

type AboutTrustedSectionProps = {
  trusted: AboutTrusted;
};

const AboutTrustedSection = ({ trusted }: AboutTrustedSectionProps) => (
  <section
    className="bg-white py-20 md:py-28"
    aria-labelledby="about-trusted-heading"
  >
    <div className="site-container">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-600">
          <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
          Tin tưởng & lựa chọn
          <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
        </span>

        <h2
          id="about-trusted-heading"
          className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight text-navy-800 md:text-3xl lg:text-4xl"
        >
          {trusted.title}
        </h2>

        <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
          {trusted.subtitle}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trusted.values.map((value) => {
          const Icon = resolveAboutIcon(value.iconKey);
          return (
            <article
              key={value.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-theme-xs transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
            >
              {/* Sao trang tri o goc tren phai */}
              <span
                aria-hidden
                className="absolute right-5 top-5 text-theme-xs font-bold tracking-[0.2em] text-gray-200"
              >
                ★
              </span>

              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                <Icon aria-hidden className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-base font-bold text-navy-800">{value.title}</h3>
              <p className="text-theme-sm leading-relaxed text-gray-600">{value.description}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default AboutTrustedSection;
