// routes/leaderboardRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get leaderboard (sorted by completed challenges)
router.get("/", async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ completedChallenges: -1 })
      .select("username completedChallenges")
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

module.exports = router;