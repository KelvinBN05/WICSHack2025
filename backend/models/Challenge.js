// models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Strength", "Endurance", "Flexibility", "Other"], required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attempts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videoUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String }],
  }],
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
