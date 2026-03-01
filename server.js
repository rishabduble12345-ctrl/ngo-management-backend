const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const movieRoutes = require("./routes/movieRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const Movie = require("./models/Movie");

const app = express();

// ---------------- Cloudinary ----------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const upload = multer({ dest: "uploads/" });

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());

// Images serve (local images)
app.use("/images", express.static("public/images"));

// ---------------- MongoDB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

// ---------------- Test Route ----------------
app.get("/", (req, res) => {
  res.send("Movie Rating Backend Running 🚀");
});

// ---------------- Normal Routes ----------------
app.use("/api/movies", movieRoutes);
app.use("/api/ratings", ratingRoutes);

// =================================================
// 🔐 ADMIN ROUTES
// =================================================

// ADD MOVIE
app.post("/api/admin/add", async (req, res) => {
  try {
    if (req.body.secret !== process.env.ADMIN_SECRET)
      return res.status(403).json({ error: "Not allowed ❌" });

    const movie = await Movie.create(req.body.movie);

    res.json({ message: "Movie Added Successfully ✅", movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT MOVIE
app.put("/api/admin/edit/:id", async (req, res) => {
  try {
    if (req.body.secret !== process.env.ADMIN_SECRET)
      return res.status(403).json({ error: "Not allowed ❌" });

    await Movie.findByIdAndUpdate(req.params.id, req.body.movie);
    res.json({ message: "Movie Updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE MOVIE
app.delete("/api/admin/delete/:id", async (req, res) => {
  try {
    if (req.body.secret !== process.env.ADMIN_SECRET)
      return res.status(403).json({ error: "Not allowed ❌" });

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPLOAD POSTER
app.post("/api/admin/upload", upload.single("poster"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PORT ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});