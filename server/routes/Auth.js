const express = require("express");
const router = express.Router();

const {
  sendOTP,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  registerUser,
} = require("../controllers/Auth");

const { auth, isAdmin } = require("../middlewares/authMiddleware");

// ─── Public routes ─────────────────────────────────────────────────────
router.post("/send-otp",       sendOTP);
router.post("/signup",         signup);           // Admin signup (OTP-based)
router.post("/register-user",  registerUser);     // User signup (no OTP)
router.post("/login",          login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ─── Protected routes ──────────────────────────────────────────────────
router.post("/logout",          auth,          logout);
router.post("/change-password", auth, isAdmin, changePassword);

module.exports = router;