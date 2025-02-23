const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path"); // ✅ Import path module
const userRoutes = require("./routes/userRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

dotenv.config();

// ✅ Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files (fix error by moving after app is initialized)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Use Routes
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ✅ Test API Route
app.get("/", (req, res) => {
  res.send("Fitness Challenge API is Running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
