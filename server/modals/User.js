const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "admin",
    },

    isApproved: {
      type: Boolean,
      default: false,   // 🔥 main logic
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Add these two fields for password reset
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);