const express = require("express");
const Challenge = require("../models/Challenge");

const router = express.Router();

//  GET all challenges (FIX for "Cannot GET /api/challenges")
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Error fetching challenges" });
  }
});

//  POST new challenge
router.post("/", async (req, res) => {
  try {
    const { title, weight, reps, username } = req.body;

    if (!title || !weight || !reps || !username) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newChallenge = new Challenge({ title, weight, reps, username });
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    console.error("🔥 Error creating challenge:", error);
    res.status(500).json({ error: "Error creating challenge", details: error.message });
  }
});

module.exports = router;
