import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { storage } from "@/src/utils/storage";
import { api, setToken, clearToken } from "@/src/api";

export interface User {
  id: string;
  email: string;
  name: string;
  specialty: string;
  hospital: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    specialty?: string;
    hospital?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const USER_KEY = "doc_finance_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cached = await storage.getItem<string>(USER_KEY, "");
        if (cached) {
          // Try to validate token
          try {
            const me = await api<User>("/auth/me");
            setUser(me);
          } catch {
            await clearToken();
            await storage.removeItem(USER_KEY);
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api<{ access_token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    await setToken(res.access_token);
    await storage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    specialty?: string;
    hospital?: string;
  }) => {
    const res = await api<{ access_token: string; user: User }>("/auth/register", {
      method: "POST",
      body: data,
      auth: false,
    });
    await setToken(res.access_token);
    await storage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = async () => {
    await clearToken();
    await storage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
