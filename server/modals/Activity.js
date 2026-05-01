const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },

  action: {
    type: String,
    enum: ["CREATED", "UPDATED", "ASSIGNED", "DELETED"],
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: String,
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);