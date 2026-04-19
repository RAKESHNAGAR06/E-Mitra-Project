let twilioClient;

function getTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (!twilioClient) {
    // eslint-disable-next-line global-require
    twilioClient = require("twilio")(sid, token);
  }
  return twilioClient;
}

/**
 * Sends a WhatsApp message to the admin number (Twilio WhatsApp sandbox / approved sender).
 * No-ops when Twilio or numbers are not configured.
 */
async function notifyAdminNewServiceRequest(payload) {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.ADMIN_WHATSAPP_TO;
  if (!from || !to) return { skipped: true, reason: "missing_twilio_or_numbers" };

  const client = getTwilio();
  if (!client) return { skipped: true, reason: "missing_twilio_credentials" };

  const lines = [
    "New e-Mitra service request",
    `Service: ${payload.serviceName || "-"}`,
    `User: ${payload.contactName || "-"} (${payload.contactMobile || "-"})`,
    `Payment: ${payload.paymentStatus || "pending"}`,
    payload.message ? `Message: ${payload.message}` : null,
  ].filter(Boolean);

  const body = lines.join("\n");

  await client.messages.create({
    from: `whatsapp:${from.replace(/^whatsapp:/, "")}`,
    to: `whatsapp:${to.replace(/^whatsapp:/, "")}`,
    body,
  });

  return { sent: true };
}

module.exports = { notifyAdminNewServiceRequest };
