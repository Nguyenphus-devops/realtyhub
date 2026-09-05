'use client';

/**
 * Section "QUY CAN PHONG PHU - TAP TRUNG DAC BIET TAI THI TRUONG MIEN NAM".
 *
 * Day la mot trong nhung noi dung QUAN TRONG NHAT cua trang /gioi-thieu,
 * nen layout duoc thiet ke noi bat:
 *  - Nen xam nhat (gray-50) de phan biet voi section khac
 *  - Highlight the dong "Mien Nam" voi badge lon + icon vi tri
 *  - Grid 4 muc manh cua quy can
 *  - Callout rieng cho khu vuc (regionCallout) - hien thi noi bat
 *
 * Phu thuoc: react-icons/hi2.
 *
 * Ghi chu SSR: icon duoc truyen duoi dang `iconKey` (string).
 */

import { ABOUT_ICON_MAP, resolveAboutIcon } from './iconRegistry';
import type { AboutInventory } from '../models/about.model';

type AboutInventorySectionProps = {
  inventory: AboutInventory;
};

// Icon cho callout Mien Nam (co dinh = mapPin) - khai bao o module scope
// de ESLint rule `react-hooks/static-components` khong canh bao "create
// components during render", va de dam bao component khong bi re-create
// moi lan render (gia tri cua component instance duoc bao toan).
const RegionIcon = ABOUT_ICON_MAP.mapPin;

const AboutInventorySection = ({ inventory }: AboutInventorySectionProps) => {

  return (
    <section
      className="bg-gray-50 py-20 md:py-28"
      aria-labelledby="about-inventory-heading"
    >
      <div className="site-container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
            Quỹ căn
            <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
          </span>

          <h2
            id="about-inventory-heading"
            className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight text-navy-800 md:text-3xl lg:text-4xl"
          >
            {inventory.title}
          </h2>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            {inventory.subtitle}
          </p>
        </div>

        {/* Callout Mien Nam - the lon, noi bat nhat section */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-card-hover">
          <div className="grid items-stretch md:grid-cols-12">
            {/* Cot trai: badge + ten mien */}
            <div className="relative flex flex-col items-center justify-center gap-3 bg-brand-600 px-6 py-8 text-center md:col-span-4 md:px-8 md:py-12">
              <span
                aria-hidden
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm"
              >
                <RegionIcon className="h-9 w-9" />
              </span>
              <span className="text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
                {inventory.regionCallout.region}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-theme-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                Trọng tâm nguồn hàng
              </span>
            </div>

            {/* Cot phai: mo ta */}
            <div className="flex flex-col justify-center px-6 py-7 md:col-span-8 md:px-10 md:py-10">
              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                {inventory.regionCallout.description}
              </p>
            </div>
          </div>
        </div>

        {/* Grid 4 highlights */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {inventory.highlights.map((item) => {
            const Icon = resolveAboutIcon(item.iconKey);
            return (
              <article
                key={item.title}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-jade-50 text-jade-600 transition group-hover:bg-jade-500 group-hover:text-white">
                  <Icon aria-hidden className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-base font-bold text-navy-800">{item.title}</h3>
                <p className="text-theme-sm leading-relaxed text-gray-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutInventorySection;
