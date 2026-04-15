const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Superadmin-only: create an admin
router.post("/users", requireAuth, requireRole("superadmin"), async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    const finalRole = role || "admin";

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    if (!["admin", "superadmin"].includes(finalRole)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ email: normalizedEmail, passwordHash, role: finalRole });

    return res.status(201).json({
      user: { id: String(user._id), email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// Superadmin-only: list admins
router.get("/users", requireAuth, requireRole("superadmin"), async (req, res) => {
  try {
    const users = await User.find().select("_id email role createdAt updatedAt").sort({ createdAt: -1 });
    return res.json({
      users: users.map((u) => ({
        id: String(u._id),
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
