"use client"; // Required to use hooks in the App Router

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL_CLIENT, apiRoutes } from "@/config/apiRoutes";
import { Permission } from "@/modules/permission/types/permissions";
import api from "@/config/api";

// User roles
type UserRole = "user" | "admin" | "staff" | "super_admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  fullName?: string;
  avatar?: string;
}

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (token: string, refreshToken?: string) => Promise<void>;
  logout: () => void;
  hasAdminAccess: () => boolean;
  verifyToken: (storedToken?: string) => Promise<void>;
}

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  try {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));

    if (!cookie) {
      return null;
    }

    const value = cookie.substring(name.length + 1); // More reliable than split
    const decoded = decodeURIComponent(value);

    return decoded;
  } catch (error) {
    console.error(`[Auth] Error reading cookie '${name}':`, error);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_AUTH_PATHS = ["/login", "/forgot-password", "/reset-password"];

const shouldClearRefreshTokenFromError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const statusCode = error.response?.status;
  return statusCode === 401 || statusCode === 403;
};

type AuthProviderProps = {
  children: ReactNode;
  initialUser?: AuthUser | null;
  initialAccessToken?: string | null;
  initialRefreshToken?: string | null;
};

export const AuthProvider = ({
  children,
  initialUser = null,
  initialAccessToken = null,
  initialRefreshToken = null,
}: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(initialAccessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    initialRefreshToken
  );
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hasInitializedRef = useRef(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasWindow = typeof window !== "undefined";

  const clearAuthState = (options?: { keepRefreshToken?: boolean }) => {
    const keepRefreshToken = options?.keepRefreshToken ?? false;
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    if (!keepRefreshToken) {
      setRefreshToken(null);
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    // Clear localStorage since we're using it as a fallback
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      if (!keepRefreshToken) {
        localStorage.removeItem('refreshToken');
      }
    }
  };

  const logout = () => {
    clearAuthState();

    // Gọi API logout để backend clear cookies
    void api.post(apiRoutes.AUTH.LOGOUT)

    router.replace("/login");
  };

  const fetchMe = async (accessToken: string): Promise<AuthUser> => {
    const [userResponse, permissionsResponse] = await Promise.all([
      api.get(apiRoutes.AUTH.STATUS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      api.get(apiRoutes.AUTH.MY_PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(() => ({ data: { data: [] as Permission[] } })),
    ]);

    const serverUser = userResponse.data.data as {
      id: number | string;
      email: string;
      fullName?: string | null;
      status?: string;
      role?: UserRole;
    };

    if (!serverUser || !serverUser.id) {
      throw new Error("Invalid user payload");
    }

    const normalizedStatus = (serverUser.status ?? "").toLowerCase();
    if (normalizedStatus && normalizedStatus !== "active") {
      throw new Error("User is not active");
    }

    const permissionsBody = permissionsResponse.data as
      | Permission[]
      | { data?: Permission[] };
    const permissions = (
      Array.isArray(permissionsBody)
        ? permissionsBody
        : (permissionsBody?.data ?? [])
    ) as Permission[];

    return {
      id: String(serverUser.id),
      email: serverUser.email,
      role: serverUser.role ?? "user",
      permissions,
      fullName: serverUser.fullName ?? serverUser.email,
    };
  };

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      // Try to get refreshToken from state, cookie, or localStorage
      let storedRefreshToken = refreshToken || readCookie("refreshToken");
      
      // Fallback to localStorage
      if (!storedRefreshToken && typeof window !== 'undefined') {
        storedRefreshToken = localStorage.getItem('refreshToken');
      }

      if (!storedRefreshToken) {
        return false;
      }
      
      console.log('[Auth] Refresh attempt:', { 
        hasStateRefresh: Boolean(refreshToken), 
        hasCookieRefresh: Boolean(readCookie("refreshToken")),
        hasLocalStorageRefresh: typeof window !== 'undefined' ? Boolean(localStorage.getItem('refreshToken')) : false,
        sendingBody: Boolean(storedRefreshToken)
      });
      
      // Send refreshToken in body as fallback when cookie is not available
      const response = await api.post(
        apiRoutes.AUTH.REFRESH_TOKEN,
        { refreshToken: storedRefreshToken },
        { withCredentials: true }
      );

      const responseData = response.data.data as {
        token?: string;
        refreshToken?: string;
        tokenExpires?: number;
      };

      const newAccessToken = responseData?.token;
      const newRefreshToken = responseData?.refreshToken;

      if (!newAccessToken) {
        console.error("No access token in refresh response");
        return false;
      }

      // Backend đã tự động set cookies, chỉ cần update state
      setToken(newAccessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newAccessToken);
      }
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
      }

      const me = await fetchMe(newAccessToken);
      setUser(me);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to refresh token (axios):", {
          status: error.response?.status,
          data: error.response?.data.data,
          message: error.message,
          hasRefreshTokenCookie: Boolean(readCookie("refreshToken")),
        });
      } else {
        console.error("Failed to refresh token:", error);
      }

      if (shouldClearRefreshTokenFromError(error)) {
        clearAuthState();
      }

      return false;
    }
  }, []);

  const scheduleRefresh = useCallback(
    (accessToken: string) => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      try {
        const { exp } = jwtDecode<{ exp: number }>(accessToken);
        if (!exp) return;

        const expiresIn = exp * 1000 - Date.now();
        // Refresh at 80% of the token lifetime. A fixed "one minute before"
        // offset refreshes 15-second test tokens immediately and creates a
        // refresh loop.
        const refreshTime = Math.max(Math.floor(expiresIn * 0.8), 1_000);

        refreshTimeoutRef.current = setTimeout(() => {
          void refreshAccessToken();
        }, refreshTime);
      } catch (error) {
        console.error("Invalid token for scheduling refresh:", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshToken]
  );

  const verifyToken = useCallback(
    async (storedToken?: string): Promise<void> => {
      let tokenToVerify = storedToken ?? token ?? readCookie("token");

      // Fallback to localStorage if cookie token is not available
      if (!tokenToVerify && typeof window !== 'undefined') {
        tokenToVerify = localStorage.getItem('token');
      }

      // Nếu không có token → không thử refresh, chỉ clear auth state
      if (!tokenToVerify) {
        clearAuthState();
        return;
      }

      try {
        const me = await fetchMe(tokenToVerify);
        setToken(tokenToVerify);
        setUser(me);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);

        const statusCode = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;

        // Refresh only when the API explicitly rejects the access token.
        // A 404 indicates a wrong/missing endpoint and must not start a
        // verify -> refresh retry cycle.
        if (statusCode === 401 || statusCode === 403) {
          const refreshed = await refreshAccessToken();
          if (refreshed) return;
        }

        clearAuthState();
      }
    },
    [refreshAccessToken, clearAuthState, fetchMe, token]
  );


  // Init auth on mount (verify access token -> refresh if needed)
  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (!hasWindow) return;

    hasInitializedRef.current = true;

    const init = async () => {
      // Public authentication pages do not need session restoration. Skipping
      // it also prevents stale cookies/tokens from producing expected 401s
      // while the user is simply viewing the login or recovery forms.
      if (PUBLIC_AUTH_PATHS.includes(pathname)) {
        setIsAuthReady(true);
        return;
      }

      if (initialUser && initialAccessToken) {
        setToken(initialAccessToken);
        setRefreshToken(initialRefreshToken);

        // Fetch fresh user data with permissions instead of using stale initialUser
        try {
          const freshUser = await fetchMe(initialAccessToken);
          setUser(freshUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("[Auth] Failed to fetch fresh user data:", error);
          // Fallback to initialUser if fetch fails
          setUser(initialUser);
          setIsAuthenticated(true);
        }

        setIsAuthReady(true);
        return;
      }

      // Đọc token từ cookie (backend đã set)
      let storedToken = readCookie("token");
      let storedRefreshToken = readCookie("refreshToken");

      // Fallback to localStorage
      if (!storedToken && typeof window !== 'undefined') {
        storedToken = localStorage.getItem('token');
      }
      if (!storedRefreshToken && typeof window !== 'undefined') {
        storedRefreshToken = localStorage.getItem('refreshToken');
      }

      if (storedToken) setToken(storedToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);

      // verifyToken() already attempts refresh if needed.
      await verifyToken(storedToken ?? undefined);

      setIsAuthReady(true);
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      return;
    }

    scheduleRefresh(token);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [token, scheduleRefresh]);

  const login = async (newToken: string, newRefreshToken?: string) => {
    console.log('[Auth] Login called:', { 
      hasToken: Boolean(newToken), 
      hasRefreshToken: Boolean(newRefreshToken),
      refreshTokenLength: newRefreshToken?.length 
    });
    
    if (!newRefreshToken) {
      clearAuthState();
      throw new Error("Missing refresh token");
    }

    // Backend đã tự động set cookies, chỉ cần update state
    setToken(newToken);
    setRefreshToken(newRefreshToken);

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      console.log('[Auth] Saved to localStorage');
    }

    setIsAuthenticated(false);
    setUser(null);

    await verifyToken(newToken);
    router.replace("/");
  };

  /**
   * Check admin access based on roles or if user has any permissions granted.
   */
  const hasAdminAccess = useCallback((): boolean => {
    if (!user) {
      return false;
    }

    // Check role-based access
    if (user.role === "admin" || user.role === "super_admin" || user.role === "staff") {
      return true;
    }

    // Check if user has any permissions granted (permission-based access)
    if (user.permissions && user.permissions.length > 0) {
      return true;
    }

    return false;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        isAuthenticated,
        isAuthReady,
        verifyToken,
        login,
        logout,
        hasAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for using the AuthContext in components.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
