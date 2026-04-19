const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const ServiceRequest = require("../models/ServiceRequest");
const { requireAuth, requireCustomer } = require("../middleware/auth");

const router = express.Router();

router.post("/razorpay/order", requireAuth, requireCustomer, async (req, res) => {
  try {
    const { serviceRequestId } = req.body || {};
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(503).json({ error: "Payment gateway not configured" });
    }

    if (!serviceRequestId) {
      return res.status(400).json({ error: "serviceRequestId is required" });
    }

    const doc = await ServiceRequest.findById(serviceRequestId);
    if (!doc || String(doc.user) !== String(req.auth.sub)) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (doc.paymentStatus === "paid") {
      return res.status(400).json({ error: "Already paid" });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: doc.amountPaise,
      currency: "INR",
      receipt: `sr_${String(doc._id).slice(-18)}`,
      notes: { serviceRequestId: String(doc._id) },
    });

    doc.razorpayOrderId = order.id;
    await doc.save();

    return res.json({
      orderId: order.id,
      amountPaise: doc.amountPaise,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("Razorpay order error:", err?.message || err);
    return res.status(500).json({ error: "Could not create payment order" });
  }
});

router.post("/razorpay/verify", requireAuth, requireCustomer, async (req, res) => {
  try {
    const { serviceRequestId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(503).json({ error: "Payment gateway not configured" });
    }

    if (!serviceRequestId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
    if (expected !== String(razorpay_signature)) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const doc = await ServiceRequest.findById(serviceRequestId);
    if (!doc || String(doc.user) !== String(req.auth.sub)) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (doc.razorpayOrderId && doc.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ error: "Order mismatch" });
    }

    doc.paymentStatus = "paid";
    doc.razorpayPaymentId = razorpay_payment_id;
    doc.paymentMeta = { verifiedAt: new Date().toISOString() };
    await doc.save();

    return res.json({
      success: true,
      serviceRequest: { id: String(doc._id), paymentStatus: doc.paymentStatus },
    });
  } catch (err) {
    console.error("Razorpay verify error:", err?.message || err);
    return res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
