// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
