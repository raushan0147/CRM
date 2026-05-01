// routes/LeadRoutes.js
const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/LeadController");

const {
  auth,
  isAdmin,
  isSuperAdmin,
} = require("../middlewares/authMiddleware");

// ─── Public routes ───────────────────────────────────────────────────────
// POST /api/v1/leads/public  →  create a lead (unassigned, public form)
router.post("/public", createLead);

// ─── Admin routes ──────────────────────────────────────────────────────
// GET  /api/v1/leads        →  admin sees all leads
router.get("/", auth, isAdmin, getAllLeads);

// POST /api/v1/leads/create → admin creates a lead
router.post("/create", auth, isAdmin, createLead);

// PUT  /api/v1/leads/:id/status →  admin updates a lead's status
router.put("/:id/status", auth, isAdmin, updateLeadStatus);

// DELETE /api/v1/leads/:id →  admin deletes a lead
router.delete("/:id", auth, isAdmin, deleteLead);

// ─── Super Admin routes ────────────────────────────────────────────────
// GET  /api/v1/leads/all        →  super admin sees all leads (same handler)
router.get("/all", auth, isSuperAdmin, getAllLeads);

module.exports = router;
