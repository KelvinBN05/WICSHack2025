const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

//  Configure Multer for storing profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //  Save files to "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); //  Unique filename
  },
});

//  Multer Middleware
const upload = multer({ storage });

//  Register a New User
router.post("/register", async (req, res) => {
  console.log("🔍 Registration Request Received:", req.body);
  try {
    const { uid, username, email, profilePicture, bio } = req.body;

    //  Check if user already exists
    let newUser = await User.findOne({ uid });

    if (!newUser) {
      newUser = new User({ uid, username, email, profilePicture, bio });
      await newUser.save();
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("🔥 Error creating user:", error);
    res.status(500).json({ error: "Error creating user", details: error.message });
  }
});

//  Fetch User Profile by Username
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    //  Find user by `username`
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

//  Update User Profile (Bio & Profile Picture Upload)
router.put("/:username", upload.single("profilePicture"), async (req, res) => {
  try {
    console.log("🔍 Update Request Received for:", req.params.username);
    console.log("📄 Bio:", req.body.bio);
    console.log("🖼 Profile Picture:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { username } = req.params;
    const bio = req.body.bio;
    const profilePicture = `/uploads/${req.file.filename}`;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    console.log(" Profile Updated Successfully:", user);
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("🔥 Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});



module.exports = router;
