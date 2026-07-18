"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import * as authApi from "@/lib/auth-api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: { firstName: string; middleName?: string; lastName: string };
  }) => Promise<string>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("clockerUserId");
}

function setStoredUserId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem("clockerUserId", id);
  } else {
    localStorage.removeItem("clockerUserId");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = getStoredUserId();

    if (!storedId) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    fetch(
      `/api/users/${storedId}`,
      { credentials: "include" },
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data._id) setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    setStoredUserId(res.user._id);
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: { firstName: string; middleName?: string; lastName: string };
    }) => {
      const res = await authApi.register(data);
      return res.message;
    },
    [],
  );

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    await authApi.verifyOtp(email, otp);
  }, []);

  const googleLogin = useCallback(async (token: string) => {
    const res = await authApi.googleLogin(token);
    setUser(res.user);
    setStoredUserId(res.user._id);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
    } finally {
      setUser(null);
      setStoredUserId(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const storedId = getStoredUserId();
    if (!storedId) return;
    try {
      const res = await fetch(`/api/users/${storedId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data._id) setUser(data);
      }
    } catch {
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
