'use client';

import { useRef, useState, type FormEvent } from 'react';

import {
  FiAlertCircle,
  FiCheckCircle,
  FiImage,
  FiLoader,
  FiSend,
  FiTrash2,
} from 'react-icons/fi';

import {
  FEEDBACK_CATEGORY_ICONS,
  FEEDBACK_CATEGORY_LABELS,
  type FeedbackCategory,
  type FeedbackRating,
} from '@/modules/feedback/mocks/feedback.mock';

/**
 * Form gop y & phan hoi - client component.
 *
 * Fields (5 + 2 toggles + screenshot):
 *   - Rating (1-3 emoji: pos / neu / neg) - required
 *   - Category (select, 6 chuyen muc) - required
 *   - Title (text, <= 80 ky tu) - required
 *   - Content (textarea, 10-1000 ky tu) - required
 *   - Name (optional, mac dinh "An danh" neu khong nhap)
 *   - Anonymous toggle (mac dinh false)
 *   - Contact-back consent (mac dinh false)
 *   - Screenshot (optional, chi nhan 1 file, <= 5MB, png/jpg/webp)
 *
 * Khi co backend (POST /feedback multipart):
 *   - Thay setTimeout bang fetch voi FormData
 *   - Upload file qua existing /images endpoint (xem admin-module skill)
 */

type FormValues = {
  rating: FeedbackRating | null;
  category: FeedbackCategory;
  title: string;
  content: string;
  name: string;
  isAnonymous: boolean;
  contactBack: boolean;
};

const EMPTY_VALUES: FormValues = {
  rating: null,
  category: 'tinh-nang',
  title: '',
  content: '',
  name: '',
  isAnonymous: false,
  contactBack: false,
};

const TITLE_MAX = 80;
const CONTENT_MAX = 1000;
const FILE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MIME = ['image/png', 'image/jpeg', 'image/webp'];

const RATING_OPTIONS: Array<{
  id: FeedbackRating;
  emoji: string;
  label: string;
  desc: string;
}> = [
  { id: 'pos', emoji: '👍', label: 'Hài lòng', desc: 'Trải nghiệm tốt, muốn ủng hộ tiếp' },
  { id: 'neu', emoji: '😐', label: 'Tạm được', desc: 'Có điểm tốt nhưng cần cải thiện' },
  { id: 'neg', emoji: '👎', label: 'Cần cải thiện', desc: 'Có vấn đề gây khó chịu' },
];

const CATEGORY_OPTIONS: FeedbackCategory[] = [
  'tinh-nang',
  'ui-ux',
  'hieu-nang',
  'noi-dung',
  'dich-vu',
  'khac',
];

// ============================================================================
// Validation
// ============================================================================

const validate = (v: FormValues, hasFile: boolean): Partial<Record<keyof FormValues | 'file', string>> => {
  const errors: Partial<Record<keyof FormValues | 'file', string>> = {};
  if (!v.rating) errors.rating = 'Vui lòng chọn mức độ hài lòng.';
  if (!v.title.trim()) errors.title = 'Vui lòng nhập tiêu đề.';
  else if (v.title.length > TITLE_MAX) errors.title = `Tiêu đề tối đa ${TITLE_MAX} ký tự.`;
  if (!v.content.trim()) errors.content = 'Vui lòng nhập nội dung.';
  else if (v.content.length < 10) errors.content = 'Nội dung cần ít nhất 10 ký tự.';
  else if (v.content.length > CONTENT_MAX) errors.content = `Nội dung tối đa ${CONTENT_MAX} ký tự.`;
  if (!v.isAnonymous && !v.name.trim()) errors.name = 'Nhập tên hoặc bật "Gửi ẩn danh".';
  if (hasFile) errors.file = 'File không hợp lệ.';
  return errors;
};

// ============================================================================
// Component
// ============================================================================

