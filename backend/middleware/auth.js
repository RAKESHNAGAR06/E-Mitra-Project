const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return secret;
}

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, getJwtSecret());
    req.auth = payload; // { sub, role, email, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  const allowed = new Set(roles);
  return (req, res, next) => {
    if (!req.auth?.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!allowed.has(req.auth.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

function requireCustomer(req, res, next) {
  if (!req.auth?.role) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.auth.role !== "user") {
    return res.status(403).json({ error: "Customer account required" });
  }
  return next();
}

module.exports = { requireAuth, requireRole, requireCustomer };
