'use client';

import HintBanner from './HintBanner';

interface StepPanelProps {
  /** Vai chu dau tieu de - phan duoc to bang chuyen sac xanh. */
  titleAccent: string;
  titleRest: string;
  hint: string;
  children: React.ReactNode;
  submitLabel: string;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
  /** Loi tra ve tu service, hien ngay tren nut nop. */
  error?: string | null;
}

/**
 * Khung chung cua mot buoc: tieu de, dai nhac viec, phan than, nut nop.
 * Moi buoc chi con lo noi dung rieng cua no.
 */
const StepPanel = ({
  titleAccent,
  titleRest,
  hint,
  children,
  submitLabel,
  canSubmit,
  submitting,
  onSubmit,
  error,
}: StepPanelProps) => (
  <section className="flex min-w-0 flex-1 flex-col gap-5 p-6">
    <h1 className="text-2xl leading-snug">
      <span className="bg-gradient-to-r from-[var(--ob-blue-ink)] to-[var(--ob-blue)] bg-clip-text font-semibold text-transparent">
        {titleAccent}
      </span>
      <span className="font-medium text-[var(--ob-ink)]">{titleRest}</span>
    </h1>

    <HintBanner>{hint}</HintBanner>

    <div className="flex flex-col gap-5">{children}</div>

    <div className="mt-auto pt-4">
      {error && <p className="mb-2 text-theme-sm text-error-600">{error}</p>}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
        className="h-9 w-full rounded-md bg-[var(--ob-blue)] px-2.5 text-theme-sm font-medium text-white transition-colors hover:bg-[var(--ob-blue-strong)] disabled:cursor-not-allowed disabled:bg-[var(--ob-surface)] disabled:text-[var(--ob-muted)]"
      >
        {submitting ? 'Đang gửi...' : submitLabel}
      </button>
    </div>
  </section>
);

export default StepPanel;
