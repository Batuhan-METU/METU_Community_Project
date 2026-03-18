"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id?: string | number;
  email?: string;
  full_name?: string;
  user_metadata?: { full_name?: string };
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (params: { token: string; user?: AuthUser | null }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken =
        typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      const storedUser =
        typeof window !== "undefined" ? window.localStorage.getItem("user") : null;

      setToken(storedToken);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login: AuthContextValue["login"] = ({ token, user: authUser }) => {
    window.localStorage.setItem("access_token", token);
    if (authUser) {
      window.localStorage.setItem("user", JSON.stringify(authUser));
    }
    document.cookie = "auth-token=logged-in; path=/";
    setToken(token);
    setUser(authUser ?? null);
  };

  const logout = () => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("user");
    document.cookie = "auth-token=; Max-Age=0; path=/";
    setToken(null);
    setUser(null);
    window.location.assign("/");
  };

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider içinde kullanılmalı.");
  return ctx;
}

