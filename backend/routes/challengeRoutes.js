// routes/challengeRoutes.js
const express = require("express");
const Challenge = require("../models/Challenge");
const router = express.Router();

// Create a new challenge
router.post("/", async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ error: "Error creating challenge" });
  }
});

// Get all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find().populate("creator", "username");
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Error fetching challenges" });
  }
});

// Submit a challenge attempt
router.post("/:id/attempt", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    challenge.attempts.push({
      user: req.body.userId,
      videoUrl: req.body.videoUrl,
    });
    
    await challenge.save();
    res.json({ message: "Challenge attempt recorded!" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting attempt" });
  }
});

module.exports = router;
