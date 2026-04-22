import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Rejected"];

export default function Messages() {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

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

