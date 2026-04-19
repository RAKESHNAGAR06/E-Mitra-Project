import { loadRazorpayScript } from "./razorpayClient";

/**
 * Opens Razorpay checkout for a service request, verifies on the server, returns { ok: true } or throws.
 */
export async function startRazorpayPayment({
  apiBase,
  getAuthHeader,
  serviceRequest,
  prefillEmail,
  prefillContact,
  onVerified,
}) {
  const id = serviceRequest?.id;
  if (!id) throw new Error("Missing request");

  const orderRes = await fetch(`${apiBase}/payments/razorpay/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ serviceRequestId: id }),
  });
  const orderData = await orderRes.json().catch(() => ({}));
  if (orderRes.status === 503) {
    throw new Error(
      "Payment gateway is not configured on the server. Add Razorpay keys in backend .env (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)."
    );
  }
  if (!orderRes.ok) throw new Error(orderData?.error || "Could not start payment");

  const ok = await loadRazorpayScript();
  if (!ok || typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Could not load Razorpay checkout.");
  }

  return await new Promise((resolve, reject) => {
    const options = {
      key: orderData.keyId,
      order_id: orderData.orderId,
      currency: orderData.currency || "INR",
      name: "e-Mitra",
      description: serviceRequest.serviceName || "Service fee",
      handler: async (response) => {
        try {
          const verifyRes = await fetch(`${apiBase}/payments/razorpay/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({
              serviceRequestId: id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok) throw new Error(verifyData?.error || "Verification failed");
          if (typeof onVerified === "function") onVerified();
          resolve({ ok: true });
        } catch (e) {
          reject(e);
        }
      },
      modal: {
        ondismiss: () => resolve({ dismissed: true }),
      },
      prefill: {
        email: prefillEmail || undefined,
        contact: prefillContact || undefined,
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => reject(new Error("Payment failed or was cancelled.")));
    rzp.open();
  });
}
