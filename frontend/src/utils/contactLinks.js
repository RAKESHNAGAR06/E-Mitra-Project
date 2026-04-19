/** Digits only for wa.me */
export function waMeUrl(whatsappNumber) {
  const digits = String(whatsappNumber || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

/** tel: link; 10-digit Indian numbers get +91 */
export function telHref(phoneDisplay) {
  const digits = String(phoneDisplay || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `tel:+91${digits}`;
  return `tel:+${digits}`;
}

export function mapsEmbedSrc(lat, lng) {
  const a = String(lat || "").trim();
  const b = String(lng || "").trim();
  if (!a || !b) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(`${a},${b}`)}&output=embed`;
}

export function mapsDirectionsUrl(lat, lng, fallbackUrl) {
  const u = String(fallbackUrl || "").trim();
  if (u) return u;
  const a = String(lat || "").trim();
  const b = String(lng || "").trim();
  if (!a || !b) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(`${a},${b}`)}`;
}
