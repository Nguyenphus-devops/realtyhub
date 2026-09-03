'use client';

import { useState } from 'react';
import { FiCheckCircle, FiPhone, FiSend } from 'react-icons/fi';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Form dang ky tu van o cuoi trang chu.
 *
 * Hien tai: client-only mock (submit hien thong bao thanh cong sau 600ms).
 * Khi backend co endpoint /leads: thay handleSubmit bang axios.post voi
 * apiRoutes.LEADS.CREATE, khong sua markup.
 *
 * Loi duoc hien inline canh tung truong de khong phu thuoc react-hook-form
 * (chi la mot form nho).
 */
const ConsultForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Vui lòng nhập họ và tên.';
    if (!phone.trim()) nextErrors.phone = 'Vui lòng nhập số điện thoại.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      // TODO(backend): thay bang axios.post(apiRoutes.LEADS.CREATE(), payload)
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus('success');
      setName('');
      setPhone('');
      setNote('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="bg-linear-to-br from-navy-700 via-navy-700 to-brand-700 py-8 md:py-12">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <p className="mb-2 text-theme-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              Đăng ký tư vấn
            </p>
            <h2 className="text-2xl font-bold uppercase leading-tight tracking-wide md:text-3xl">
              Để chuyên viên gọi lại trong 30 phút
            </h2>
            <p className="mt-3 max-w-md text-theme-sm leading-relaxed text-white/80">
              Để lại thông tin, đội ngũ RealtyHub sẽ liên hệ tư vấn miễn phí về
              dự án, pháp lý và phương án tài chính phù hợp với bạn.
            </p>

            <ul className="mt-6 space-y-3 text-theme-sm text-white/90">
              <li className="flex items-center gap-2.5">
                <FiCheckCircle aria-hidden className="text-gold-300" />
                Tư vấn 1-1 hoàn toàn miễn phí.
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheckCircle aria-hidden className="text-gold-300" />
                Không chia sẻ thông tin cho bên thứ ba.
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheckCircle aria-hidden className="text-gold-300" />
                Đồng hành đến khi ký hợp đồng mua bán.
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-theme-xs font-semibold text-white backdrop-blur-sm">
              <FiPhone aria-hidden />
              Hotline: 024 7100 0000
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl bg-white p-6 shadow-card md:p-8"
            aria-label="Đăng ký tư vấn miễn phí"
          >
            <h3 className="mb-1 text-lg font-bold text-gray-900">
              Đăng ký nhận tư vấn
            </h3>
            <p className="mb-5 text-theme-sm text-gray-500">
              Chỉ mất 30 giây để điền thông tin.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="consult-name"
                  className="mb-1.5 block text-theme-sm font-medium text-gray-700"
                >
                  Họ và tên <span className="text-error-500">*</span>
                </label>
                <input
                  id="consult-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'consult-name-err' : undefined}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-brand-400 focus:shadow-focus-ring"
                />
                {errors.name && (
                  <p
                    id="consult-name-err"
                    className="mt-1 text-theme-xs text-error-500"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="consult-phone"
                  className="mb-1.5 block text-theme-sm font-medium text-gray-700"
                >
                  Số điện thoại <span className="text-error-500">*</span>
                </label>
                <input
                  id="consult-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="0901 234 567"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'consult-phone-err' : undefined}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-brand-400 focus:shadow-focus-ring"
                />
                {errors.phone && (
                  <p
                    id="consult-phone-err"
                    className="mt-1 text-theme-xs text-error-500"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="consult-note"
                  className="mb-1.5 block text-theme-sm font-medium text-gray-700"
                >
                  Ghi chú <span className="text-gray-400">(tuỳ chọn)</span>
                </label>
                <textarea
                  id="consult-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Bạn quan tâm dự án nào, khu vực nào..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-brand-400 focus:shadow-focus-ring"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-theme-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend aria-hidden />
                {status === 'submitting' ? 'Đang gửi...' : 'Gửi đăng ký'}
              </button>

              {status === 'success' && (
                <p
                  role="status"
                  className="flex items-center gap-1.5 rounded-lg bg-success-50 px-3 py-2 text-theme-sm text-success-600"
                >
                  <FiCheckCircle aria-hidden />
                  Đã gửi! Chuyên viên sẽ liên hệ bạn trong ít phút.
                </p>
              )}
              {status === 'error' && (
                <p
                  role="alert"
                  className="rounded-lg bg-error-50 px-3 py-2 text-theme-sm text-error-600"
                >
                  Có lỗi xảy ra, vui lòng thử lại sau.
                </p>
              )}
            </div>

            {/* Nho nho o footer form de tang them uy tin */}
            <p className="mt-4 text-theme-xs text-gray-500">
              Đã có hàng nghìn khách hàng tin tưởng sử dụng dịch vụ.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsultForm;
