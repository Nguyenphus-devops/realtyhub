'use client';

import { useRef } from 'react';
import { FiCheckCircle, FiUploadCloud } from 'react-icons/fi';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'date';
}

export const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: TextFieldProps) => (
  <label className="block">
    <span className="mb-1.5 block text-theme-sm font-medium text-[var(--ob-ink)]">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-[var(--ob-border)] px-3 text-theme-sm text-[var(--ob-ink)] outline-none placeholder:text-[var(--ob-disabled-ink)] focus:border-[var(--ob-blue)]"
    />
  </label>
);

interface UploadBoxProps {
  label: string;
  fileName: string;
  onPick: (fileName: string) => void;
}

/**
 * O tai anh. Mock chua gui file len may chu nen chi giu lai ten file de UI co
 * cai ma hien - khi noi backend that, doi cho nay sang FormData.
 */
export const UploadBox = ({ label, fileName, onPick }: UploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className="mb-1.5 block text-theme-sm font-medium text-[var(--ob-ink)]">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-theme-xs transition-colors ${
          fileName
            ? 'border-[var(--ob-blue)] bg-[var(--ob-blue-soft)] text-[var(--ob-blue)]'
            : 'border-[var(--ob-border)] bg-[var(--ob-surface)] text-[var(--ob-muted)] hover:bg-[#ebebeb]'
        }`}
      >
        {fileName ? (
          <>
            <FiCheckCircle className="h-5 w-5" aria-hidden />
            <span className="max-w-[85%] truncate">{fileName}</span>
          </>
        ) : (
          <>
            <FiUploadCloud className="h-5 w-5" aria-hidden />
            <span>Bấm để tải ảnh lên (JPG, PNG)</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(event) => onPick(event.target.files?.[0]?.name ?? '')}
      />
    </div>
  );
};
