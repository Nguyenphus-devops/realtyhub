'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

import { FiCheckCircle } from 'react-icons/fi';

const ROLES = [
  { value: 'sales', label: 'Sales chính thức' },
  { value: 'ctv', label: 'Cộng tác viên (CTV)' },
];

const REGIONS = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Nha Trang',
  'Cần Thơ',
  'Phú Quốc',
  'Khu vực khác',
];

const PartnerSignupForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(ROLES[0].value);
  const [region, setRegion] = useState('');
  const [isSent, setIsSent] = useState(false);

  const canSubmit = name.trim().length > 0 && phone.trim().length >= 9;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    // Chua co backend - hien man cam on de demo tron luong
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-card-hover">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-jade-50 text-3xl text-jade-600">
          <FiCheckCircle aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-bold text-navy-800">Đã nhận thông tin</h3>
        <p className="mt-2 text-theme-sm leading-relaxed text-gray-600">
          Cảm ơn {name.trim()}. Đội ngũ Đông Tây Land sẽ liên hệ số {phone.trim()} trong
          giờ làm việc để xác nhận và tư vấn chi tiết.
        </p>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="mt-6 text-theme-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Gửi đăng ký khác
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-white p-6 shadow-card-hover md:p-8"
      aria-labelledby="partner-form-title"
    >
      <h3 id="partner-form-title" className="text-lg font-bold uppercase text-navy-800">
        Trở thành đối tác cùng Đông Tây Land
      </h3>
      <p className="mt-1 text-theme-sm text-gray-500">
        Tham gia mạng lưới môi giới và bắt đầu kinh doanh bền vững
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="partner-name"
            className="mb-1.5 block text-theme-sm font-semibold text-gray-800"
          >
            Họ và tên <span className="text-error-500">*</span>
          </label>
          <input
            id="partner-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nhập họ và tên"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-theme-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="partner-phone"
            className="mb-1.5 block text-theme-sm font-semibold text-gray-800"
          >
            Số điện thoại <span className="text-error-500">*</span>
          </label>
          <input
            id="partner-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Nhập số điện thoại"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-theme-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-theme-sm font-semibold text-gray-800">
            Bạn muốn tham gia với vai trò
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((item) => (
              <label
                key={item.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-theme-sm transition ${
                  role === item.value
                    ? 'border-brand-500 bg-brand-25 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="partner-role"
                  value={item.value}
                  checked={role === item.value}
                  onChange={() => setRole(item.value)}
                  className="accent-brand-500"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="partner-region"
            className="mb-1.5 block text-theme-sm font-semibold text-gray-800"
          >
            Khu vực hoạt động
          </label>
          <select
            id="partner-region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-theme-sm text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Chọn khu vực</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full rounded-lg bg-accent-500 px-5 py-3 text-theme-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Đăng ký tham gia ngay
      </button>

      <p className="mt-3 text-center text-theme-xs text-gray-500">
        Thông tin của bạn được bảo mật tuyệt đối.
      </p>
    </form>
  );
};

export default PartnerSignupForm;
