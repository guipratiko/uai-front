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
import { api, apiFormData, setUserToken, getUserToken } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    cpf?: string;
    phone?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<{ ok: boolean; error?: string }>;
  removeAvatar: () => Promise<{ ok: boolean; error?: string }>;
  syncUserFromBuyer: (buyer: User) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ApiUser = User & { id?: string; role?: string };

function toUser(u: ApiUser): User {
  return {
    fullName: u.fullName,
    email: u.email,
    cpf: u.cpf,
    phone: u.phone,
    avatarUrl: u.avatarUrl ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = getUserToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api<{ user: ApiUser }>("/auth/me", { token });
      setUser(toUser(data.user));
    } catch {
      setUserToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const refreshUser = useCallback(async () => {
    const token = getUserToken();
    if (!token) return;
    try {
      const data = await api<{ user: ApiUser }>("/auth/me", { token });
      setUser(toUser(data.user));
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api<{ token: string; user: ApiUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        token: null,
      });
      if (data.user.role === "ADMIN") {
        return { ok: false, error: "Use a área do produtor para login de administrador" };
      }
      setUserToken(data.token);
      setUser(toUser(data.user));
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Falha no login",
      };
    }
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      fullName: string;
      cpf?: string;
      phone?: string;
    }) => {
      try {
        const data = await api<{ token: string; user: ApiUser }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(input),
          token: null,
        });
        setUserToken(data.token);
        setUser(toUser(data.user));
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : "Falha no cadastro",
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUserToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      const result = await api<{ user: ApiUser }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: data.fullName,
          cpf: data.cpf,
          phone: data.phone,
        }),
      });
      setUser(toUser(result.user));
    },
    [user],
  );

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const result = await apiFormData<{ user: ApiUser }>("/auth/avatar", formData);
      setUser(toUser(result.user));
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Falha ao enviar foto",
      };
    }
  }, []);

  const removeAvatar = useCallback(async () => {
    try {
      const result = await api<{ user: ApiUser }>("/auth/avatar", { method: "DELETE" });
      setUser(toUser(result.user));
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Falha ao remover foto",
      };
    }
  }, []);

  const syncUserFromBuyer = useCallback((buyer: User) => {
    setUser((prev) => ({ ...prev, ...buyer }));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      removeAvatar,
      syncUserFromBuyer,
      refreshUser,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      removeAvatar,
      syncUserFromBuyer,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
