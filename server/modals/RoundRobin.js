// modals/RoundRobin.js
const mongoose = require("mongoose");

/**
 * Single-document collection that tracks the global round-robin counter.
 *
 * key: fixed singleton identifier ("round_robin")
 * lastIndex: the index of the last admin that was assigned a lead.
 *
 * We use findOneAndUpdate + $inc to atomically bump lastIndex
 * so concurrent requests cannot collide.
 */
const roundRobinSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "round_robin",
      unique: true,
    },

    lastIndex: {
      type: Number,
      default: -1, // start at -1 so first assignment yields index 0
    },
  },
  { timestamps: true }
);

/**
 * Atomically increment the counter and return the NEW document.
 * Creates the document if it doesn't exist yet (upsert: true).
 *
 * @returns {Promise<{ lastIndex: number }>}
 */
roundRobinSchema.statics.getNextIndex = async function () {
  const doc = await this.findOneAndUpdate(
    { key: "round_robin" },
    { $inc: { lastIndex: 1 } },
    { new: true, upsert: true }
  );
  return doc.lastIndex;
};

module.exports = mongoose.model("RoundRobin", roundRobinSchema);
