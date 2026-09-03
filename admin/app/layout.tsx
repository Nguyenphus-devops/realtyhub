import { Outfit } from 'next/font/google';
import './globals.css';
import "./flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import QueryProvider from '@/common/providers/QueryProvider';
import AdminGuard from '@/context/AdminGuard';
import { AuthProvider, AuthUser } from '@/context/AuthContext';
import { PermissionsProvider } from '@/context/PermissionsContext';
import { API_URL_CLIENT } from "@/config/apiRoutes";
import { cookies } from 'next/headers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const outfit = Outfit({
  subsets: ["latin"],
});

const normalizeServerUser = (serverUser: {
  id: number | string;
  email: string;
  fullName?: string | null;
  status?: string;
  role?: string;
}): AuthUser => {
  return {
    id: String(serverUser.id),
    email: serverUser.email,
    role: (serverUser.role as AuthUser['role']) ?? "user",
    permissions: [],
    fullName: serverUser.fullName ?? serverUser.email,
  };
};

const fetchUserOnServer = async (
  accessToken: string,
): Promise<AuthUser | null> => {
  if (!API_URL_CLIENT) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL_CLIENT}/auth/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        Cookie: `token=${accessToken}`, // Gửi cookie trong header
      },
      credentials: "include", // Quan trọng: gửi cookies
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: {
        id?: number | string;
        email?: string;
        fullName?: string | null;
        status?: string;
        role?: string;
      };
    };

    const data = payload.data;

    if (!data?.id || !data.email) {
      return null;
    }

    const normalizedStatus = (data.status ?? "").toLowerCase();
    if (normalizedStatus && normalizedStatus !== "active") {
      return null;
    }

    return normalizeServerUser({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      status: data.status,
      role: data.role,
    });
  } catch {
    return null;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  // Đọc cookies từ backend (backend set 'token' và 'refreshToken')
  const accessToken = cookieStore.get("token")?.value ?? null;
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

  const initialUser = accessToken ? await fetchUserOnServer(accessToken) : null;

  return (
    <html lang="vi">
      <body className={`${outfit.className}`}>
        <AuthProvider
          initialUser={initialUser}
          initialAccessToken={accessToken}
          initialRefreshToken={refreshToken}
        >
          <PermissionsProvider>
            <AdminGuard>
              <QueryProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </QueryProvider>
            </AdminGuard>
          </PermissionsProvider>
        </AuthProvider>
        <ToastContainer theme="light" position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
