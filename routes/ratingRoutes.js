const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

router.post("/:movieId", async (req, res) => {
  try {
    const { rating } = req.body;
    const { movieId } = req.params;

    // 🔥 REAL CLIENT IP GET
    let ipAddress =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    if (ipAddress?.includes(",")) {
      ipAddress = ipAddress.split(",")[0];
    }

    ipAddress = ipAddress?.replace("::ffff:", "");

    // 🔥 DUPLICATE CHECK
    const existing = await Rating.findOne({
      movieId,
      ipAddress,
    });

    if (existing) {
      return res.json({ message: "You already rated this movie" });
    }

    // SAVE
    await Rating.create({
      movieId,
      rating,
      ipAddress,
    });

    // UPDATE AVG
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