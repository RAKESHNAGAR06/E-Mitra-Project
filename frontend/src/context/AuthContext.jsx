import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const STORAGE_KEY = "emitra_admin_auth";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeadersFromToken(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function loadStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { token: null, user: null };
  const parsed = safeJsonParse(raw);
  if (!parsed?.token) return { token: null, user: null };
  return { token: parsed.token, user: parsed.user || null };
}

export function getStoredToken() {
  const { token } = loadStoredAuth();
  return token;
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const stored = loadStoredAuth();
    setToken(stored.token);
    setUser(stored.user);
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

    setToken(data.token);
    setUser(data.user);
    persist(data.token, data.user);
    return { success: true, user: data.user };
  }, [persist]);

  const createAdminUser = useCallback(
    async ({ email, password, role = "admin" }) => {
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${BASE_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeadersFromToken(token),
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data?.error || "Failed to create admin" };
      }
      return { success: true, user: data.user };
    },
    [token]
  );

  const listAdminUsers = useCallback(async () => {
    if (!token) return { success: false, error: "Not authenticated" };

    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers: { ...authHeadersFromToken(token) },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, error: data?.error || "Failed to fetch users" };
    return { success: true, users: data.users || [] };
  }, [token]);

  // Allows editing own details (admin/superadmin). Password changes are server-restricted to superadmin.
  const updateAdminUser = useCallback(
    async (id, payload) => {
      if (!token) return { success: false, error: "Not authenticated" };
      if (!id) return { success: false, error: "Missing user id" };

      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeadersFromToken(token) },
        body: JSON.stringify(payload || {}),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { success: false, error: data?.error || "Failed to update user" };

      // If backend returns refreshed token (self-update), persist it.
      if (data.token) {
        setToken(data.token);
        setUser(data.user || user);
        persist(data.token, data.user || user);
      }

      // If user object changed but no token returned (editing other users), just return it.
      return { success: true, user: data.user };
    },
    [token, persist, user]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      bootstrapped,
      isAuthed: Boolean(token),
      login,
      logout,
      createAdminUser,
      listAdminUsers,
      updateAdminUser,
    }),
    [token, user, bootstrapped, login, logout, createAdminUser, listAdminUsers, updateAdminUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

