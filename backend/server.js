// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const authRoutes = require("./routes/auth");
const adminUsersRoutes = require("./routes/adminUsers");
const serviceRequestsRoutes = require("./routes/serviceRequests");
const paymentsRoutes = require("./routes/payments");
const siteSettingsRoutes = require("./routes/siteSettings");
const { ensureUniqueSlug } = require("./utils/serviceSlug");
const { requireAuth, requireRole } = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.json()); // JSON data parse karne ke liye
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow curl / server-to-server / same-origin
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);
 // React se connection allow karne ke liye

// MongoDB Connection
// Yahan apni MongoDB URI daal (Local ya Atlas)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/emitraDB')
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

async function ensureSuperAdmin() {
  const email = (process.env.SUPERADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.SUPERADMIN_PASSWORD || "";

  if (!email || !password) return;

  const existing = await User.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: "superadmin" });
  console.log("✅ Superadmin created from env:", email);
}

// --- MONGODB SCHEMA (MODEL) ---
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, default: "₹0" },
  icon: { type: String, default: "FaFileAlt" }, // Icon ka naam store karenge
  status: { type: String, default: "Active" },
  slug: { type: String, default: "", index: true },
  /** Long-form copy for the public “About this service” section */
  aboutContent: { type: String, default: "" },
  processingTime: { type: String, default: "7 - 10 working days" },
  steps: { type: [String], default: [] },
  documents: { type: [String], default: [] },
  /** Optional direct link for “Download form” */
  formUrl: { type: String, default: "" },
  nameHi: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Service = mongoose.model('Service', serviceSchema);

async function backfillServiceSlugs() {
  const list = await Service.find({ $or: [{ slug: "" }, { slug: null }] }).select("_id name slug");
  for (const s of list) {
    try {
      const slug = await ensureUniqueSlug(Service, s.name, null, s._id);
      await Service.updateOne({ _id: s._id }, { $set: { slug } });
    } catch (e) {
      console.warn("Slug backfill skip:", String(s._id), e?.message || e);
    }
  }
}

mongoose.connection.once("open", () => {
  ensureSuperAdmin().catch((e) => console.log("❌ Superadmin seed failed:", e?.message || e));
  backfillServiceSlugs().catch((e) => console.log("❌ Service slug backfill failed:", e?.message || e));
});

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/service-requests", serviceRequestsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

// 1. Get All Services (Read)
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// 1b. Public service detail by Mongo id or URL slug (must be registered before /:id CRUD if overlapping)
app.get("/api/services/detail/:identifier", async (req, res) => {
  try {
    const raw = String(req.params.identifier || "").trim();
    if (!raw) return res.status(400).json({ error: "Missing identifier" });

    const isObjectId = /^[a-f0-9]{24}$/i.test(raw);
    const doc = isObjectId
      ? await Service.findById(raw).lean()
      : await Service.findOne({ slug: raw }).lean();

    if (!doc) return res.status(404).json({ error: "Service not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load service" });
  }
});

// 2. Add New Service (Create)
app.post('/api/services', requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  try {
    const body = { ...(req.body || {}) };
    const slug = await ensureUniqueSlug(Service, body.name, body.slug, null);
    body.slug = slug;
    const newService = new Service(body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(400).json({ error: "Failed to add service" });
  }
});

// 3. Update Service (Update)
app.put('/api/services/:id', requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const prev = existing.toObject();
    const incoming = { ...(req.body || {}) };
    delete incoming._id;
    const merged = { ...prev, ...incoming };
    merged.slug = await ensureUniqueSlug(Service, merged.name, merged.slug, existing._id);

    const updatedService = await Service.findByIdAndUpdate(req.params.id, merged, { new: true });
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ error: "Failed to update service" });
  }
});

// 4. Delete Service (Delete)
app.delete('/api/services/:id', requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete service" });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});