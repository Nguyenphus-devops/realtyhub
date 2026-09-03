"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { authApi, getAuthErrorMessage } from "@/auth/auth-api";

const MIN_PASSWORD_LENGTH = 6;

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hash = useMemo(() => searchParams.get("hash")?.trim() ?? "", [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hash) {
      toast.error(
        "Thiếu mã xác thực đặt lại mật khẩu."
      );
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(
        "Mật khẩu phải có ít nhất 6 ký tự."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Mật khẩu xác nhận không khớp."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        hash,
        password,
      });
      toast.success(
        "Đặt lại mật khẩu thành công."
      );
      router.push("/login");
    } catch (error: unknown) {
      toast.error(
        getAuthErrorMessage(
          error,
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {!hash ? (
          <div className="space-y-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>
              Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu mã xác nhận.
            </p>
            <Link href="/forgot-password" className="font-medium underline">
              Gửi yêu cầu đặt lại mật khẩu
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-gray-700">
                Mật khẩu mới
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm text-gray-700"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Đang cập nhật..."
                : "Cập nhật mật khẩu"
              }
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
