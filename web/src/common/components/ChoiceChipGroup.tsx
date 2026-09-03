'use client';

import { FiCheck } from 'react-icons/fi';

export type ChoiceOption = {
  value: string;
  label: string;
};

type ChoiceChipGroupProps = {
  /** Nhan cho trinh doc man hinh */
  label: string;
  options: ChoiceOption[];
  /** Cac gia tri dang duoc chon */
  values: string[];
  onToggle: (value: string) => void;
  className?: string;
};

/**
 * Nhom the bam, chon duoc nhieu muc cung luc (tien ich, huong nhin).
 *
 * Moi the la mot <button aria-pressed> chu khong phai checkbox an di: nhom nay
 * khong nam trong form nao va khong can ten truong, nen nut bam la dung ngu
 * nghia hon - va van doc duoc trang thai bat/tat.
 */
const ChoiceChipGroup = ({
  label,
  options,
  values,
  onToggle,
  className = '',
}: ChoiceChipGroupProps) => (
  <div role="group" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
    {options.map((option) => {
      const isOn = values.includes(option.value);

      return (
        <button
          key={option.value}
          type="button"
          aria-pressed={isOn}
          onClick={() => onToggle(option.value)}
          className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-theme-sm font-medium transition ${
            isOn
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {isOn && <FiCheck aria-hidden className="shrink-0" />}
          {option.label}
        </button>
      );
    })}
  </div>
);

export default ChoiceChipGroup;
