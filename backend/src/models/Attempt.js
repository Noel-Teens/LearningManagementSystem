const mongoose = require("mongoose");

const AttemptSchema = new mongoose.Schema({
  score: Number,
  total: Number,
  takenAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "Attempt",
  AttemptSchema
);
