'use client';

import type { InterestSchedule, SalesPolicy } from '../../../models/project-detail.model';
import { JadePanel } from '../shared';

/** Khung con trong panel xanh - vien mo, nen dam hon mot chut */
const PolicyBox = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-lg border border-white/20 bg-jade-700/45 p-4 text-center ${className}`}
  >
    {children}
  </div>
);

const ScheduleTable = ({ schedule }: { schedule: InterestSchedule }) => (
  <PolicyBox className="text-left">
    <h3 className="mb-3 text-center text-theme-sm font-bold uppercase tracking-wide text-gold-200">
      {schedule.title}
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full min-w-80 border-collapse text-center">
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1.5 text-left text-theme-xs text-white/60">
              <span className="sr-only">Tỷ lệ vay</span>
            </th>
            {schedule.terms.map((term) => (
              <th
                key={term}
                scope="col"
                className="px-2 py-1.5 text-[11px] font-semibold uppercase text-white/70"
              >
                {term}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.rows.map((row) => (
            <tr key={row.publicId} className="border-t border-white/15">
              <th
                scope="row"
                className="whitespace-nowrap px-2 py-2 text-left text-theme-sm font-bold uppercase text-white"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={`${row.publicId}-${index}`}
                  className="px-2 py-2 text-theme-sm font-semibold text-gold-200"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {schedule.rows.map((row) =>
      row.note ? (
        <p key={`${row.publicId}-note`} className="mt-2 text-[11px] leading-snug text-white/60">
          (*) {row.label}: {row.note}
        </p>
      ) : null,
    )}
  </PolicyBox>
);

type SalesPolicyTabProps = {
  salesPolicy: SalesPolicy;
  /** Luon la ten DU AN, ke ca khi xem tu trang phan khu */
  projectName: string;
};

const SalesPolicyTab = ({ salesPolicy, projectName }: SalesPolicyTabProps) => {
  return (
    <div>
      <h2 className="mb-5 text-center text-lg font-bold uppercase tracking-wide text-gray-900">
        Chính sách bán hàng dự án {projectName}
      </h2>

      <JadePanel>
        <div className="space-y-6">
          <p className="text-center text-xl font-bold uppercase leading-snug tracking-wide text-white">
            {salesPolicy.headline}
          </p>

          {/* Chiet khau thanh toan som */}
          <PolicyBox className="mx-auto max-w-2xl">
            <h3 className="mb-3 text-theme-sm font-bold uppercase tracking-wide text-white">
              {salesPolicy.discountTitle}
            </h3>
            <div className="grid grid-cols-2 divide-x divide-white/20">
              {salesPolicy.discounts.map((discount) => (
                <div key={discount.publicId} className="px-3">
                  <p className="text-theme-xs text-white/70">{discount.label}</p>
                  <p className="mt-1 text-theme-xs uppercase text-white/80">Chiết khấu</p>
                  <p className="text-3xl font-bold text-gold-300">{discount.percent}</p>
                </div>
              ))}
            </div>
          </PolicyBox>

          {/* Quyen loi kem theo */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {salesPolicy.perks.map((perk) => (
              <PolicyBox key={perk.publicId}>
                <p className="text-[11px] font-semibold uppercase leading-snug text-white/80">
                  {perk.title}
                </p>
                <p className="mt-1.5">
                  <span className="text-3xl font-bold text-gold-300">{perk.value}</span>
                  <span className="ml-1 text-theme-sm font-semibold text-white/90">
                    {perk.unit}
                  </span>
                </p>
                {perk.note && <p className="text-[11px] text-white/60">{perk.note}</p>}
              </PolicyBox>
            ))}
          </div>

          {/* Ho tro lai suat */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {salesPolicy.interestSchedules.map((schedule) => (
              <ScheduleTable key={schedule.publicId} schedule={schedule} />
            ))}
          </div>

          {/* Khach hang than thiet */}
          <PolicyBox className="mx-auto max-w-3xl">
            <h3 className="mb-3 text-theme-sm font-bold uppercase tracking-wide text-white">
              {salesPolicy.loyalty.title}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {salesPolicy.loyalty.tiers.map((tier) => (
                <div
                  key={tier.publicId}
                  className="rounded-md border border-white/15 bg-jade-800/50 px-3 py-3"
                >
                  <p className="text-theme-xs font-semibold uppercase text-white/80">
                    {tier.name}
                  </p>
                  <p className="text-2xl font-bold text-gold-300">{tier.percent}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] italic text-white/60">{salesPolicy.loyalty.note}</p>
          </PolicyBox>

          {/* Tien do thanh toan */}
          <div>
            <h3 className="mb-3 text-center text-theme-sm font-bold uppercase tracking-wide text-white">
              {salesPolicy.payment.title}
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {salesPolicy.payment.plans.map((plan) => (
                <PolicyBox key={plan.publicId} className="text-left">
                  <p className="mb-3 text-center text-theme-sm font-bold uppercase text-gold-200">
                    {plan.name}
                  </p>
                  <ul className="space-y-2.5">
                    {plan.steps.map((step) => (
                      <li
                        key={step.publicId}
                        className="flex items-center justify-between gap-3 border-t border-white/15 pt-2.5 first:border-0 first:pt-0"
                      >
                        <span className="text-theme-xs leading-snug text-white/80">
                          {step.label}
                          {step.note && (
                            <span className="block text-[11px] text-white/55">{step.note}</span>
                          )}
                        </span>
                        <span className="shrink-0 text-lg font-bold text-gold-300">
                          {step.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </PolicyBox>
              ))}
            </div>
          </div>
        </div>
      </JadePanel>
    </div>
  );
};

export default SalesPolicyTab;
