import React, { useEffect, useMemo, useState } from "react";
import {
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
  FaFileAlt,
  FaExclamationTriangle,
  FaArrowRight,
  FaArrowLeft,
  FaUser,
  FaTag,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { mapsDirectionsUrl, mapsEmbedSrc, telHref, waMeUrl } from "./utils/contactLinks";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DEFAULT_STEPS = [
  "Visit nearest e-Mitra center with original documents.",
  "Submit the filled application form and documents.",
  "Complete verification as instructed at the center.",
  "Keep your acknowledgment slip for tracking status.",
];

const DEFAULT_DOCS = ["Identity proof", "Address proof (if applicable)", "Passport size photograph", "Filled application form"];

export default function ServiceDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const id = encodeURIComponent(String(slug || "").trim());
        if (!id) throw new Error("Missing service");

        const [svcRes, siteRes] = await Promise.all([
          fetch(`${API_URL}/services/detail/${id}`),
          fetch(`${API_URL}/site-settings`),
        ]);

        const siteData = await siteRes.json().catch(() => ({}));
        if (!cancelled && siteRes.ok) setSite(siteData);

        const svcData = await svcRes.json().catch(() => ({}));
        if (!svcRes.ok) throw new Error(svcData?.error || "Service not found");
        if (!cancelled) setService(svcData);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const steps = useMemo(() => {
    const s = service?.steps;
    if (Array.isArray(s) && s.length) return s.filter(Boolean);
    return DEFAULT_STEPS;
  }, [service]);

  const documents = useMemo(() => {
    const d = service?.documents;
    if (Array.isArray(d) && d.length) return d.filter(Boolean);
    return DEFAULT_DOCS;
  }, [service]);

  const aboutText = (service?.aboutContent || "").trim() || (service?.title || "").trim() || "Details for this service will appear here.";
  const feeText = (service?.price || "").trim() || "—";
  const timeText = (service?.processingTime || "").trim() || "—";
  const categoryText = (service?.category || "").trim() || "—";
  const title = (service?.name || "").trim() || "Service";
  const nameHi = (service?.nameHi || "").trim();

  const visitUrl = useMemo(() => {
    const lat = site?.mapLatitude;
    const lng = site?.mapLongitude;
    return mapsDirectionsUrl(lat, lng, site?.visitCenterUrl);
  }, [site]);

  const tel = telHref(site?.phoneDisplay);
  const wa = waMeUrl(site?.whatsappNumber);

  const mapEmbed = mapsEmbedSrc(site?.mapLatitude, site?.mapLongitude);

  if (loading) {
    return (
      <div className="font-sans bg-gray-50 min-h-screen flex items-center justify-center pt-24">
        <p className="text-gray-600">Loading service…</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="font-sans bg-gray-50 min-h-screen flex flex-col items-center justify-center pt-24 px-6">
        <p className="text-gray-800 font-semibold mb-2">{error || "Service not found"}</p>
        <button type="button" className="text-blue-600 font-medium" onClick={() => navigate("/Services")}>
          Back to services
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-20 pb-12 px-6 relative min-h-[320px]">
          <div className="absolute top-15 left-6 md:left-7">
            <button
              type="button"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-10"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="text-lg" />
              Back
            </button>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 mt-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-shrink-0">
              <FaUser className="text-5xl text-blue-700" />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
              {nameHi ? <p className="text-blue-200 mt-1 text-base mb-4">{nameHi}</p> : <div className="mb-4" />}
              <span className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">{categoryText}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-8 relative">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About This Service</h2>
              <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line">{aboutText}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                How to Apply
              </h2>
              <ul className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">2</span>
                Required Documents
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <FaRupeeSign className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Fee</p>
                  <p className="text-xl font-bold text-gray-800">{feeText}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="text-xl font-bold text-gray-800">{timeText}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FaTag className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-xl font-bold text-gray-800">{categoryText}</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
                <div className="flex gap-2">
                  <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 text-sm">Important Note</h4>
                    <p className="text-xs text-orange-600 mt-1">Please carry original documents for verification.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/Contact", {
                  state: {
                    service: {
                      name: title,
                      category: categoryText,
                      fee: feeText,
                      time: timeText,
                      slug: service.slug || slug,
                    },
                  },
                })
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 mb-4"
            >
              Apply Now <FaArrowRight />
            </button>

            {service.formUrl ? (
              <a
                href={service.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors text-center"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <FaFileAlt /> Download Form
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaFileAlt /> Download Form
              </button>
            )}

            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-white mb-4">Ready to Apply?</h3>

              <div className="space-y-3">
                {visitUrl ? (
                  <a
                    href={visitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <FaMapMarkerAlt /> Visit Center
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaMapMarkerAlt /> Visit Center
                  </button>
                )}

                {tel ? (
                  <a
                    href={tel}
                    className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt /> Call Now
                  </a>
                ) : (
                  <button type="button" disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                    <FaPhoneAlt /> Call Now
                  </button>
                )}

                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="text-lg" /> WhatsApp
                  </a>
                ) : (
                  <button type="button" disabled className="w-full py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                    <FaWhatsapp className="text-lg" /> WhatsApp
                  </button>
                )}
              </div>
            </div>

            {mapEmbed ? (
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-56">
                <iframe title="Center map" src={mapEmbed} className="w-full h-full border-0" loading="lazy" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
