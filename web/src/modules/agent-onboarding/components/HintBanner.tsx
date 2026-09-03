/**
 * Dai nhac viec dau moi buoc: vien xanh, nen chuyen sac nhat dan ve phai.
 * Nen dung `background` thay vi `bg-gradient-*` de giu duoc mau trang o dau dai.
 */
const HintBanner = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[var(--ob-blue)] bg-gradient-to-r from-white via-white to-[var(--ob-blue-soft)] px-4 py-3.5">
    <p className="flex items-start gap-2 text-theme-sm leading-relaxed text-[var(--ob-ink)]">
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </p>
  </div>
);

export default HintBanner;
