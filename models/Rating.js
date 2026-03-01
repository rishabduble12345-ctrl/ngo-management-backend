const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 IMPORTANT — duplicate rating rokne ke liye
ratingSchema.index(
  { movieId: 1, ipAddress: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rating", ratingSchema);