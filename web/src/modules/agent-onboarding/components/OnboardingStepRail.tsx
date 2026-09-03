'use client';

import { FiCheck, FiHeadphones, FiStar } from 'react-icons/fi';
import type {
  OnboardingStep,
  OnboardingStepId,
  OnboardingStepStatus,
} from '../models/agent-onboarding.model';

interface OnboardingStepRailProps {
  steps: OnboardingStep[];
  statusOf: (id: OnboardingStepId) => OnboardingStepStatus;
  onSelect: (id: OnboardingStepId) => void;
}

const DOT_STYLE: Record<OnboardingStepStatus, string> = {
  current: 'bg-[var(--ob-blue)] text-white',
  done: 'bg-[var(--ob-blue-soft)] text-[var(--ob-blue)]',
  locked: 'bg-[#efefef] text-[var(--ob-disabled-ink)]',
};

const LABEL_STYLE: Record<OnboardingStepStatus, string> = {
  current: 'text-[var(--ob-blue)] font-medium',
  done: 'text-[var(--ob-ink)] font-normal',
  locked: 'text-[var(--ob-disabled-ink)]',
};

/**
 * Cot trai: 5 buoc noi nhau bang mot vach doc. Vach cua buoc dang lam duoc to
 * dam len de mat bat ngay vi tri hien tai, giong ban goc.
 */
const OnboardingStepRail = ({ steps, statusOf, onSelect }: OnboardingStepRailProps) => (
  <aside className="flex shrink-0 flex-col justify-between border-[var(--ob-border-soft)] lg:w-[310px] lg:border-r">
    <ol className="p-6">
      {steps.map((step, index) => {
        const status = statusOf(step.id);
        const isLast = index === steps.length - 1;
        const clickable = status !== 'locked';

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              disabled={!clickable}
              aria-current={status === 'current' ? 'step' : undefined}
              className={`flex w-full items-center gap-3 text-left text-theme-sm ${
                clickable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-theme-xs font-semibold ${DOT_STYLE[status]}`}
              >
                {status === 'done' ? (
                  <FiCheck className="h-3.5 w-3.5" aria-hidden />
                ) : step.badge === null ? (
                  <FiStar className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  step.badge
                )}
              </span>
              <span className={LABEL_STYLE[status]}>{step.label}</span>
            </button>

            {!isLast && (
              // Vach noi: can giua duoi vong tron 24px -> lech trai 12px, tru
              // nua be rong vach.
              <span
                aria-hidden
                className={`my-1 ml-[11px] block h-6 w-0.5 rounded-full ${
                  status === 'current' ? 'bg-[var(--ob-blue)]' : 'bg-[var(--ob-border)]'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>

    <p className="p-6 text-center text-theme-xs text-[var(--ob-muted)]">
      Bạn đang gặp vấn đề?{' '}
      <button
        type="button"
        className="inline-flex items-center gap-1 font-medium text-[var(--ob-blue)] hover:underline"
      >
        Liên hệ hỗ trợ
        <FiHeadphones className="h-3.5 w-3.5" aria-hidden />
      </button>
    </p>
  </aside>
);

export default OnboardingStepRail;
