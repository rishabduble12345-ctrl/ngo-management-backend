const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["movie", "anime"], required: true },
  description: { type: String, required: true },
  posterUrl: { type: String },

  externalRatings: {
    imdb: Number,
    rottenTomatoes: Number,
    metacritic: Number,
    crunchyroll: Number,
  },

  personalRating: Number,

  totalRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Movie", movieSchema);