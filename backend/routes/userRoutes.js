// routes/userRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, email, profilePicture, bio } = req.body;
    const newUser = new User({ username, email, profilePicture, bio });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Fetch user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("completedChallenges");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "User not found" });
  }
});

// Update profile (username, bio, profile picture)
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Could not update profile" });
  }
});

module.exports = router;
