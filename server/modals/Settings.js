const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  key: String,
  value: String,
});

module.exports = mongoose.model("Settings", settingsSchema);