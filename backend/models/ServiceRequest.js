const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    originalName: { type: String, default: "" },
    storedName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

const serviceRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceName: { type: String, required: true, trim: true },
    serviceCategory: { type: String, default: "", trim: true },
    serviceFeeText: { type: String, default: "", trim: true },
    serviceSlug: { type: String, default: "", trim: true },
    contactName: { type: String, required: true, trim: true },
    contactMobile: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },
    attachment: { type: attachmentSchema, default: undefined },
    amountPaise: { type: Number, required: true, min: 100 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    adminStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Rejected"],
      default: "Pending",
      index: true,
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    paymentMeta: { type: mongoose.Schema.Types.Mixed, default: undefined },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
