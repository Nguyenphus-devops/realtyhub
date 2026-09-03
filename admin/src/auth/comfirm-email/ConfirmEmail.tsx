"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { authApi, getAuthErrorMessage } from "@/auth/auth-api";

const ComfirmEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const hash = useMemo(() => searchParams.get("hash")?.trim() ?? "", [searchParams]);

  const handleConfirmEmail = async () => {
    if (!hash) {
      toast.error("Thiếu mã xác thực email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.confirmEmail({ hash });
      setIsConfirmed(true);
      toast.success("Xác thực email thành công.");
      router.push("/login");
    } catch (error: unknown) {
      toast.error(
        getAuthErrorMessage(
          error,
          "Xác thực email thất bại. Đường dẫn xác thực không hợp lệ hoặc đã hết hạn."
        )
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
            Xác thực email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng xác thực email của bạn để kích hoạt tài khoản.
          </p>
        </div>

        {!hash ? (
          <div className="space-y-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>
              Đường dẫn xác thực không hợp lệ hoặc thiếu mã xác thực.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConfirmEmail}
            disabled={isSubmitting || isConfirmed}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Đang xác thực..."
              : isConfirmed
                ? "Đã xác thực"
                : "Xác thực email của tôi"}
          </button>
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

export default ComfirmEmail;
