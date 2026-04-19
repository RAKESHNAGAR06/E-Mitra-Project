const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

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

function publicUserPayload(user) {
  return {
    id: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name || "",
    phone: user.phone || "",
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      role: "user",
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : "",
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: publicUserPayload(user) });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      token,
      user: publicUserPayload(user),
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub).select("email role name phone");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: publicUserPayload(user) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load profile" });
  }
});

module.exports = router;
