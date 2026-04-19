import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "./context/UserAuthContext";
import UserAuthModal from "./UserAuthModal";
import { FaClipboardList, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

export default function UserDashboard() {
  const { isLoggedIn, bootstrapped, getAuthHeader, apiBase, user } = useContext(UserAuthContext);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bootstrapped || !isLoggedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${apiBase}/service-requests/my`, {
          headers: { ...getAuthHeader() },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load");
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
  }, [bootstrapped, isLoggedIn, apiBase, getAuthHeader]);

  if (!bootstrapped) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My services</h1>
        <p className="text-gray-600 text-center mb-6">Please log in to see your service requests.</p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg"
        >
          Login / Sign up
        </button>
        <UserAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  const active = requests.filter(
    (r) => r.adminStatus !== "Completed" && r.adminStatus !== "Rejected"
  );
  const past = requests.filter((r) => r.adminStatus === "Completed" || r.adminStatus === "Rejected");

  const statusIcon = (r) => {
    if (r.paymentStatus !== "paid") return <FaHourglassHalf className="text-amber-500" title="Payment pending" />;
    if (r.adminStatus === "Completed") return <FaCheckCircle className="text-green-600" />;
    if (r.adminStatus === "Rejected") return <FaTimesCircle className="text-red-500" />;
    return <FaClipboardList className="text-blue-600" />;
  };

  return (
    <div className="w-full font-sans bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My dashboard</h1>
            <p className="text-blue-200 text-sm mt-1">
              {user?.name ? `Hello, ${user.name}` : "Track your applications"}
            </p>
          </div>
          <Link
            to="/Contact"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/30"
          >
            New request
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {error ? (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
        ) : null}

        {loading ? (
          <p className="text-gray-500">Loading your requests...</p>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHourglassHalf className="text-amber-500" /> Active services
              </h2>
              {active.length === 0 ? (
                <p className="text-gray-500 text-sm">No active requests.</p>
              ) : (
                <ul className="space-y-3">
                  {active.map((r) => (
                    <li
                      key={r.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{statusIcon(r)}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{r.serviceName}</p>
                          <p className="text-xs text-gray-500">
                            Payment: <span className="font-medium">{r.paymentStatus}</span> · Status:{" "}
                            <span className="font-medium">{r.adminStatus}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> Previous services
              </h2>
              {past.length === 0 ? (
                <p className="text-gray-500 text-sm">No completed or rejected requests yet.</p>
              ) : (
                <ul className="space-y-3">
                  {past.map((r) => (
                    <li
                      key={r.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{statusIcon(r)}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{r.serviceName}</p>
                          <p className="text-xs text-gray-500">
                            Payment: <span className="font-medium">{r.paymentStatus}</span> · Status:{" "}
                            <span className="font-medium">{r.adminStatus}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ""}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
