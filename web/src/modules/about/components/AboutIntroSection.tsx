'use client';

/**
 * Section GIOI THIEU - "REALTYHUB - Nen tang cong nghe danh rieng cho
 * moi gioi bat dong san".
 *
 * Trinh bay:
 *  - Eyebrow + tieu de lon (in hoa)
 *  - Doan mo ta chinh (lead)
 *  - Grid cac gia tri cot loi (pillars) - 2 cot mobile, 3 cot tablet, 4 cot desktop
 *
 * Phu thuoc: react-icons/hi2 (dong bo design system).
 *
 * Ghi chu SSR: icon duoc truyen duoi dang `iconKey` (string), khong phai
 * ComponentType - de khong vi pham ranh gioi server/client. Component
 * resolve icon that qua iconRegistry.
 */

import { resolveAboutIcon } from './iconRegistry';
import type { AboutIntro } from '../models/about.model';

type AboutIntroSectionProps = {
  intro: AboutIntro;
};

const AboutIntroSection = ({ intro }: AboutIntroSectionProps) => (
  <section
    className="site-container py-20 md:py-28"
    aria-labelledby="about-intro-heading"
  >
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-600">
        <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
        Về RealtyHub
        <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
      </span>

      <h2
        id="about-intro-heading"
        className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight text-navy-800 md:text-3xl lg:text-4xl"
      >
        {intro.title}
      </h2>

      <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
        {intro.body}
      </p>
    </div>

    {/* Grid cac gia tri cot loi - 2 cot mobile, 3 tablet, 4 desktop */}
    <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {intro.pillars.map((pillar) => {
        const Icon = resolveAboutIcon(pillar.iconKey);
        return (
          <article
            key={pillar.title}
            className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
              <Icon aria-hidden className="h-6 w-6" />
            </div>

            <h3 className="mb-2 text-base font-bold text-navy-800">{pillar.title}</h3>
            <p className="text-theme-sm leading-relaxed text-gray-600">{pillar.description}</p>
          </article>
        );
      })}
    </div>
  </section>
);

export default AboutIntroSection;
