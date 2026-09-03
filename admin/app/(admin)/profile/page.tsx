"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/config/api";
import { apiRoutes } from "@/config/apiRoutes";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, token, verifyToken } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[#7a6050]">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Họ và tên không được để trống.");
      return;
    }

    if (password) {
      if (password.length < 6) {
        toast.error("Mật khẩu mới phải từ 6 ký tự trở lên.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Xác nhận mật khẩu mới không khớp.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        fullName: fullName.trim(),
      };

      if (password) {
        payload.password = password;
      }

      await api.patch(apiRoutes.USERS.UPDATE(user.id), payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      // Refetch user profile details globally
      await verifyToken(token || undefined);

      toast.success("Cập nhật thông tin tài khoản thành công!");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("[Profile] Update error:", error);
      const errMsg =
        error?.response?.data?.message || "Không thể cập nhật thông tin tài khoản.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl py-6 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="rounded-[28px] border border-[#eadfd8] bg-gradient-to-br from-[#fffaf5] via-white to-[#fff3ea] p-6 shadow-[0_18px_60px_rgba(61,32,16,0.08)]">
        <h1 className="text-xl font-bold tracking-tight text-[#3d2010]">
          Hồ sơ cá nhân
        </h1>
        <p className="text-sm text-[#7a6050] mt-1">
          Chỉnh sửa thông tin cá nhân và thay đổi mật khẩu quản trị của bạn.
        </p>
      </section>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-[#eadfd8] bg-white p-8 shadow-[0_18px_60px_rgba(61,32,16,0.08)] space-y-5"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">
            Địa chỉ Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-gray-150 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            Email đăng nhập cố định, không thể tự thay đổi.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên của bạn"
            className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-2.5 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:ring-2 focus:ring-[#c04040]/10"
            required
          />
        </div>

        <hr className="border-gray-100 my-2" />

        <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Thay đổi mật khẩu (Tùy chọn)
          </h3>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới (nếu muốn đổi)"
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-2.5 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:ring-2 focus:ring-[#c04040]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#3d2010]">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-2.5 text-sm text-[#3d2010] outline-none transition focus:border-[#c04040] focus:ring-2 focus:ring-[#c04040]/10"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-500 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
