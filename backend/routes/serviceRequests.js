const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const ServiceRequest = require("../models/ServiceRequest");
const { requireAuth, requireRole, requireCustomer } = require("../middleware/auth");
const { feeTextToPaise } = require("../utils/feeToPaise");
const { notifyAdminNewServiceRequest } = require("../utils/whatsappNotify");

const router = express.Router();

const UPLOAD_ROOT = path.join(__dirname, "..", "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, UPLOAD_ROOT);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "") || "";
    const safeExt = ext.match(/^\.(jpe?g|png|pdf|webp)$/i) ? ext.toLowerCase() : "";
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const okMime = ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.mimetype);
    const ext = path.extname(file.originalname || "").toLowerCase().slice(1);
    const okExt = ["jpeg", "jpg", "png", "webp", "pdf"].includes(ext);
    if (okMime && okExt) return cb(null, true);
    cb(new Error("Only JPG, PNG, WEBP, or PDF files up to 5MB are allowed"));
  },
});

router.post(
  "/",
  requireAuth,
  requireCustomer,
  (req, res, next) => {
    upload.single("document")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "File upload failed" });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "A document (JPG, PNG, WEBP, or PDF) is required" });
      }

      const {
        serviceName,
        serviceCategory,
        serviceFeeText,
        serviceSlug,
        contactName,
        contactMobile,
        message,
      } = req.body || {};

      if (!serviceName || !String(serviceName).trim()) {
        return res.status(400).json({ error: "Service name is required" });
      }
      if (!contactName || !String(contactName).trim()) {
        return res.status(400).json({ error: "Name is required" });
      }
      if (!contactMobile || !/^[6-9]\d{9}$/.test(String(contactMobile).replace(/\s/g, ""))) {
        return res.status(400).json({ error: "Valid 10-digit Indian mobile number is required" });
      }

      const mobile = String(contactMobile).replace(/\s/g, "");
      const amountPaise = feeTextToPaise(serviceFeeText);

      const attachment = req.file
        ? {
            originalName: req.file.originalname,
            storedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
          }
        : undefined;

      const doc = await ServiceRequest.create({
        user: req.auth.sub,
        serviceName: String(serviceName).trim(),
        serviceCategory: serviceCategory ? String(serviceCategory).trim() : "",
        serviceFeeText: serviceFeeText ? String(serviceFeeText).trim() : "",
        serviceSlug: serviceSlug ? String(serviceSlug).trim() : "",
        contactName: String(contactName).trim(),
        contactMobile: mobile,
        message: message ? String(message).trim() : "",
        attachment,
        amountPaise,
        paymentStatus: "pending",
        adminStatus: "Pending",
      });

      try {
        await notifyAdminNewServiceRequest({
          serviceName: doc.serviceName,
          contactName: doc.contactName,
          contactMobile: doc.contactMobile,
          paymentStatus: doc.paymentStatus,
          message: doc.message,
        });
      } catch (e) {
        console.warn("WhatsApp notify failed:", e?.message || e);
      }

      return res.status(201).json({
        serviceRequest: formatRequest(doc, req),
      });
    } catch (err) {
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (_) {
          /* ignore */
        }
      }
      return res.status(500).json({ error: "Could not create service request" });
    }
  }
);

router.get("/my", requireAuth, requireCustomer, async (req, res) => {
  try {
    const list = await ServiceRequest.find({ user: req.auth.sub })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      requests: list.map((r) => formatLean(r, req)),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load requests" });
  }
});

router.get("/:id/attachment", requireAuth, async (req, res) => {
  try {
    const doc = await ServiceRequest.findById(req.params.id).lean();
    if (!doc || !doc.attachment?.storedName) {
      return res.status(404).json({ error: "File not found" });
    }

    const isOwner = String(doc.user) === String(req.auth.sub);
    const isStaff = ["admin", "superadmin"].includes(req.auth.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const abs = path.join(UPLOAD_ROOT, path.basename(doc.attachment.storedName));
    if (!abs.startsWith(UPLOAD_ROOT) || !fs.existsSync(abs)) {
      return res.status(404).json({ error: "File missing on server" });
    }

    res.setHeader("Content-Type", doc.attachment.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(doc.attachment.originalName || "document")}"`);
    return fs.createReadStream(abs).pipe(res);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read file" });
  }
});

router.get("/", requireAuth, requireRole("admin", "superadmin"), async (_req, res) => {
  try {
    const list = await ServiceRequest.find()
      .populate("user", "email name phone role")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      requests: list.map((r) => ({
        ...formatLean(r, null),
        user: r.user
          ? {
              id: String(r.user._id),
              email: r.user.email,
              name: r.user.name,
              phone: r.user.phone,
              role: r.user.role,
            }
          : null,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load requests" });
  }
});

router.patch("/:id", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  try {
    const { adminStatus } = req.body || {};
    const allowed = ["Pending", "In Progress", "Completed", "Rejected"];
    if (!adminStatus || !allowed.includes(adminStatus)) {
      return res.status(400).json({ error: "Invalid adminStatus" });
    }

    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { adminStatus },
      { new: true }
    )
      .populate("user", "email name phone role")
      .lean();

    if (!updated) return res.status(404).json({ error: "Not found" });

    return res.json({
      request: {
        ...formatLean(updated, null),
        user: updated.user
          ? {
              id: String(updated.user._id),
              email: updated.user.email,
              name: updated.user.name,
              phone: updated.user.phone,
              role: updated.user.role,
            }
          : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Update failed" });
  }
});

function formatRequest(doc, req) {
  const o = doc.toObject ? doc.toObject() : doc;
  return formatLean(o, req);
}

function formatLean(o, req) {
  let apiBase = (process.env.PUBLIC_API_URL || "").replace(/\/$/, "");
  if (!apiBase && req?.get) {
    apiBase = `${req.protocol}://${req.get("host")}`;
  }
  if (!apiBase) apiBase = "http://localhost:5000";
  return {
    id: String(o._id),
    serviceName: o.serviceName,
    serviceCategory: o.serviceCategory,
    serviceFeeText: o.serviceFeeText,
    serviceSlug: o.serviceSlug,
    contactName: o.contactName,
    contactMobile: o.contactMobile,
    message: o.message,
    attachment: o.attachment
      ? {
          originalName: o.attachment.originalName,
          mimeType: o.attachment.mimeType,
          size: o.attachment.size,
          url: `${apiBase}/api/service-requests/${o._id}/attachment`,
        }
      : null,
    amountPaise: o.amountPaise,
    paymentStatus: o.paymentStatus,
    adminStatus: o.adminStatus,
    razorpayOrderId: o.razorpayOrderId || "",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

module.exports = router;
