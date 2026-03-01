const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

router.post("/:movieId", async (req, res) => {
  try {
    const { rating } = req.body;
    const { movieId } = req.params;

    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Save rating
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
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already rated this movie" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;