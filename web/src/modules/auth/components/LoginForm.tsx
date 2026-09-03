'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield, FiUser } from 'react-icons/fi';

import { type CurrentUser } from '@/common/auth/userStore';

const STORAGE_KEY = 'user';

/**
 * Form dang nhap mock - web chua noi backend that, nen submit chi luu user
 * vao localStorage roi redirect. Quick-pick 2 tai khoan mau (USER/ADMIN)
 * de demo nhanh: bam nut -> user duoc luu -> redirect /.
 *
 * Khi noi backend that, sua `submitMockLogin` thanh call API.
 */

const DEMO_ACCOUNTS: { role: CurrentUser['role']; user: CurrentUser; label: string }[] = [
  {
    role: 'USER',
    label: 'Vào với tài khoản USER',
    user: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'USER',
    },
  },
  {
    role: 'ADMIN',
    label: 'Vào với tài khoản ADMIN',
    user: {
      name: 'Trần Thị B (Quản trị)',
      email: 'tranthib@admin.example.com',
      role: 'ADMIN',
    },
  },
];

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState<CurrentUser['role'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const persistAndRedirect = (user: CurrentUser) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('user:change'));
    router.push('/');
    router.refresh();
  };

  /** Submit thu cong - mock: bat ky email nao co dang email cung duoc, password
      it nhat 6 ky tu. Sau nay noi backend that, doi thanh POST /auth/login. */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Email không hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    const name = trimmedEmail.split('@')[0]?.replace(/[._-]+/g, ' ') ?? 'Người dùng';
    persistAndRedirect({
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
      email: trimmedEmail,
      role: 'USER',
    });
  };

  /** Quick pick: bam nut role USER/ADMIN -> luu ngay khong qua form. */
  const quickPick = (account: CurrentUser) => {
    setError(null);
    setPending(account.role);
    // Gia lap loading nho de UX co cam giac "dang dang nhap".
    window.setTimeout(() => persistAndRedirect(account), 280);
  };

  return (
    <div className="w-full max-w-md">
      {/* Quick pick cards - 2 nut lon de demo nhanh, dat ngay dau form */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((acc) => {
          const isAdmin = acc.role === 'ADMIN';
          return (
            <button
              key={acc.role}
              type="button"
              onClick={() => quickPick(acc.user)}
              disabled={pending !== null}
              className={`group flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-theme-xs font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
                isAdmin
                  ? 'border-navy-700 bg-navy-700 text-white hover:bg-navy-800'
                  : 'border-brand-500 bg-brand-50 text-brand-700 hover:bg-brand-100'
              }`}
            >
              {isAdmin ? (
                <FiShield aria-hidden className="text-base" />
              ) : (
                <FiUser aria-hidden className="text-base" />
              )}
              <span className="leading-tight text-left">
                {pending === acc.role ? 'Đang vào...' : acc.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative my-5 flex items-center text-theme-xs text-gray-400">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-3 uppercase tracking-wider">Hoặc đăng nhập thủ công</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-theme-xs font-semibold text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <FiMail
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-theme-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-theme-xs font-semibold text-gray-700"
            >
              Mật khẩu
            </label>
            <Link
              href="/quen-mat-khau"
              className="text-theme-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <FiLock
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-theme-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff aria-hidden /> : <FiEye aria-hidden />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-error-500/30 bg-error-50 px-3 py-2 text-theme-xs font-medium text-error-600"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending !== null}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-theme-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-wait disabled:opacity-60"
        >
          Đăng nhập
        </button>
      </form>

      <p className="mt-5 text-center text-theme-xs text-gray-500">
        Chưa có tài khoản?{' '}
        <Link
          href="/dang-ky"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;