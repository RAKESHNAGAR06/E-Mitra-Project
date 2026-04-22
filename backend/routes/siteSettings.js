const express = require("express");
const SiteSettings = require("../models/SiteSettings");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

const DEFAULTS = {
  visitCenterUrl: "https://www.google.com/maps?q=24.4339432,75.9863679",
  mapLatitude: "24.4339432",
  mapLongitude: "75.9863679",
  address: "Main Market, District Center, Rajasthan - 302001, India",
  phoneDisplay: "+91 98765 43210",
  phoneSecondary: "+91 141 234 5678",
  email: "info@emitra.gov.in",
  workingHours: "Monday - Saturday: 9:00 AM - 6:00 PM\nSunday: Closed",
  whatsappNumber: "919876543210",
  footerQuickLinks: [
    { label: "Home", hindi: "होम", path: "/" },
    { label: "Services", hindi: "सेवाएं", path: "/Services" },
    { label: "About Us", hindi: "बारे में", path: "/About" },
    { label: "Contact", hindi: "संपर्क", path: "/Contact" },
  ],
  footerMenuLinks: [],
  footerSocial: { facebook: "", twitter: "", instagram: "", youtube: "" },
};

async function getOrCreateDoc() {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create({ ...DEFAULTS });
  }
  return doc;
}

function format(doc) {
  const o = doc?.toObject ? doc.toObject() : doc || {};
  return {
    visitCenterUrl: o.visitCenterUrl || DEFAULTS.visitCenterUrl,
    mapLatitude: o.mapLatitude || DEFAULTS.mapLatitude,
    mapLongitude: o.mapLongitude || DEFAULTS.mapLongitude,
    address: o.address || DEFAULTS.address,
    phoneDisplay: o.phoneDisplay || DEFAULTS.phoneDisplay,
    phoneSecondary: o.phoneSecondary || DEFAULTS.phoneSecondary,
    email: o.email || DEFAULTS.email,
    workingHours: o.workingHours || DEFAULTS.workingHours,
    whatsappNumber: o.whatsappNumber || DEFAULTS.whatsappNumber,
    footerQuickLinks:
      Array.isArray(o.footerQuickLinks) && o.footerQuickLinks.length > 0 ? o.footerQuickLinks : DEFAULTS.footerQuickLinks,
    footerMenuLinks: Array.isArray(o.footerMenuLinks) ? o.footerMenuLinks : DEFAULTS.footerMenuLinks,
    footerSocial: o.footerSocial || DEFAULTS.footerSocial,
    updatedAt: o.updatedAt,
  };
}

router.get("/", async (_req, res) => {
  try {
    const doc = await getOrCreateDoc();
    return res.json(format(doc));
  } catch (e) {
    return res.status(500).json({ error: "Could not load site settings" });
  }
});

router.put("/", requireAuth, requireRole("superadmin"), async (req, res) => {
  try {
    const body = req.body || {};
    const allowed = [
      "visitCenterUrl",
      "mapLatitude",
      "mapLongitude",
      "address",
      "phoneDisplay",
      "phoneSecondary",
      "email",
      "workingHours",
      "whatsappNumber",
      "footerQuickLinks",
      "footerMenuLinks",
      "footerSocial",
    ];
    const patch = {};
    for (const k of allowed) {
      if (body[k] === undefined || body[k] === null) continue;
      if (k === "footerQuickLinks" || k === "footerMenuLinks" || k === "footerSocial") {
        patch[k] = body[k];
        continue;
      }
      patch[k] = String(body[k]);
    }

    let doc = await SiteSettings.findOne();
    if (!doc) doc = await SiteSettings.create({ ...DEFAULTS, ...patch });
    else Object.assign(doc, patch);

    await doc.save();
    return res.json(format(doc));
  } catch (e) {
    return res.status(500).json({ error: "Could not save site settings" });
  }
});

module.exports = router;