const FeedbackForm = () => {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues | 'file', string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedId, setSubmittedId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const onBlur = (key: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(values, !!screenshot));
  };

  const onFile = (file: File | null) => {
    if (!file) return;
    if (!ACCEPTED_MIME.includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: 'Chỉ hỗ trợ PNG, JPG, WEBP.' }));
      return;
    }
    if (file.size > FILE_MAX_BYTES) {
      setErrors((prev) => ({ ...prev, file: 'Dung lượng tối đa 5MB.' }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeScreenshot = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshot(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allErrors = validate(values, !!screenshot);
    setErrors(allErrors);
    setTouched({
      rating: true,
      category: true,
      title: true,
      content: true,
      name: true,
      isAnonymous: true,
      contactBack: true,
    });

    if (Object.keys(allErrors).length > 0) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    // Gia lap POST /feedback
    setTimeout(() => {
      setStatus('success');
      // Generate ID khi submit (khong goi Math.random trong JSX -> purity loi)
      setSubmittedId(`FB-${Math.floor(Math.random() * 9000) + 1000}`);
      setValues(EMPTY_VALUES);
      setTouched({});
      removeScreenshot();
    }, 1500);
  };

  const fieldError = (key: keyof FormValues): string | undefined =>
    touched[key] ? errors[key] : undefined;

  // File error only show after user submits (no onBlur for file inputs)
  const visibleFileError = status === 'error' ? errors.file : undefined;

  // Success
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-8 text-center md:p-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-theme-sm">
          <FiCheckCircle aria-hidden className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-2xl font-bold text-gray-900">
          Gửi góp ý thành công
        </h3>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          Cảm ơn bạn đã dành thời gian chia sẻ. Đội ngũ RealtyHub sẽ xem xét và
          {values.contactBack
            ? ' phản hồi qua email trong 24 giờ làm việc.'
            : ' cập nhật tiến độ xử lý trên bảng tin công khai.'}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-theme-xs font-semibold uppercase tracking-[0.18em] text-gray-700 shadow-theme-xs">
          Mã góp ý của bạn: {submittedId}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-orange-600"
        >
          Gửi góp ý khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {/* ============ Rating (3 emoji cards) ============ */}
      <fieldset>
        <legend className="mb-3 text-theme-sm font-semibold text-gray-800">
          Bạn cảm thấy thế nào về RealtyHub?
          <span className="ml-1 text-rose-500">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {RATING_OPTIONS.map((opt) => {
            const isActive = values.rating === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange('rating', opt.id);
                  setTouched((prev) => ({ ...prev, rating: true }));
                }}
                className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition ${
                  isActive
                    ? 'border-orange-500 bg-orange-50 shadow-theme-xs'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {opt.emoji}
                </span>
                <span
                  className={`mt-1 text-sm font-bold ${
                    isActive ? 'text-orange-700' : 'text-gray-900'
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-theme-xs text-gray-600">{opt.desc}</span>
              </button>
            );
          })}
        </div>
        {fieldError('rating') && (
          <p className="mt-2 flex items-center gap-1 text-theme-xs text-rose-600">
            <FiAlertCircle aria-hidden className="h-3.5 w-3.5" />
            {fieldError('rating')}
          </p>
        )}
      </fieldset>

      {/* ============ Category + Title ============ */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Chuyên mục" required htmlFor="fb-category">
          <select
            id="fb-category"
            value={values.category}
            onChange={(e) => onChange('category', e.target.value as FeedbackCategory)}
            className={inputClass(false)}
          >
            {CATEGORY_OPTIONS.map((id) => (
              <option key={id} value={id}>
                {FEEDBACK_CATEGORY_ICONS[id]} {FEEDBACK_CATEGORY_LABELS[id]}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Tiêu đề"
            required
            error={fieldError('title')}
            htmlFor="fb-title"
            hint={`${values.title.length}/${TITLE_MAX}`}
          >
            <input
              id="fb-title"
              type="text"
              maxLength={TITLE_MAX}
              placeholder="Tóm tắt gọn ý chính (VD: 'Bản đồ lag trên Safari')"
              value={values.title}
              onChange={(e) => onChange('title', e.target.value)}
              onBlur={() => onBlur('title')}
              aria-invalid={!!fieldError('title')}
              className={inputClass(!!fieldError('title'))}
            />
          </Field>
        </div>
      </div>

      {/* ============ Content ============ */}
      <Field
        label="Nội dung chi tiết"
        required
        error={fieldError('content')}
        htmlFor="fb-content"
        hint={`${values.content.length}/${CONTENT_MAX}`}
      >
        <textarea
          id="fb-content"
          rows={5}
          maxLength={CONTENT_MAX}
          placeholder="Mô tả chi tiết: bạn gặp vấn đề gì, khi nào, thiết bị/trình duyệt nào, bạn mong muốn điều gì..."
          value={values.content}
          onChange={(e) => onChange('content', e.target.value)}
          onBlur={() => onBlur('content')}
          aria-invalid={!!fieldError('content')}
          className={`${inputClass(!!fieldError('content'))} resize-y`}
        />
      </Field>

      {/* ============ Screenshot upload ============ */}
      <Field
        label="Ảnh minh hoạ"
        hint="Tùy chọn · PNG, JPG, WEBP · tối đa 5MB"
        htmlFor="fb-screenshot"
        error={visibleFileError}
      >
        {previewUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Xem trước ảnh đính kèm"
              className="mx-auto block max-h-64 rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={removeScreenshot}
              aria-label="Xoá ảnh"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-theme-sm transition hover:bg-rose-50 hover:text-rose-600"
            >
              <FiTrash2 aria-hidden className="h-4 w-4" />
            </button>
            <div className="mt-2 px-2 pb-1 text-theme-xs text-gray-500">
              {screenshot?.name} · {((screenshot?.size ?? 0) / 1024).toFixed(0)} KB
            </div>
          </div>
        ) : (
          <label
            htmlFor="fb-screenshot"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-6 py-10 text-center transition hover:border-orange-400 hover:bg-orange-50/30"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 shadow-theme-xs">
              <FiImage aria-hidden className="h-6 w-6" />
            </span>
            <span className="text-theme-sm font-semibold text-gray-800">
              Kéo thả hoặc nhấn để chọn ảnh
            </span>
            <span className="text-theme-xs text-gray-500">
              Giúp team hiểu nhanh vấn đề hơn
            </span>
            <input
              ref={fileInputRef}
              id="fb-screenshot"
              type="file"
              accept={ACCEPTED_MIME.join(',')}
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </Field>

      {/* ============ Name + Anonymous ============ */}
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
        <div className="flex items-start justify-between gap-3">
          <label
            htmlFor="fb-anonymous"
            className="flex flex-1 cursor-pointer items-start gap-3"
          >
            <input
              id="fb-anonymous"
              type="checkbox"
              checked={values.isAnonymous}
              onChange={(e) => onChange('isAnonymous', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            <span>
              <span className="block text-theme-sm font-semibold text-gray-800">
                Gửi ẩn danh
              </span>
              <span className="mt-0.5 block text-theme-xs text-gray-600">
                Tên bạn sẽ không hiển thị trên bảng tin công khai
              </span>
            </span>
          </label>
        </div>

        {!values.isAnonymous && (
          <Field
            label="Tên hiển thị"
            required={!values.isAnonymous}
            error={fieldError('name')}
            htmlFor="fb-name"
            hint="Có thể dùng biệt danh"
          >
            <input
              id="fb-name"
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={values.name}
              onChange={(e) => onChange('name', e.target.value)}
              onBlur={() => onBlur('name')}
              aria-invalid={!!fieldError('name')}
              className={inputClass(!!fieldError('name'))}
            />
          </Field>
        )}
      </div>

      {/* ============ Consent ============ */}
      <label className="flex items-start gap-3 text-theme-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.contactBack}
          onChange={(e) => onChange('contactBack', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
        />
        <span>
          Cho phép đội ngũ RealtyHub liên hệ lại qua email nếu cần thêm thông tin.
          <span className="ml-1 text-gray-500">(Tùy chọn)</span>
        </span>
      </label>

      {/* Error banner */}
      {status === 'error' && Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-4 py-3 text-theme-sm text-rose-700">
          <FiAlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Vui lòng kiểm tra lại các trường được đánh dấu đỏ.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-theme-sm font-semibold text-white shadow-theme-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === 'submitting' ? (
          <>
            <FiLoader aria-hidden className="h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <FiSend aria-hidden className="h-4 w-4" />
            Gửi góp ý
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
      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
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

export default FeedbackForm;