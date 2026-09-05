'use client';

/**
 * Section "DONG HANH CUNG BAN TU A DEN Z".
 *
 * Trinh bay hanh trinh cua mot moi gioi tren RealtyHub duoi dang
 * timeline doc (vertical), voi so thu tu, tieu de va mo ta.
 *
 * Tren mobile: timeline full-width.
 * Tren desktop: 2 cot - cot trai timeline, cot phai the thong tin
 * "tam linh" nho de can doi mat do.
 */

import { FiCheck } from 'react-icons/fi';

import type { AboutJourney } from '../models/about.model';

type AboutJourneySectionProps = {
  journey: AboutJourney;
};

const AboutJourneySection = ({ journey }: AboutJourneySectionProps) => (
  <section
    className="border-y border-gray-200 bg-gray-50/70 py-20 md:py-28"
    aria-labelledby="about-journey-heading"
  >
    <div className="site-container grid gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Cot trai: tieu de + timeline */}
      <div className="min-w-0 lg:col-span-7">
        <span className="inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-600">
          <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
          Đồng hành
          <span aria-hidden className="h-px w-8 bg-brand-600 opacity-60" />
        </span>

        <h2
          id="about-journey-heading"
          className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight text-navy-800 md:text-3xl lg:text-4xl"
        >
          {journey.title}
        </h2>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
          {journey.subtitle}
        </p>

        <ol className="mt-12 space-y-6">
          {journey.steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-5">
              {/* So thu tu */}
              <span
                aria-hidden
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-500 bg-white text-theme-sm font-bold text-brand-600 shadow-theme-xs"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Noi dung */}
              <div className="min-w-0 flex-1 border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center gap-2">
                  <FiCheck aria-hidden className="h-4 w-4 shrink-0 text-brand-500" />
                  <h3 className="text-base font-bold text-navy-800">{step.title}</h3>
                </div>
                <p className="mt-1.5 text-theme-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>

              {/* Duong noi giua cac buoc (hien thi tren desktop, khong phai
                  buoc cuoi cung) */}
              {index < journey.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-5 top-11 h-[calc(100%+1.5rem-44px)] w-px bg-brand-200"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Cot phai: panel thong tin phu, can doi mat do */}
      <aside className="lg:col-span-5">
        <div className="sticky top-28 space-y-6">
          {/* The tom tat */}
          <div className="rounded-2xl border border-brand-200 bg-brand-25 p-6 md:p-8">
            <p className="text-theme-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              Cam kết đồng hành
            </p>
            <p className="mt-3 text-base leading-relaxed text-navy-800 md:text-lg">
              Mỗi bước trong hành trình đều có công cụ hỗ trợ — để bạn tập trung
              vào khách hàng, không phải vào thao tác thủ công.
            </p>
          </div>

          {/* The nhac nho - 3 diem ngan gon */}
          <ul className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs md:p-8">
            {[
              {
                title: 'Quy trình rõ ràng',
                description: 'Không cần tự xây dựng lại từ đầu.',
              },
              {
                title: 'Công cụ đồng bộ',
                description: 'Một dữ liệu nguồn cho mọi thao tác.',
              },
              {
                title: 'Tiết kiệm thời gian',
                description: 'Tập trung vào tư vấn và chốt deal.',
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
                >
                  <FiCheck className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-navy-800">{item.title}</p>
                  <p className="mt-0.5 text-theme-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  </section>
);

export default AboutJourneySection;
