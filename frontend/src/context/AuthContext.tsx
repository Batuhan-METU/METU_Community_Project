"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";

type AuthUser = {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Sets token + user immediately, then refreshes profile from /users/me when possible. */
  login: (accessToken: string, userHint?: AuthUser | null) => Promise<void>;
  logout: () => void;
};

const TOKEN_STORAGE_KEY = "auth_token";
const TOKEN_COOKIE_KEY = "auth_token";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Decode Supabase JWT payload (no signature verify — same origin API only). */
function decodeJwtPayload(
  token: string
): { sub?: string; email?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";
    const json = atob(base64);
    return JSON.parse(json) as { sub?: string; email?: string };
  } catch {
    return null;
  }
}

function userFromAccessToken(accessToken: string): AuthUser | null {
  const p = decodeJwtPayload(accessToken);
  if (!p?.sub) return null;
  return { id: p.sub, email: p.email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    Cookies.remove(TOKEN_COOKIE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(
    async (accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          clearSession();
          return;
        }

        if (response.ok) {
          const profile = (await response.json()) as AuthUser;
          setUser(profile);
          return;
        }

        // Profile missing or server error — keep session; use JWT claims so Navbar stays logged in
        const fallback = userFromAccessToken(accessToken);
        if (fallback) {
          setUser((prev) => prev ?? fallback);
        }
      } catch {
        const fallback = userFromAccessToken(accessToken);
        if (fallback) {
          setUser((prev) => prev ?? fallback);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [clearSession]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    const jwtUser = userFromAccessToken(storedToken);
    if (jwtUser) {
      setUser(jwtUser);
    }
    setIsLoading(true);
    void fetchCurrentUser(storedToken);
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (accessToken: string, userHint?: AuthUser | null) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      Cookies.set(TOKEN_COOKIE_KEY, accessToken, {
        expires: 7,
        sameSite: "lax",
      });
      setToken(accessToken);
      const immediate =
        userHint ?? userFromAccessToken(accessToken);
      if (immediate) {
        setUser(immediate);
      }
      setIsLoading(true);
      await fetchCurrentUser(accessToken);
    },
    [fetchCurrentUser]
  );

  const logout = useCallback(() => {
    clearSession();
    setIsLoading(false);
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
