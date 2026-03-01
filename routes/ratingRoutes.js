const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

router.post("/:movieId", async (req, res) => {
  try {
    const { rating } = req.body;
    const { movieId } = req.params;

    // Get user IP
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    // 🔥 CHECK if this IP already rated this movie
    const existingRating = await Rating.findOne({
      movieId,
      ipAddress,
    });

    if (existingRating) {
      return res.json({ message: "You already rated this movie" });
    }

    // Save new rating
    await Rating.create({
      movieId,
      rating,
      ipAddress,
    });

    // Recalculate average
    const ratings = await Rating.find({ movieId });

    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings;

    await Movie.findByIdAndUpdate(movieId, {
      totalRatings,
      averageRating,
    });

    res.json({ message: "Rating submitted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;