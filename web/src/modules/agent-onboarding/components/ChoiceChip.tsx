'use client';

import { FiCheck } from 'react-icons/fi';

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

/**
 * Vien bo tron dung cho ca chon nhieu (loai hinh BDS) lan chon mot (khu vuc).
 * Vai tro a11y do component cha quyet dinh, o day chi lo phan nhin.
 */
const ChoiceChip = ({ label, selected, onToggle }: ChoiceChipProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={selected}
    className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-theme-sm font-medium transition-colors ${
      selected
        ? 'border-[var(--ob-blue)] bg-[var(--ob-blue-soft)] text-[var(--ob-blue)]'
        : 'border-[var(--ob-border)] bg-white text-[var(--ob-ink)] hover:bg-[var(--ob-surface)]'
    }`}
  >
    {selected && <FiCheck className="h-3.5 w-3.5" aria-hidden />}
    {label}
  </button>
);

export default ChoiceChip;
