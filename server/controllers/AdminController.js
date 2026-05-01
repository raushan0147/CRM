// controllers/AdminController.js
const User = require("../modals/User");


// ─── Get all admins ──────────────────────────────────────────────
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");

    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("getAllAdmins Error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ─── Approve admin ───────────────────────────────────────────────
exports.approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOneAndUpdate(
      { _id: id, role: "admin" },
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin approved successfully",
      admin,
    });
  } catch (error) {
    console.error("approveAdmin Error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ─── Deactivate admin (removes from round-robin) ─────────────────
exports.deactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOneAndUpdate(
      { _id: id, role: "admin" },
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin deactivated. They will no longer receive new leads.",
      admin,
    });
  } catch (error) {
    console.error("deactivateAdmin Error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ─── Activate admin (re-enters round-robin) ──────────────────────
exports.activateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOneAndUpdate(
      { _id: id, role: "admin" },
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin activated. They will be included in lead assignment.",
      admin,
    });
  } catch (error) {
    console.error("activateAdmin Error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};