import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

export default function FrontendUsers() {
  const { token, isAuthed, user } = useContext(AuthContext);
  const isSuperAdmin = user?.role === "superadmin";
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", email: "", name: "", phone: "", blocked: false, password: "" });

  const load = async () => {
    if (!isAuthed || !token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/users/frontend`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load users");
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, token]);

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => (a.email || "").localeCompare(b.email || ""));
  }, [users]);

  const openEdit = (u) => {
    setError("");
    setEditForm({
      id: u.id,
      email: u.email || "",
      name: u.name || "",
      phone: u.phone || "",
      blocked: Boolean(u.blocked),
      password: "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditForm({ id: "", email: "", name: "", phone: "", blocked: false, password: "" });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/users/${editForm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: editForm.email,
          name: editForm.name,
          phone: editForm.phone,
          blocked: editForm.blocked,
          password: editForm.password || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setUsers((prev) => prev.map((u) => (u.id === editForm.id ? { ...u, ...data.user } : u)));
      closeEdit();
    } catch (e2) {
      setError(e2.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleBlocked = async (u) => {
    if (!token) return;
    setError("");
    try {
      const res = await fetch(`${API_URL}/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blocked: !u.blocked }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...data.user } : x)));
    } catch (e) {
      setError(e.message || "Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-800">Frontend users</h3>
          <button
            type="button"
            onClick={load}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm mt-4">Loading...</p>
        ) : sorted.length === 0 ? (
          <p className="text-gray-500 text-sm mt-4">No users found.</p>
        ) : (
          <table className="min-w-full text-sm text-left mt-4">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase">
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((u) => (
                <tr key={u.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900">{u.email}</td>
                  <td className="py-3 pr-4 text-gray-700">{u.name || "—"}</td>
                  <td className="py-3 pr-4 text-gray-700">{u.phone || "—"}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={[
                        "inline-flex px-2 py-1 rounded-lg text-xs font-semibold",
                        u.blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
                      ].join(" ")}
                    >
                      {u.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      {isSuperAdmin ? (
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs"
                        >
                          Edit
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => toggleBlocked(u)}
                        className={[
                          "px-3 py-1.5 rounded-lg font-semibold text-xs",
                          u.blocked
                            ? "bg-green-50 hover:bg-green-100 text-green-700"
                            : "bg-red-50 hover:bg-red-100 text-red-700",
                        ].join(" ")}
                      >
                        {u.blocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit user</h3>
                <p className="text-xs text-gray-500">Edit details and block/unblock user access.</p>
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
              {!isSuperAdmin ? (
                <div className="rounded-xl bg-amber-50 text-amber-800 px-4 py-3 text-sm">
                  Only superadmin can edit user details or change passwords.
                </div>
              ) : null}
              <Field label="Email">
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  disabled={!isSuperAdmin}
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none",
                    isSuperAdmin ? "border-gray-200 focus:ring-orange-500" : "border-gray-100 bg-gray-50 text-gray-400",
                  ].join(" ")}
                  required
                />
              </Field>
              <Field label="Name">
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  disabled={!isSuperAdmin}
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none",
                    isSuperAdmin ? "border-gray-200 focus:ring-orange-500" : "border-gray-100 bg-gray-50 text-gray-400",
                  ].join(" ")}
                />
              </Field>
              <Field label="Phone">
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  disabled={!isSuperAdmin}
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none",
                    isSuperAdmin ? "border-gray-200 focus:ring-orange-500" : "border-gray-100 bg-gray-50 text-gray-400",
                  ].join(" ")}
                />
              </Field>

              <Field label="New Password (superadmin only)">
                <input
                  value={editForm.password}
                  onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                  type="password"
                  disabled={!isSuperAdmin}
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none",
                    isSuperAdmin ? "border-gray-200 focus:ring-orange-500" : "border-gray-100 bg-gray-50 text-gray-400",
                  ].join(" ")}
                  placeholder={isSuperAdmin ? "Leave blank to keep unchanged" : "Restricted"}
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editForm.blocked}
                  onChange={(e) => setEditForm((p) => ({ ...p, blocked: e.target.checked }))}
                />
                Block user
              </label>

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

