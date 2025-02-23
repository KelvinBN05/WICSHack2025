const express = require("express");
const multer = require("multer");
const Attempt = require("../models/Attempt"); // Create Attempt Model
const router = express.Router();

// ✅ Configure Multer for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Handle Attempt Submission
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const { title, weight, reps, caption } = req.body;

    // ✅ Validate Fields
    if (!title || !weight || !reps || !caption || !req.file) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // ✅ Store Attempt
    const newAttempt = new Attempt({
      title,
      weight,
      reps,
      caption,
      video: req.file.buffer, // Store as binary
    });

    await newAttempt.save();
    res.status(201).json({ message: "Attempt uploaded successfully!" });
  } catch (error) {
    console.error("🔥 Error uploading attempt:", error);
    res.status(500).json({ error: "Error uploading attempt" });
  }
});

module.exports = router;
