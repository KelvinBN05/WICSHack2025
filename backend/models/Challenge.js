const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  username: { type: String, required: true },
  category: { type: String, required: false }, 
  description: { type: String, required: false } 
}, { timestamps: true });

module.exports = mongoose.model("Challenge", ChallengeSchema);
