import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Rejected"];

export default function Dashboard() {
  const { token, isAuthed } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAuthed || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/service-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load requests");
        if (!cancelled) setRequests(data.requests || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthed, token]);

  const stats = React.useMemo(() => {
    const total = requests.length;
    const pendingPay = requests.filter((r) => r.paymentStatus === "pending").length;
    const adminPending = requests.filter((r) => r.adminStatus === "Pending").length;
    const paid = requests.filter((r) => r.paymentStatus === "paid").length;
    return [
      { label: "Total requests", value: String(total), icon: "📋", color: "blue" },
      { label: "Payment pending", value: String(pendingPay), icon: "⏳", color: "yellow" },
      { label: "Admin: Pending", value: String(adminPending), icon: "🕒", color: "orange" },
      { label: "Paid", value: String(paid), icon: "✅", color: "green" },
    ];
  }, [requests]);

  const updateStatus = async (id, adminStatus) => {
    if (!token) return;
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch(`${API_URL}/service-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Update failed");
      const updated = data.request;
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    } catch (e) {
      setError(e.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const openAttachment = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/service-requests/${id}/attachment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not open file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e.message || "Could not open attachment");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</h3>
              </div>
              <span className="text-3xl bg-gray-100 p-2 rounded-lg">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Service requests</h3>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-sm">No requests yet.</p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Service</th>
                <th className="py-3 pr-4">Payment</th>
                <th className="py-3 pr-4">File</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 align-top">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900">{r.user?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{r.user?.email}</div>
                    <div className="text-xs text-gray-500">{r.contactMobile}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900">{r.serviceName}</div>
                    <div className="text-xs text-gray-500">{r.serviceCategory || "—"}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${
                        r.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : r.paymentStatus === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {r.attachment?.url ? (
                      <button
                        type="button"
                        onClick={() => openAttachment(r.id)}
                        className="text-blue-600 hover:underline text-xs font-semibold"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 min-w-[160px]">
                    <select
                      value={r.adminStatus}
                      disabled={updatingId === r.id}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
