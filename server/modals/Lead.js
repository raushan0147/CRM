// modals/Lead.js
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Lead phone is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["new", "contacted", "closed", "converted"],
        message: "Status must be one of: new, contacted, closed, converted",
      },
      default: "new",
    },

    message: {
      type: String,
      trim: true,
      default: ""
    },

    // Admin this lead is assigned to (No longer required)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // User who created the lead (No longer required string)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true }
);

// Index for fast per-admin queries
leadSchema.index({ assignedTo: 1, createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);