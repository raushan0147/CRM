const Lead = require("../modals/Lead");
const mailSender = require("../utils/mailSender");
const Notification = require("../modals/Notification");

// ════════════════════════════════════════════════════════════════
// CREATE LEAD
// Actor: public user or admin
// ════════════════════════════════════════════════════════════════
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "name, email, and phone are required",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      message: message || '',
      status: 'new'
    });

    // Notify all admins and superadmins
    try {
      await Notification.create({
        title: "New Lead Received",
        message: `${name} has submitted a new lead inquiry.`,
        recipientRole: "all"
      });
    } catch (err) {
      console.error("Notification creation failed:", err);
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("createLead Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
    });
  }
};

// ════════════════════════════════════════════════════════════════
// GET ALL LEADS
// Actor: Admin / Super Admin (Any admin can see all leads)
// ════════════════════════════════════════════════════════════════
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("getAllLeads Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

// ════════════════════════════════════════════════════════════════
// UPDATE LEAD STATUS
// Actor: Admin
// ════════════════════════════════════════════════════════════════
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const VALID_STATUSES = ["new", "contacted", "closed", "converted"];
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Send email notification to user asynchronously
    try {
      const emailTitle = `LeadMaster Update: Your Inquiry Status is now ${status.toUpperCase()}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4F46E5;">Status Update on Your Inquiry</h2>
          <p>Hi <b>${lead.name}</b>,</p>
          <p>This is an automated notification to inform you that your lead status has been updated to: 
          <strong style="color: #4F46E5;">${status.toUpperCase()}</strong>.</p>
          <p>We'll continue to keep you updated. If you have any further questions, please reply to this email or call us.</p>
          <p>Best Regards,<br>The LeadMaster Team</p>
        </div>
      `;
      mailSender(lead.email, emailTitle, emailBody).catch(console.error); // Do not block request
    } catch (err) {
      console.error("Failed to queue email:", err);
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated and email sent",
      lead,
    });
  } catch (error) {
    console.error("updateLeadStatus Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lead status",
    });
  }
};

// ════════════════════════════════════════════════════════════════
// DELETE LEAD
// Actor: Admin
// ════════════════════════════════════════════════════════════════
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("deleteLead Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
    });
  }
};
