import React, { useContext, useState } from "react";
import { UserAuthContext } from "./context/UserAuthContext";

const TabButton = ({ active, children, ...props }) => (
  <button
    type="button"
    {...props}
    className={[
      "flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all",
      active ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
    ].join(" ")}
  >
    {children}
  </button>
);

export default function UserAuthModal({ open, onClose }) {
  const { login, register } = useContext(UserAuthContext);
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("Welcome back!");
    onClose?.();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMsg();
    if (!name.trim()) return setError("Name is required");
    if (!/^[6-9]\d{9}$/.test(String(phone).replace(/\s/g, ""))) {
      return setError("Enter a valid 10-digit mobile number");
    }
    setBusy(true);
    const res = await register({ name: name.trim(), email, password, phone: phone.replace(/\s/g, "") });
    setBusy(false);
    if (!res.success) return setError(res.error || "Registration failed");
    setSuccess("Account created!");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Citizen account</h3>
            <p className="text-xs text-gray-500">Login or sign up to apply for services</p>
          </div>
          <button
            type="button"
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
            <TabButton active={tab === "register"} onClick={() => (setTab("register"), resetMsg())}>
              Sign up
            </TabButton>
          </div>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
          ) : null}
          {success ? (
            <div className="mb-4 rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">{success}</div>
          ) : null}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            {tab === "register" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your name"
                  required
                />
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            {tab === "register" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="10-digit mobile"
                  required
                />
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold shadow-lg transition-colors"
            >
              {busy ? "Please wait..." : tab === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
