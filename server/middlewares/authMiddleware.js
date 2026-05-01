// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const Blacklist = require("../modals/Blacklist");


// ─────────────────────────────────────────────────────────────────────
// 🔐 AUTH MIDDLEWARE — verify JWT + check blacklist
// ─────────────────────────────────────────────────────────────────────
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please login.",
      });
    }

    // Check blacklist (logged-out tokens)
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// ─────────────────────────────────────────────────────────────────────
// 🟡 USER ONLY
// ─────────────────────────────────────────────────────────────────────
exports.isUser = (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This route is for Users only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Role verification failed" });
  }
};


// ─────────────────────────────────────────────────────────────────────
// 🟢 ADMIN ONLY
// ─────────────────────────────────────────────────────────────────────
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This route is for Admins only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Role verification failed" });
  }
};


// ─────────────────────────────────────────────────────────────────────
// 🔴 SUPER ADMIN ONLY
// ─────────────────────────────────────────────────────────────────────
exports.isSuperAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This route is for Super Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Role verification failed" });
  }
};


// ─────────────────────────────────────────────────────────────────────
// 🔵 ADMIN OR SUPER ADMIN
// ─────────────────────────────────────────────────────────────────────
exports.isAdminOrSuperAdmin = (req, res, next) => {
  try {
    if (!["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins and Super Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Role verification failed" });
  }
};