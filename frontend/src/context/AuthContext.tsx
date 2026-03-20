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
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
};

const TOKEN_STORAGE_KEY = "auth_token";
const TOKEN_COOKIE_KEY = "auth_token";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const profile = (await response.json()) as AuthUser;
      setUser(profile);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      Cookies.remove(TOKEN_COOKIE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    void fetchCurrentUser(storedToken);
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (accessToken: string) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      Cookies.set(TOKEN_COOKIE_KEY, accessToken, { expires: 7, sameSite: "lax" });
      setToken(accessToken);
      setIsLoading(true);
      await fetchCurrentUser(accessToken);
    },
    [fetchCurrentUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    Cookies.remove(TOKEN_COOKIE_KEY);
    setToken(null);
    setUser(null);
  }, []);

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
