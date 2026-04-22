import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const { token, isAuthed } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

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

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800">Messages</h3>
        <p className="text-sm text-gray-500 mt-1">
          Service requests have been moved to the Messages section.
        </p>
        <div className="mt-4">
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow shadow-orange-200"
          >
            Open Messages
            <span aria-hidden>→</span>
          </Link>
          {loading ? <span className="ml-3 text-sm text-gray-500">Loading stats…</span> : null}
        </div>
      </div>
    </div>
  );
}
