const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24, // 🔥 auto delete after 1 day
    },
  }
);

module.exports = mongoose.model("Blacklist", blacklistSchema);