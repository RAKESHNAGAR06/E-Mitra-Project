import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const UserAuthContext = createContext(null);

const STORAGE_KEY = "emitra_user_auth";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadStored() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { token: null, user: null };
  const parsed = safeParse(raw);
  if (!parsed?.token) return { token: null, user: null };
  return { token: parsed.token, user: parsed.user || null };
}

export function UserAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const s = loadStored();
    setToken(s.token);
    setUser(s.user);
    setBootstrapped(true);
  }, []);

  const persist = useCallback((nextToken, nextUser) => {
    if (!nextToken) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    persist(null, null);
  }, [persist]);

  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.error || "Login failed" };
    }
    if (data.user?.role !== "user") {
      return { success: false, error: "This login is for citizen accounts only. Admins should use /admin." };
    }
    setToken(data.token);
    setUser(data.user);
    persist(data.token, data.user);
    return { success: true, user: data.user };
  }, [persist]);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.error || "Registration failed" };
    }
    setToken(data.token);
    setUser(data.user);
    persist(data.token, data.user);
    return { success: true, user: data.user };
  }, [persist]);

  const getAuthHeader = useCallback(() => authHeaders(token), [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      bootstrapped,
      isLoggedIn: Boolean(token && user?.role === "user"),
      login,
      register,
      logout,
      getAuthHeader,
      apiBase: BASE_URL,
    }),
    [token, user, bootstrapped, login, register, logout, getAuthHeader]
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
}
