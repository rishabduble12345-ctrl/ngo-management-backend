const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

router.post("/:itemId", async (req, res) => {
  try {
    const { rating } = req.body;
    const { itemId } = req.params;

    // ⭐ VALIDATION
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Invalid rating" });

    // ⭐ REAL CLIENT IP
    let ipAddress =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown";

    if (ipAddress.includes(",")) {
      ipAddress = ipAddress.split(",")[0];
    }

    ipAddress = ipAddress.replace("::ffff:", "");

    // ⭐ DUPLICATE CHECK
    const existing = await Rating.findOne({
      itemId,
      ipAddress,
    });

    if (existing) {
      return res.json({ message: "You already rated this item ✔" });
    }

    // ⭐ SAVE RATING
    await Rating.create({
      itemId,
      rating,
      ipAddress,
    });

    // ⭐ UPDATE AVG
    const ratings = await Rating.find({ itemId });

    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings;

    await Movie.findByIdAndUpdate(itemId, {
      totalRatings,
      averageRating: Number(averageRating.toFixed(1)),
    });

    res.json({ message: "Rating submitted successfully ⭐" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;