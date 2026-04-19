/**
 * Derive Razorpay amount (paise) from fee text like "₹50 per update" or "50".
 * Falls back to DEFAULT_SERVICE_AMOUNT_RUPEES env (default 50).
 */
function feeTextToPaise(feeText) {
  const defaultRupees = Number(process.env.DEFAULT_SERVICE_AMOUNT_RUPEES || 50);
  const safeDefault = Number.isFinite(defaultRupees) && defaultRupees > 0 ? defaultRupees : 50;

  if (feeText == null || String(feeText).trim() === "") {
    return Math.round(safeDefault * 100);
  }

  const m = String(feeText).match(/(\d+(?:\.\d+)?)/);
  if (m) {
    const rupees = parseFloat(m[1]);
    if (Number.isFinite(rupees) && rupees > 0) {
      return Math.max(100, Math.round(rupees * 100));
    }
  }

  return Math.round(safeDefault * 100);
}

module.exports = { feeTextToPaise };
