"use client";

import React, { useState, useEffect } from "react";
import { AdminUserService } from "../services/user.service";
import { RolesService } from "@/modules/role/services/roles.service";
import { Role } from "@/modules/permission/types/permissions";
import { AdminUserRole } from "../models/user.model";
import { toast } from "react-toastify";
import validator from "validator";

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDbRoleId, setSelectedDbRoleId] = useState<string>("");


  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rolesError, setRolesError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    RolesService.findAll({ page: "1", limit: "100" })
      .then((res) => {
        if (res?.data) {
          setRoles(res.data);
          const defaultRole = res.data.find((r) => r.name === "user");
          if (defaultRole) {
            setSelectedDbRoleId(defaultRole.id);
          }
        }
        else setRolesError("Không thể tải danh sách vai trò");
      })
      .catch(() => {
        setRolesError("Lỗi kết nối khi tải vai trò");
      });
  }, []);

  const validate = (): boolean => {
    let ok = true;
    if (!email) { setEmailError("Vui lòng nhập email."); ok = false; }
    else if (!validator.isEmail(email)) { setEmailError("Email không hợp lệ."); ok = false; }
    else setEmailError("");

    if (!fullName.trim()) { setFullNameError("Vui lòng nhập họ và tên."); ok = false; }
    else setFullNameError("");

    if (!password) { setPasswordError("Vui lòng nhập mật khẩu."); ok = false; }
    else if (password.length < 6) { setPasswordError("Mật khẩu phải có ít nhất 6 ký tự."); ok = false; }
    else setPasswordError("");

    if (!selectedDbRoleId) {
      setRolesError("Vui lòng chọn vai trò.");
      ok = false;
    } else {
      setRolesError("");
    }

    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setLoading(true);

    const chosenRoleObj = roles.find((r) => r.id === selectedDbRoleId);
    let finalSystemRole: AdminUserRole = "user";
    if (chosenRoleObj) {
      const nameLower = chosenRoleObj.name.toLowerCase();
      if (nameLower === "admin" || nameLower.includes("admin")) {
        finalSystemRole = "admin";
      } else if (nameLower === "user" || nameLower === "customer" || nameLower.includes("khách hàng")) {
        finalSystemRole = "user";
      } else {
        finalSystemRole = "staff";
      }
    }

    try {
      await AdminUserService.create({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        password,
        role: finalSystemRole,
        roleId: selectedDbRoleId,
      });
      toast.success("Thêm người dùng mới thành công!");
      await onSuccess();
      onClose();
    } catch (error: unknown) {
      const ax = error as { response?: { data?: { message?: string | string[]; errors?: Record<string, string> } } };
      const msg = ax.response?.data?.message;
      const errs = ax.response?.data?.errors;
      let errText = "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (msg) errText = Array.isArray(msg) ? msg.join(", ") : msg;
      else if (errs) errText = Object.entries(errs).map(([k, v]) => `${k}: ${v}`).join("; ");
      else if (error instanceof Error) errText = error.message;

      if (errText === "User already exists") setEmailError("Email này đã tồn tại trên hệ thống.");
      else setGeneralError(errText);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all text-gray-900 ${err ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl relative text-gray-900">
        <button onClick={onClose} type="button"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold">
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Thêm người dùng mới</h2>
          <p className="text-sm text-gray-500 mt-1">Nhập thông tin để tạo tài khoản mới trên hệ thống.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{generalError}</div>
          )}

          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fullName} placeholder="Nguyễn Văn A"
              onChange={(e) => { setFullName(e.target.value); if (fullNameError) setFullNameError(""); }}
              className={inputCls(fullNameError)} />
            {fullNameError && <p className="text-xs text-red-500 mt-1">{fullNameError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <input type="text" value={email} placeholder="example@gmail.com"
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
              className={inputCls(emailError)} />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input type="password" value={password} placeholder="••••••••"
              onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }}
              className={inputCls(passwordError)} />
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* Vai trò */}
          {roles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select value={selectedDbRoleId}
                required
                onChange={(e) => {
                  setSelectedDbRoleId(e.target.value);
                  if (rolesError) setRolesError("");
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900">
                <option value="" disabled>-- Chọn vai trò --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name === "admin" ? "Admin (Quản trị viên)" : r.name === "user" ? "User (Khách hàng)" : r.name}
                    {r.description ? ` - ${r.description}` : ""}
                  </option>
                ))}
              </select>
              {rolesError && <p className="text-xs text-red-500 mt-1">{rolesError}</p>}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
              {loading ? "Đang xử lý..." : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
