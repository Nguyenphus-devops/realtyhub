"use client";

import { useState } from "react";
import type React from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";
import { authApi, getAuthErrorMessage } from "@/auth/auth-api";
import {
  FiEye as Eye,
  FiEyeOff as EyeOff,
  FiLock as Lock,
  FiMail as Mail,
} from "react-icons/fi";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login: authLogin } = useAuth();

  const handleGoogleLogin = () => {

  }

  const handleEmailBlur = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setEmailHint("");
      return;
    }

    setIsCheckingEmail(true);
    try {
      const isAvailable = await authApi.checkEmail(normalizedEmail);
      setEmailHint(isAvailable ? "Email này chưa được đăng ký trong hệ thống." : "");
    } catch {
      setEmailHint("");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setEmailError("");
    setPasswordError("");
    setIsLoggingIn(true);
    try {
      const response = await authApi.login({ email: normalizedEmail, password });
      await authLogin(response.token, response.refreshToken);
      toast.success("Đăng nhập thành công!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data as { errors?: Record<string, string> } | undefined;
        const backendErrors = payload?.errors;

        if (backendErrors?.email === "notFound") {
          setEmailError("Email chưa được đăng ký.");
        } else if (backendErrors?.email === "emailNotExists") {
          setEmailError("Email không tồn tại trong hệ thống.");
        } else if (backendErrors?.email === "inactive") {
          setEmailError("Tài khoản chưa kích hoạt. Vui lòng xác nhận email.");
        } else if (backendErrors?.password === "incorrectPassword") {
          setPasswordError("Mật khẩu hoặc email không chính xác.");
        } else {
          toast.error(getAuthErrorMessage(error, "Đăng nhập thất bại, vui lòng kiểm tra lại."));
        }
      } else {
        toast.error("Đăng nhập thất bại, vui lòng kiểm tra lại.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4 py-8 overflow-hidden">

      {/* 🔴 BACKGROUND BLUR LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#17203a_0%,rgba(10,10,10,0.2)_50%,#0a0a0a_80%)]" />
        <div className="absolute -left-16 bottom-0 h-96 w-96 rounded-full bg-blue-500/[0.02] blur-[120px]" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-indigo-500/[0.02] blur-[120px]" />
      </div>

      {/* 🔴 CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden">


        {/* Logo */}
        <div className="flex justify-center pt-2">
          <Image
            src="/images/logo/logo0.png"
            alt="GYM & DANCE"
            width={140}
            height={140}
            className="h-auto w-[110px] sm:w-[130px]"
            priority
          />
        </div>

        {/* Tiêu đề Đăng nhập */}
        <div className="mt-5 text-center">
          <h2 className="text-lg font-bold tracking-widest text-white uppercase">ĐĂNG NHẬP</h2>
          <p className="mt-1 text-[11px] text-white/40">Vui lòng đăng nhập tài khoản quản trị</p>
        </div>

        {/* FORM ĐĂNG NHẬP */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Ô nhập Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailHint) setEmailHint("");
                if (emailError) setEmailError("");
              }}
              onBlur={handleEmailBlur}
              required
              className="peer dark-autofill w-full rounded-xl border border-white/5 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-white/20 focus:bg-white/[0.06]"
            />
            <div className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10 ${email ? "text-white/70" : "text-white/30"} peer-focus:text-white/70`}>
              <Mail className="h-4 w-4" />
            </div>
            {isCheckingEmail && <p className="absolute -bottom-4 left-2 text-[10px] text-white/40">Đang xác thực email...</p>}
            {!isCheckingEmail && (emailError || emailHint) && <p className="absolute -bottom-4 left-2 text-[10px] text-red-400 font-medium">{emailError || emailHint}</p>}
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="relative pt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              required
              className="peer dark-autofill w-full rounded-xl border border-white/5 bg-white/[0.04] py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-white/20 focus:bg-white/[0.06]"
            />
            <div className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10 ${password ? "text-white/70" : "text-white/30"} peer-focus:text-white/70`}>
              <Lock className="h-4 w-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60 z-10"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {passwordError && (
              <p className="absolute -bottom-4 left-2 text-[10px] text-red-400 font-medium">
                {passwordError}
              </p>
            )}
          </div>

          {/* Ghi nhớ & Quên mật khẩu */}
          <div className="flex items-center justify-between gap-4 text-xs pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-white/40 select-none hover:text-white/60 transition">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/10 bg-transparent text-white focus:ring-0 focus:ring-offset-0"
              />
              <span>Ghi nhớ mật khẩu</span>
            </label>
            <Link href="/forgot-password" className="text-white/40 transition hover:text-white/70">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút Submit chính */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-xl bg-white py-3 text-xs font-bold   tracking-widest text-[#111116] transition hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isLoggingIn ? "Đang xác thực..." : "Tiếp tục"}
          </button>
        </form>

        {/* Thanh chia HOẶC */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5" />
          {/* <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">HOẶC TIẾP TỤC VỚI</span> */}
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Nút Đăng nhập với Google */}
        {/* <button
          onClick={handleGoogleLogin}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/[0.06] hover:border-white/10"
        >
          <Image src="/google-icon.svg" alt="Google" className="h-4 w-4" width={16} height={16} />
          Đăng nhập bằng Google
        </button> */}

      </div>
    </div>
  );
};

export default LoginForm;
