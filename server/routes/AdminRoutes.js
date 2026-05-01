// routes/AdminRoutes.js
const express = require("express");
const router = express.Router();

const { auth, isSuperAdmin } = require("../middlewares/authMiddleware");
const {
  getAllAdmins,
  approveAdmin,
  deactivateAdmin,
  activateAdmin,
} = require("../controllers/AdminController");

// All routes below require Super Admin authentication
// GET  /api/v1/superAdmin/admins          →  list all admins
router.get("/admins", auth, isSuperAdmin, getAllAdmins);

// PUT  /api/v1/superAdmin/approve/:id     →  approve an admin (allow login)
router.put("/approve/:id",    auth, isSuperAdmin, approveAdmin);

// PUT  /api/v1/superAdmin/deactivate/:id  →  deactivate admin (exclude from round-robin)
router.put("/deactivate/:id", auth, isSuperAdmin, deactivateAdmin);

// PUT  /api/v1/superAdmin/activate/:id   →  re-activate admin
router.put("/activate/:id",   auth, isSuperAdmin, activateAdmin);

module.exports = router;