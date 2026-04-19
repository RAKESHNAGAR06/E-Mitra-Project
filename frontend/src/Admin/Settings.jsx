import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const PUBLIC_API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

export default function Settings() {
  const { user, token, updateAdminUser, listAdminUsers } = useContext(AuthContext);
  const isSuperAdmin = user?.role === "superadmin";

  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", email: "", role: "admin", password: "" });
  const canEditPassword = isSuperAdmin;

  const [site, setSite] = useState({
    visitCenterUrl: "",
    mapLatitude: "",
    mapLongitude: "",
    address: "",
    phoneDisplay: "",
    phoneSecondary: "",
    email: "",
    workingHours: "",
    whatsappNumber: "",
  });
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteMsg, setSiteMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    setEmail(user?.email || "");
  }, [user?.email]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSiteLoading(true);
      setSiteMsg({ type: "", text: "" });
      try {
        const res = await fetch(`${PUBLIC_API}/site-settings`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) throw new Error(data?.error || "Failed to load public settings");
        setSite((p) => ({ ...p, ...data }));
      } catch (e) {
        if (!cancelled) setSiteMsg({ type: "error", text: e.message || "Failed to load public settings" });
      } finally {
        if (!cancelled) setSiteLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;
    let cancelled = false;
    (async () => {
      setLoadingUsers(true);
      const res = await listAdminUsers();
      if (cancelled) return;
      setLoadingUsers(false);
      if (!res.success) return setMsg({ type: "error", text: res.error || "Failed to load users" });
      setUsers(res.users || []);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin, listAdminUsers]);

  const selfId = user?.id;

  const resetMsg = () => setMsg({ type: "", text: "" });

  const saveSelf = async (e) => {
    e.preventDefault();
    resetMsg();
    if (!selfId) return setMsg({ type: "error", text: "Missing user id" });
    setSaving(true);
    const res = await updateAdminUser(selfId, { email });
    setSaving(false);
    if (!res.success) return setMsg({ type: "error", text: res.error || "Update failed" });
    setMsg({ type: "success", text: "Profile updated" });
  };

  const openEdit = (u) => {
    resetMsg();
    setEditForm({ id: u.id, email: u.email || "", role: u.role || "admin", password: "" });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditForm({ id: "", email: "", role: "admin", password: "" });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    resetMsg();
    setSaving(true);

    const payload = { email: editForm.email, role: editForm.role };
    if (canEditPassword && editForm.password) payload.password = editForm.password;

    const res = await updateAdminUser(editForm.id, payload);
    setSaving(false);
    if (!res.success) return setMsg({ type: "error", text: res.error || "Update failed" });

    // Refresh list view for superadmin
    setUsers((prev) => prev.map((u) => (u.id === editForm.id ? { ...u, ...res.user } : u)));
    setMsg({ type: "success", text: "User updated" });
    closeEdit();
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => (a.email || "").localeCompare(b.email || ""));
  }, [users]);

  const saveSite = async (e) => {
    e.preventDefault();
    setSiteMsg({ type: "", text: "" });
    if (!token) return setSiteMsg({ type: "error", text: "Login required" });
    setSiteSaving(true);
    try {
      const res = await fetch(`${PUBLIC_API}/site-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(site),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setSite((p) => ({ ...p, ...data }));
      setSiteMsg({ type: "success", text: "Public website details saved" });
    } catch (err) {
      setSiteMsg({ type: "error", text: err.message || "Save failed" });
    } finally {
      setSiteSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900">Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Update account details. Password changes are restricted to superadmin.</p>

        {msg.text ? (
          <div
            className={[
              "mt-4 rounded-xl px-4 py-3 text-sm",
              msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
            ].join(" ")}
          >
            {msg.text}
          </div>
        ) : null}

        <form onSubmit={saveSelf} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </Field>
          <Field label="Role">
            <input
              value={user?.role || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500"
            />
          </Field>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold shadow shadow-orange-200"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Public website contact</h3>
            <p className="text-sm text-gray-500 mt-1">
              These values power the Contact page, footer-style quick actions, and the Service detail “Visit / Call / WhatsApp” buttons.
            </p>
          </div>
          {siteLoading ? <span className="text-sm text-gray-500">Loading…</span> : null}
        </div>

        {siteMsg.text ? (
          <div
            className={[
              "mt-4 rounded-xl px-4 py-3 text-sm",
              siteMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
            ].join(" ")}
          >
            {siteMsg.text}
          </div>
        ) : null}

        <form onSubmit={saveSite} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Visit center / directions URL">
            <input
              value={site.visitCenterUrl}
              onChange={(e) => setSite((p) => ({ ...p, visitCenterUrl: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="https://maps.google.com/..."
            />
          </Field>
          <Field label="WhatsApp number (digits, country code)">
            <input
              value={site.whatsappNumber}
              onChange={(e) => setSite((p) => ({ ...p, whatsappNumber: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="919876543210"
            />
          </Field>

          <Field label="Map latitude">
            <input
              value={site.mapLatitude}
              onChange={(e) => setSite((p) => ({ ...p, mapLatitude: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </Field>
          <Field label="Map longitude">
            <input
              value={site.mapLongitude}
              onChange={(e) => setSite((p) => ({ ...p, mapLongitude: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </Field>

          <Field label="Address (display)">
            <textarea
              value={site.address}
              onChange={(e) => setSite((p) => ({ ...p, address: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            />
          </Field>

          <Field label="Primary phone (display)">
            <input
              value={site.phoneDisplay}
              onChange={(e) => setSite((p) => ({ ...p, phoneDisplay: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="+91 98765 43210"
            />
          </Field>

          <Field label="Secondary phone (optional)">
            <input
              value={site.phoneSecondary}
              onChange={(e) => setSite((p) => ({ ...p, phoneSecondary: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </Field>

          <Field label="Public email">
            <input
              value={site.email}
              onChange={(e) => setSite((p) => ({ ...p, email: e.target.value }))}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Working hours">
              <textarea
                value={site.workingHours}
                onChange={(e) => setSite((p) => ({ ...p, workingHours: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={siteSaving || siteLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold shadow"
            >
              {siteSaving ? "Saving…" : "Save public details"}
            </button>
          </div>
        </form>
      </div>

      {isSuperAdmin ? (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-gray-900">Admin Users</h4>
              <p className="text-sm text-gray-500 mt-1">Superadmin can edit email/role and change passwords.</p>
            </div>
            {loadingUsers ? <span className="text-sm text-gray-500">Loading...</span> : null}
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {sortedUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{u.email}</p>
                  <p className="text-xs text-gray-500">Role: {u.role}</p>
                </div>
                <button
                  onClick={() => openEdit(u)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm"
                >
                  Edit
                </button>
              </div>
            ))}
            {sortedUsers.length === 0 && !loadingUsers ? (
              <div className="py-6 text-sm text-gray-500">No users found.</div>
            ) : null}
          </div>
        </div>
      ) : null}

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <p className="text-xs text-gray-500">Password changes are superadmin-only.</p>
              </div>
              <button
                onClick={closeEdit}
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 grid place-items-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEdit} className="p-6 space-y-4">
              <Field label="Email">
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </Field>

              <Field label="Role">
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                >
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </Field>

              <Field label="New Password (superadmin only)">
                <input
                  value={editForm.password}
                  onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                  type="password"
                  disabled={!canEditPassword}
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none",
                    canEditPassword
                      ? "border-gray-200 focus:ring-orange-500"
                      : "border-gray-100 bg-gray-50 text-gray-400",
                  ].join(" ")}
                  placeholder={canEditPassword ? "Leave blank to keep unchanged" : "Restricted"}
                />
              </Field>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold shadow-lg shadow-orange-200 transition-colors"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

