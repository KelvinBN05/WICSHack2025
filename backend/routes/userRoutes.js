// routes/userRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
  console.log("login request received", req.body);
  try {
    const { uid, username, email, profilePicture, bio } = req.body;
    //check if user already exists
    let newUser = await User.findOne({ uid })
    // Check if user already exists
    if (!newUser) {
      newUser = new User({ uid, username, email, profilePicture, bio });
      await newUser.save();
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error); // <-- Add this line to log errors
    res.status(500).json({ error: "Error creating user", details: error.message });
  }
});

// Fetch user profile using username
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find user by `username` instead of `_id`
    const user = await User.findOne({ username }).populate("completedChallenges");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("🔥 Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});


// Update profile (username, bio, profile picture)
// ✅ UPDATE User Profile (Allow Bio & Profile Picture Updates)
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { bio, profilePicture } = req.body;

    console.log("🔍 Received request to update:", username, bio, profilePicture); // ✅ Debugging Log

    // ✅ Check if user exists before updating
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      console.error("🚨 User not found:", username);
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Update user
    existingUser.bio = bio || existingUser.bio;
    existingUser.profilePicture = profilePicture || existingUser.profilePicture;

    await existingUser.save(); // ✅ Save the updated user

    console.log("✅ User updated successfully:", existingUser);

    res.json({ message: "Profile updated successfully", user: existingUser });
  } catch (error) {
    console.error("🔥 Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile", details: error.message });
  }
});

module.exports = router;


