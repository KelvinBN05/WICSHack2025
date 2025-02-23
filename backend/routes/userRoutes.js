// routes/userRoutes.js
const express = require("express");
const User = require("../models/User"); // ✅ Import User model
const Challenge = require("../models/Challenge"); // ✅ Import Challenge model (this was missing!)

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


// Fetch user profile
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // ✅ Fetch user by username instead of ID
    const user = await User.findOne({ username }); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Fetch challenges user has completed (assuming `completedBy` field exists)
    const completedChallenges = await Challenge.find({ completedBy: username });

    res.json({
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      completedChallenges,
    });
  } catch (error) {
    console.error("🔥 Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
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
