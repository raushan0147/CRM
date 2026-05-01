const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["admin", "superadmin", "all"],
      required: true,
      default: "all",
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);