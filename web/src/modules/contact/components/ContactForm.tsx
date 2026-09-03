'use client';

import { useState, type FormEvent } from 'react';

import { FiAlertCircle, FiCheckCircle, FiLoader, FiSend } from 'react-icons/fi';

/**
 * Form lien he - client component vi can controlled inputs + submit state.
 *
 * Fields (4 + consent):
 *   - Ho ten (required, >= 2 ky tu)
 *   - Email (required, RFC-5322-ish regex don gian)
 *   - So dien thoai (optional, VN phone format 10-11 so)
 *   - Chu de (select, required)
 *   - Noi dung (required, >= 10 ky tu)
 *   - Dong y nhan ban tin (checkbox, optional)
 *
 * Validation: client-side only (mock backend, validate truoc khi submit).
 * Form submit: setTimeout 1.2s gia lap, hien thi success state.
 *
 * Khi co backend (POST /contact):
 *   - Thay setTimeout bang fetch('/v1/contact', { method: 'POST', body: JSON.stringify(payload) })
 *   - Map server errors len field (code 400 -> setError tung field)
 *   - Reset form khi success
 */

type Subject =
  | 'tu-van-du-an'
  | 'moi-gioi'
  | 'hop-tac'
  | 'ho-tro-ky-thuat'
  | 'khac';

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: Subject;
  message: string;
  newsletter: boolean;
};

type FormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMPTY_VALUES: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: 'tu-van-du-an',
  message: '',
  newsletter: false,
};

const SUBJECT_OPTIONS: Array<{ id: Subject; label: string }> = [
  { id: 'tu-van-du-an', label: 'Tư vấn dự án' },
  { id: 'moi-gioi', label: 'Trở thành môi giới' },
  { id: 'hop-tac', label: 'Hợp tác kinh doanh' },
  { id: 'ho-tro-ky-thuat', label: 'Hỗ trợ kỹ thuật' },
  { id: 'khac', label: 'Vấn đề khác' },
];

// ============================================================================
// Validation
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(0|\+84)(\d{9,10})$/;

const validate = (v: ContactFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!v.name.trim() || v.name.trim().length < 2) {
    errors.name = 'Vui lòng nhập họ tên (ít nhất 2 ký tự).';
  }
  if (!v.email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!EMAIL_RE.test(v.email.trim())) {
    errors.email = 'Email không đúng định dạng.';
  }
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim().replace(/\s/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678).';
  }
  if (!v.message.trim() || v.message.trim().length < 10) {
    errors.message = 'Vui lòng nhập nội dung (ít nhất 10 ký tự).';
  }
  return errors;
};

// ============================================================================
// Component
// ============================================================================

const ContactForm = () => {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const onChange = <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Xoa error cu khi user dang sua
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const onBlur = (key: keyof ContactFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allErrors = validate(values);
    setErrors(allErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      newsletter: true,
    });

    if (Object.keys(allErrors).length > 0) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    // Gia lap POST /contact
    setTimeout(() => {
      setStatus('success');
      setValues(EMPTY_VALUES);
      setTouched({});
    }, 1200);
  };

  const fieldError = (key: keyof ContactFormValues): string | undefined =>
    touched[key] ? errors[key] : undefined;

  // Success state
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center md:p-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">
          <FiCheckCircle aria-hidden className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-2xl font-bold text-gray-900">
          Gửi liên hệ thành công
        </h3>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          Cảm ơn bạn đã liên hệ với RealtyHub. Đội ngũ tư vấn sẽ phản hồi qua email
          <span className="font-semibold"> trong vòng 24 giờ làm việc</span>.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-green-600"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Ho ten */}
      <Field
        label="Họ và tên"
        required
        error={fieldError('name')}
        htmlFor="contact-name"
      >
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
          aria-invalid={!!fieldError('name')}
          className={inputClass(!!fieldError('name'))}
        />
      </Field>

      {/* Email + Phone (2 col) */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          required
          error={fieldError('email')}
          htmlFor="contact-email"
        >
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="email@example.com"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            aria-invalid={!!fieldError('email')}
            className={inputClass(!!fieldError('email'))}
          />
        </Field>

        <Field
          label="Số điện thoại"
          error={fieldError('phone')}
          htmlFor="contact-phone"
          hint="Tùy chọn — để tư vấn viên gọi nhanh hơn"
        >
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0912345678"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            aria-invalid={!!fieldError('phone')}
            className={inputClass(!!fieldError('phone'))}
          />
        </Field>
      </div>

      {/* Chu de */}
      <Field
        label="Chủ đề"
        required
        htmlFor="contact-subject"
      >
        <select
          id="contact-subject"
          value={values.subject}
          onChange={(e) => onChange('subject', e.target.value as Subject)}
          onBlur={() => onBlur('subject')}
          className={inputClass(false)}
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Noi dung */}
      <Field
        label="Nội dung"
        required
        error={fieldError('message')}
        htmlFor="contact-message"
        hint={`${values.message.length}/1000`}
      >
        <textarea
          id="contact-message"
          rows={5}
          maxLength={1000}
          placeholder="Chia sẻ câu hỏi, nhu cầu hoặc vấn đề bạn đang gặp..."
          value={values.message}
          onChange={(e) => onChange('message', e.target.value)}
          onBlur={() => onBlur('message')}
          aria-invalid={!!fieldError('message')}
          className={`${inputClass(!!fieldError('message'))} resize-y`}
        />
      </Field>

      {/* Consent */}
      <label className="flex items-start gap-3 text-theme-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.newsletter}
          onChange={(e) => onChange('newsletter', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-jade-600 focus:ring-jade-500"
        />
        <span>
          Tôi đồng ý nhận bản tin và cập nhật từ RealtyHub.
          <span className="ml-1 text-gray-500">(Tùy chọn, có thể hủy bất cứ lúc nào)</span>
        </span>
      </label>

      {/* Submit status */}
      {status === 'error' && Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-4 py-3 text-theme-sm text-rose-700">
          <FiAlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Vui lòng kiểm tra lại các trường được đánh dấu đỏ.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-jade-500 px-6 py-3.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-jade-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === 'submitting' ? (
          <>
            <FiLoader aria-hidden className="h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <FiSend aria-hidden className="h-4 w-4" />
            Gửi liên hệ
          </>
        )}
      </button>
    </form>
  );
};

// ============================================================================
// Helpers
// ============================================================================

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
      : 'border-gray-200 focus:border-jade-500 focus:ring-jade-200'
  }`;

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
};

const Field = ({ label, required, error, hint, htmlFor, children }: FieldProps) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label htmlFor={htmlFor} className="text-theme-sm font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {hint && <span className="text-theme-xs text-gray-500">{hint}</span>}
    </div>
    {children}
    {error && (
      <p className="mt-1.5 flex items-center gap-1 text-theme-xs text-rose-600">
        <FiAlertCircle aria-hidden className="h-3.5 w-3.5" />
        {error}
      </p>
    )}
  </div>
);

export default ContactForm;