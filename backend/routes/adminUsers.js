const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing in environment variables");

  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

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
    const users = await User.find({ role: { $in: ["admin", "superadmin"] } })
      .select("_id email role createdAt updatedAt")
      .sort({ createdAt: -1 });
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

// Admins can edit their own details; password changes are superadmin-only.
// Superadmin can edit any user (email/role/password).
router.put("/users/:id", requireAuth, requireRole("admin", "superadmin"), async (req, res) => {
  try {
    const targetId = String(req.params.id || "");
    const actorRole = req.auth?.role;
    const actorId = String(req.auth?.sub || "");

    if (!targetId) return res.status(400).json({ error: "Missing user id" });

    const { email, role, password } = req.body || {};
    const isSuperAdmin = actorRole === "superadmin";
    const isSelf = actorId && actorId === targetId;

    if (!isSuperAdmin && !isSelf) {
      return res.status(403).json({ error: "You can only edit your own account" });
    }

    if (!isSuperAdmin && typeof role !== "undefined") {
      return res.status(403).json({ error: "Only superadmin can change role" });
    }

    if (!isSuperAdmin && typeof password !== "undefined") {
      return res.status(403).json({ error: "Only superadmin can change password" });
    }

    const update = {};

    if (typeof email !== "undefined") {
      const normalizedEmail = String(email).toLowerCase().trim();
      if (!normalizedEmail) return res.status(400).json({ error: "email cannot be empty" });

      const existing = await User.findOne({ email: normalizedEmail }).select("_id");
      if (existing && String(existing._id) !== targetId) {
        return res.status(409).json({ error: "Email already in use" });
      }

      update.email = normalizedEmail;
    }

    if (typeof role !== "undefined") {
      if (!["admin", "superadmin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      update.role = role;
    }

    if (typeof password !== "undefined") {
      const pw = String(password);
      if (!pw) return res.status(400).json({ error: "password cannot be empty" });
      update.passwordHash = await bcrypt.hash(pw, 10);
    }

    const user = await User.findByIdAndUpdate(targetId, update, { new: true }).select("_id email role");
    if (!user) return res.status(404).json({ error: "User not found" });

    const response = {
      user: { id: String(user._id), email: user.email, role: user.role },
    };

    // If you edited yourself, return a refreshed token so frontend stays consistent.
    if (isSelf) {
      response.token = signToken(user);
    }

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
