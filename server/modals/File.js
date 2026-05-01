const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },

  fileUrl: String,

  fileType: String,
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);