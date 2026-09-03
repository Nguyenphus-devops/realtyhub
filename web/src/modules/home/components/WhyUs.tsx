import {
  FiBarChart2,
  FiHeadphones,
  FiSearch,
  FiShield,
} from 'react-icons/fi';
import type { HomeFeature } from '../models/home.model';

const ICONS = {
  shield: FiShield,
  search: FiSearch,
  support: FiHeadphones,
  chart: FiBarChart2,
} as const;

type WhyUsProps = {
  features: HomeFeature[];
};

/**
 * Khoi "Vi sao chon chung toi" - 4 gia tri cot loi, icon tu react-icons.
 * Pattern giong mot page section thong thuong: container + grid 4 cot.
 */
const WhyUs = ({ features }: WhyUsProps) => (
  <section className="site-container py-8 md:py-12">
    <div className="mb-8 text-center md:mb-10">
      <p className="mb-2 text-theme-xs font-bold uppercase tracking-[0.2em] text-brand-600">
        Vì sao chọn RealtyHub
      </p>
      <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900 md:text-3xl">
        Đồng hành cùng bạn từ A đến Z
      </h2>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = ICONS[feature.icon];
        return (
          <article
            key={feature.publicId}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-card transition hover:shadow-card-hover"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon aria-hidden className="text-xl" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="text-theme-sm leading-relaxed text-gray-600">
              {feature.description}
            </p>
          </article>
        );
      })}
    </div>
  </section>
);

export default WhyUs;
