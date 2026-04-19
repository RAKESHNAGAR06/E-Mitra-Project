import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaLock,
  FaCreditCard,
} from "react-icons/fa";
import { UserAuthContext } from "./context/UserAuthContext";
import UserAuthModal from "./UserAuthModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Contact() {
  const location = useLocation();
  const { isLoggedIn, bootstrapped, user, getAuthHeader } = useContext(UserAuthContext);
  const [authOpen, setAuthOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    service: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [services, setServices] = useState([]);
  const [prefillMeta, setPrefillMeta] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [createdRequest, setCreatedRequest] = useState(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setServices(data);
      } catch {
        /* keep static fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user?.name) {
      setFormData((p) => ({ ...p, name: user.name }));
    }
    if (user?.phone) {
      setFormData((p) => ({ ...p, mobile: user.phone }));
    }
  }, [user]);

  useEffect(() => {
    const st = location.state;
    if (st?.service) {
      setPrefillMeta(st.service);
      setFormData((p) => ({
        ...p,
        service: st.service.name || p.service,
      }));
    }
  }, [location.state]);

  const serviceOptions = useMemo(() => {
    const names = services.map((s) => s.name).filter(Boolean);
    const fromPrefill = prefillMeta?.name;
    const merged = [...names];
    if (fromPrefill && !merged.includes(fromPrefill)) {
      merged.unshift(fromPrefill);
    }
    if (!merged.length) {
      return [
        "PAN Card",
        "Aadhaar Update",
        "Birth Certificate",
        "Income Certificate",
        "Electricity Bill",
        "Other",
      ];
    }
    if (!merged.includes("Other")) merged.push("Other");
    return merged;
  }, [services, prefillMeta]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFile = (e) => {
    setFileError("");
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFile(null);
      setFileError("File must be 5MB or smaller.");
      return;
    }
    const ok = ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(f.type);
    if (!ok) {
      setFile(null);
      setFileError("Only JPG, PNG, WEBP, or PDF files are allowed.");
      return;
    }
    setFile(f);
  };

  const validate = () => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(String(formData.mobile).replace(/\s/g, ""))) {
      return "Enter a valid 10-digit Indian mobile number.";
    }
    if (!formData.service) return "Please select a service.";
    if (!file) return "Please upload a supporting document (JPG, PNG, WEBP, or PDF).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const v = validate();
    if (v) {
      setFormError(v);
      return;
    }
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("serviceName", formData.service.trim());
      fd.append("serviceCategory", prefillMeta?.category || "");
      fd.append("serviceFeeText", prefillMeta?.fee || "");
      fd.append("serviceSlug", prefillMeta?.slug || "");
      fd.append("contactName", formData.name.trim());
      fd.append("contactMobile", formData.mobile.replace(/\s/g, ""));
      fd.append("message", formData.message.trim());
      if (file) fd.append("document", file);

      const res = await fetch(`${API_URL}/service-requests`, {
        method: "POST",
        headers: { ...getAuthHeader() },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not submit request");

      setCreatedRequest(data.serviceRequest);
      setPaymentMsg("");
    } catch (err) {
      setFormError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const payNow = async () => {
    if (!createdRequest?.id) return;
    setPaymentBusy(true);
    setPaymentMsg("");
    try {
      const orderRes = await fetch(`${API_URL}/payments/razorpay/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ serviceRequestId: createdRequest.id }),
      });
      const orderData = await orderRes.json().catch(() => ({}));
      if (orderRes.status === 503) {
        setPaymentMsg(
          "Payment gateway is not configured on the server. Add Razorpay keys in backend .env (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)."
        );
        return;
      }
      if (!orderRes.ok) throw new Error(orderData?.error || "Could not start payment");

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error("Could not load Razorpay checkout.");
      }

      const options = {
        key: orderData.keyId,
        order_id: orderData.orderId,
        currency: orderData.currency || "INR",
        name: "e-Mitra",
        description: createdRequest.serviceName || "Service fee",
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/razorpay/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
              },
              body: JSON.stringify({
                serviceRequestId: createdRequest.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) throw new Error(verifyData?.error || "Verification failed");
            setCreatedRequest((prev) => ({ ...prev, paymentStatus: "paid" }));
            setPaymentMsg("Payment successful. Your request is confirmed.");
          } catch (err) {
            setPaymentMsg(err.message || "Payment verification failed");
          } finally {
            setPaymentBusy(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentBusy(false),
        },
        prefill: {
          email: user?.email || undefined,
          contact: formData.mobile || undefined,
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setPaymentMsg("Payment failed or was cancelled.");
        setPaymentBusy(false);
      });
      rzp.open();
    } catch (err) {
      setPaymentMsg(err.message || "Payment could not start");
      setPaymentBusy(false);
    }
  };

  const address = "Main Market, District Center, Rajasthan - 302001, India";
  const mapCoords = "24.4339432,75.9863679";
  const mapSrc = `https://www.google.com/maps?q=${mapCoords}&output=embed`;
  const directionsLink = `https://www.google.com/maps?q=${mapCoords}`;

  const showPayment =
    createdRequest &&
    createdRequest.paymentStatus === "pending" &&
    createdRequest.amountPaise >= 100;

  return (
    <div className="w-full font-sans bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-blue-200 mt-1 text-sm md:text-base">संपर्क करें - We're here to help you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 bg-white shadow-xl p-4 sm:p-6 md:p-10 rounded-2xl border border-gray-100 mb-10 md:mb-12">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Send Us a Message</h2>
            <p className="text-gray-600 mt-1 text-xs md:text-sm mb-4">
              हमें संदेश भेजें - Fill out the form and we'll contact you soon
            </p>

            {bootstrapped && !isLoggedIn ? (
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <FaLock className="text-amber-600 shrink-0" />
                <span className="flex-1">Login is required to submit a service request.</span>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700"
                >
                  Login / Sign up
                </button>
              </div>
            ) : null}

            {prefillMeta ? (
              <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-900">
                <p className="font-semibold">Selected service</p>
                <p className="mt-1">{prefillMeta.name}</p>
                {prefillMeta.fee ? <p className="text-blue-800/80 mt-0.5">Fee: {prefillMeta.fee}</p> : null}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Full Name / नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Mobile Number / मोबाइल नंबर <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Service Required / सेवा आवश्यक <span className="text-red-500">*</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700"
                  required
                >
                  <option value="" disabled>
                    -- Select Service --
                  </option>
                  {serviceOptions.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Upload document / दस्तावेज़ <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                  onChange={onFile}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-[11px] text-gray-500 mt-1">JPG, PNG, WEBP or PDF — max 5MB.</p>
                {fileError ? <p className="text-xs text-red-600 mt-1">{fileError}</p> : null}
                {file ? <p className="text-xs text-gray-600 mt-1">Selected: {file.name}</p> : null}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Message / संदेश <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write your message here..."
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              {formError ? (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{formError}</div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 md:py-3 text-sm md:text-base bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>

            {createdRequest ? (
              <div className="mt-8 border-t border-gray-100 pt-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaCreditCard className="text-blue-600" /> Payment
                </h3>
                <p className="text-sm text-gray-600">
                  Request recorded. Amount due: ₹{(createdRequest.amountPaise / 100).toFixed(2)} INR.
                </p>
                {createdRequest.paymentStatus === "paid" ? (
                  <div className="rounded-xl bg-green-50 text-green-800 px-4 py-3 text-sm font-medium">
                    Payment received. Your service request is confirmed.
                  </div>
                ) : showPayment ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={payNow}
                      disabled={paymentBusy}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold shadow"
                    >
                      {paymentBusy ? "Opening checkout..." : "Pay with Razorpay"}
                    </button>
                    {paymentMsg ? (
                      <p className={`text-sm ${paymentMsg.includes("successful") ? "text-green-700" : "text-red-700"}`}>
                        {paymentMsg}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Payment step unavailable for this amount.</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-center gap-5 w-full">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-5 md:p-6 rounded-2xl shadow-md w-full">
              <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full py-2.5 md:py-3 text-sm bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <FaMapMarkerAlt /> Visit Center
                </button>
                <button
                  type="button"
                  className="w-full py-2.5 md:py-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FaPhoneAlt /> Call Now
                </button>
                <button
                  type="button"
                  className="w-full py-2.5 md:py-3 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-lg" /> WhatsApp
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 md:p-6 shadow-sm w-full">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-5 uppercase tracking-wide border-b pb-3">
                Contact Information
              </h3>
              <div className="space-y-4 text-xs md:text-sm">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-600 leading-relaxed">{address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="text-blue-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-gray-600">+91 141 234 5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-purple-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600">info@emitra.gov.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock className="text-orange-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Working Hours</p>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-red-500 text-xs font-medium mt-0.5">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-indigo-100 rounded-xl border border-indigo-100 w-full">
              <p className="text-indigo-800 font-bold text-sm md:text-base">Walk - in Welcome!</p>
              <p className="text-indigo-600 text-xs md:text-sm mt-1">Feel free to visit us directly during working hours.</p>
            </div>
          </div>
        </div>

        <section className="bg-white font-sans">
          <div className="w-full">
            <div className="mb-4 md:mb-6 px-2 md:px-4 py-2 md:py-4">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800">Find Us on Map</h2>
              <p className="text-gray-500 mt-1 text-sm md:text-base">हमारा पता</p>
            </div>

            <div className="relative shadow-lg overflow-hidden border border-gray-200 h-[300px] md:h-[450px]">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="absolute inset-0"
              />

              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-10 md:right-10 bg-white rounded-xl shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 border border-gray-100">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <FaMapMarkerAlt className="text-orange-500 text-xl md:text-2xl flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm">Our Location</h4>
                    <p className="text-gray-500 text-[10px] md:text-xs">{address}</p>
                  </div>
                </div>

                <a
                  href={directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-md transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <UserAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default Contact;
