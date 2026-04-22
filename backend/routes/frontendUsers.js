const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function toDto(u) {
  return {
    id: String(u._id),
    email: u.email,
    role: u.role,
    name: u.name || "",
    phone: u.phone || "",
    blocked: Boolean(u.blocked),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

// List frontend users (normal login users)
router.get("/frontend", requireAuth, requireRole("admin", "superadmin"), async (_req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();
    return res.json({ users: users.map((u) => toDto(u)) });
  } catch (e) {
    return res.status(500).json({ error: "Failed to load users" });
  }
});

// Update normal user controls (edit/block)
router.patch("/:id", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!/^[a-f0-9]{24}$/i.test(id)) return res.status(400).json({ error: "Invalid id" });

    const body = req.body || {};
    const patch = {};
    const isSuperAdmin = req.auth?.role === "superadmin";

    // Only superadmin can change user details (email/name/phone/password). Admin can only block/unblock.
    if (isSuperAdmin) {
      if (body.email !== undefined) patch.email = String(body.email || "").toLowerCase().trim();
      if (body.name !== undefined) patch.name = String(body.name || "").trim();
      if (body.phone !== undefined) patch.phone = String(body.phone || "").trim();
      if (body.password !== undefined) {
        const pw = String(body.password || "");
        if (!pw) return res.status(400).json({ error: "password cannot be empty" });
        patch.passwordHash = await bcrypt.hash(pw, 10);
      }
    }
    if (body.blocked !== undefined) patch.blocked = Boolean(body.blocked);

    // Prevent changing role through this endpoint
    delete patch.role;
    // role is immutable here; passwordHash only via superadmin logic above
    delete patch.role;

    const updated = await User.findOneAndUpdate(
      { _id: id, role: "user" },
      { $set: patch },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json({ user: toDto(updated) });
  } catch (e) {
    const msg = String(e?.message || "");
    if (msg.includes("E11000")) return res.status(409).json({ error: "Email already exists" });
    return res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;

