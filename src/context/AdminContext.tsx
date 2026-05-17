"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getAdminToken, setAdminToken } from "@/lib/api";

type AdminContextValue = {
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAdmin(!!getAdminToken());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api<{ token: string; user: { role: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        token: null,
      });
      if (data.user.role !== "ADMIN") {
        return { ok: false, error: "E-mail ou senha de administrador inválidos" };
      }
      setAdminToken(data.token);
      setIsAdmin(true);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Falha no login",
      };
    }
  }, []);

  const logout = useCallback(() => {
    setAdminToken(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, isLoading, login, logout }),
    [isAdmin, isLoading, login, logout],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
