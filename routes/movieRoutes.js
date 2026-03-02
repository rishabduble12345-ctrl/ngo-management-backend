const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// GET movies or anime
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    let data;

    // ⭐ ONLY valid types filter
    if (type === "movie" || type === "anime") {
      data = await Movie.find({ type }).sort({ _id: -1 });
    } else {
      data = await Movie.find().sort({ _id: -1 });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;