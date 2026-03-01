const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const movieRoutes = require("./routes/movieRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ IMPORTANT: Images serve karne ke liye
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Movie Rating Backend Running 🚀");
});

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/ratings", ratingRoutes);
app.use(express.static("public"));

// PORT (Render ke liye important)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});