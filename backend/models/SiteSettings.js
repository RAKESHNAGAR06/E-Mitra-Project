const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    visitCenterUrl: { type: String, default: "" },
    mapLatitude: { type: String, default: "24.4339432" },
    mapLongitude: { type: String, default: "75.9863679" },
    address: { type: String, default: "" },
    phoneDisplay: { type: String, default: "" },
    phoneSecondary: { type: String, default: "" },
    email: { type: String, default: "" },
    workingHours: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },

    footerQuickLinks: {
      type: [
        {
          label: { type: String, default: "" },
          hindi: { type: String, default: "" },
          path: { type: String, default: "" },
        },
      ],
      default: [],
    },
    footerMenuLinks: {
      type: [
        {
          label: { type: String, default: "" },
          path: { type: String, default: "" },
        },
      ],
      default: [],
    },
    footerSocial: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
