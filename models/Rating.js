const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",   // movie + anime same collection
    required: true,
    index: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  ipAddress: {
    type: String,
    required: true,
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ⭐ Duplicate rating stop
ratingSchema.index(
  { itemId: 1, ipAddress: 1 },
  { unique: true }
);

// ⭐ Fast average calculation
ratingSchema.index({ itemId: 1 });

module.exports = mongoose.model("Rating", ratingSchema);