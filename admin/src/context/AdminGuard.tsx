"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { toast } from "react-toastify";
interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const {
    isAuthenticated,
    isAuthReady,
    hasAdminAccess,
    user,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ["/login", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (isPublicPath || !isAuthReady) return;

    // AuthProvider is the single owner of session verification. The guard only
    // reacts to the completed result, avoiding duplicate verify/refresh loops.
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!hasAdminAccess()) {
      toast.error("Bạn không có quyền truy cập trang quản trị");
      router.replace("/login");
    }
  }, [
    isAuthReady,
    isAuthenticated,
    hasAdminAccess,
    router,
    pathname,
    user,
    isPublicPath,
  ]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  // Show loading spinner while auth is still initializing or permission check is in progress
  if (!isAuthReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-3 mx-auto"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasAdminAccess()) {
    return null;
  }

  if (pathname === "/") {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default AdminGuard;
