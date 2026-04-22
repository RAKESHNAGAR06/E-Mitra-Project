import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "./context/UserAuthContext";
import UserAuthModal from "./UserAuthModal";
import { FaClipboardList, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaCreditCard, FaFileAlt } from "react-icons/fa";
import { startRazorpayPayment } from "./utils/startRazorpayPayment";

export default function UserDashboard() {
  const { isLoggedIn, bootstrapped, getAuthHeader, apiBase, user } = useContext(UserAuthContext);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [payMsg, setPayMsg] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [serviceForms, setServiceForms] = useState({});

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

  useEffect(() => {
    if (!bootstrapped || !isLoggedIn) return;
    const slugs = Array.from(new Set((requests || []).map((r) => r.serviceSlug).filter(Boolean)));
    if (!slugs.length) return;

    let cancelled = false;
    (async () => {
      try {
        const missing = slugs.filter((s) => serviceForms[s] === undefined);
        if (!missing.length) return;
        const results = await Promise.all(
          missing.map(async (slug) => {
            try {
              const res = await fetch(`${apiBase}/services/detail/${encodeURIComponent(String(slug))}`);
              const data = await res.json().catch(() => ({}));
              if (!res.ok) return [slug, null];
              return [slug, data?.formUrl ? String(data.formUrl) : null];
            } catch {
              return [slug, null];
            }
          })
        );
        if (cancelled) return;
        setServiceForms((prev) => {
          const next = { ...prev };
          for (const [slug, url] of results) next[slug] = url;
          return next;
        });
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, bootstrapped, isLoggedIn, apiBase]);

  const openUploadedDocument = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`${apiBase}/service-requests/${id}/attachment`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error("Could not open file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e.message || "Could not open attachment");
    }
  };

  const payRequest = async (r) => {
    if (!r?.id) return;
    setPayingId(r.id);
    setPayMsg("");
    try {
      const result = await startRazorpayPayment({
        apiBase,
        getAuthHeader,
        serviceRequest: r,
        prefillEmail: user?.email,
        prefillContact: r.contactMobile || user?.phone,
        onVerified: () => {
          setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, paymentStatus: "paid" } : x)));
          setPayMsg("Payment successful. Your request is confirmed.");
        },
      });
      if (result?.dismissed) setPayMsg("");
    } catch (e) {
      setPayMsg(e.message || "Payment could not start");
    } finally {
      setPayingId(null);
    }
  };

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
        {payMsg ? (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              payMsg.includes("successful") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
            }`}
          >
            {payMsg}
          </div>
        ) : null}
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
                        <div className="flex-1 min-w-0">
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
                      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {r.attachment?.originalName ? (
                          <button
                            type="button"
                            onClick={() => openUploadedDocument(r.id)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold"
                          >
                            <FaFileAlt /> View document
                          </button>
                        ) : null}

                        {r.serviceSlug && serviceForms[r.serviceSlug] ? (
                          <a
                            href={serviceForms[r.serviceSlug]}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                          >
                            <FaFileAlt /> Download form
                          </a>
                        ) : null}

                        {r.paymentStatus !== "paid" && Number(r.amountPaise) >= 100 ? (
                          <button
                            type="button"
                            disabled={payingId === r.id}
                            onClick={() => payRequest(r)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold"
                          >
                            <FaCreditCard /> {payingId === r.id ? "Opening…" : "Pay now"}
                          </button>
                        ) : null}
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
                      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {r.attachment?.originalName ? (
                          <button
                            type="button"
                            onClick={() => openUploadedDocument(r.id)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold"
                          >
                            <FaFileAlt /> View document
                          </button>
                        ) : null}

                        {r.serviceSlug && serviceForms[r.serviceSlug] ? (
                          <a
                            href={serviceForms[r.serviceSlug]}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                          >
                            <FaFileAlt /> Download form
                          </a>
                        ) : null}
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
