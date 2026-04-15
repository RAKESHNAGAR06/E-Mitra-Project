import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const TabButton = ({ active, children, ...props }) => (
  <button
    {...props}
    className={[
      "flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all",
      active ? "bg-orange-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
    ].join(" ")}
  >
    {children}
  </button>
);

export default function AuthModal({ open, onClose }) {
  const { login, createAdminUser, user } = useContext(AuthContext);
  const [tab, setTab] = useState("login"); // login | register

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canCreateAdmins = useMemo(() => user?.role === "superadmin", [user?.role]);

  if (!open) return null;

  const resetMsg = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMsg();
    setBusy(true);
    const res = await login({ email, password });
    setBusy(false);
    if (!res.success) return setError(res.error || "Login failed");
    setSuccess("Logged in successfully");
    onClose?.();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMsg();
    if (!canCreateAdmins) return setError("Only superadmin can create admin users");
    setBusy(true);
    const res = await createAdminUser({ email, password, role });
    setBusy(false);
    if (!res.success) return setError(res.error || "Failed to create user");
    setSuccess(`User created: ${res.user.email} (${res.user.role})`);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Admin Access</h3>
            <p className="text-xs text-gray-500">Login or create admin users</p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 grid place-items-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-5">
            <TabButton active={tab === "login"} onClick={() => (setTab("login"), resetMsg())}>
              Login
            </TabButton>
            <TabButton
              active={tab === "register"}
              onClick={() => (setTab("register"), resetMsg())}
              title={canCreateAdmins ? "Create admin users" : "Superadmin required"}
            >
              Register Admin
            </TabButton>
          </div>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
          ) : null}
          {success ? (
            <div className="mb-4 rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">{success}</div>
          ) : null}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {tab === "register" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  disabled={!canCreateAdmins}
                >
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
                {!canCreateAdmins ? (
                  <p className="mt-2 text-xs text-gray-500">
                    Register tab use karne ke liye pehle superadmin login karo.
                  </p>
                ) : null}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy || (tab === "register" && !canCreateAdmins)}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold shadow-lg shadow-orange-200 transition-colors"
            >
              {busy ? "Please wait..." : tab === "login" ? "Login" : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

