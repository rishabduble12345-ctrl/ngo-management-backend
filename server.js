const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const Movie = require("./models/Movie");
const movieRoutes = require("./routes/movieRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

// ================= CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const upload = multer({ dest: "uploads/" });

// ================= MIDDLEWARE =================
// ⭐ FIXED CORS
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// ⭐ IMPORTANT FOR NESTED JSON FROM NETLIFY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB Connected ✅"))
  .catch(err=>console.log("DB Error:", err));

// ================= TEST =================
app.get("/", (req,res)=>{
  res.send("Otaku Meter Backend Running 🚀");
});

// ================= ROUTES =================
app.use("/api/movies", movieRoutes);
app.use("/api/ratings", ratingRoutes);

// =================================================
// 🔐 ADMIN ROUTES
// =================================================


// ---------- ADD ----------
app.post("/api/admin/add", async (req,res)=>{
  try{

    if(req.body.secret !== process.env.ADMIN_SECRET)
      return res.status(403).json({error:"Not allowed ❌"});

    const m = req.body.movie || {};

    const movie = await Movie.create({

      title: m.title,
      description: m.description,
      posterUrl: m.posterUrl,
      type: m.type,

      externalRatings:{
        imdb: Number(m.externalRatings?.imdb || 0),
        rottenTomatoes: Number(m.externalRatings?.rottenTomatoes || 0),
        metacritic: Number(m.externalRatings?.metacritic || 0),
        prime: Number(m.externalRatings?.prime || 0),
        netflix: Number(m.externalRatings?.netflix || 0),
        crunchyroll: Number(m.externalRatings?.crunchyroll || 0)
      },

      // ⭐ IMPORTANT
      otakuMeter: Number(m.otakuMeter || 0)
    });

    res.json({message:"Added Successfully ✅", movie});

  }catch(err){
    console.log(err);
    res.status(500).json({error: err.message});
  }
});


// ---------- EDIT ----------
app.put("/api/admin/edit/:id", async (req,res)=>{
  try{

    if(req.body.secret !== process.env.ADMIN_SECRET)
      return res.status(403).json({error:"Not allowed ❌"});

    const m = req.body.movie || {};

    await Movie.findByIdAndUpdate(req.params.id,{

      $set:{
        description: m.description,
        posterUrl: m.posterUrl,
        otakuMeter: Number(m.otakuMeter || 0),

        "externalRatings.imdb": Number(m.externalRatings?.imdb || 0),
        "externalRatings.rottenTomatoes": Number(m.externalRatings?.rottenTomatoes || 0),
        "externalRatings.metacritic": Number(m.externalRatings?.metacritic || 0),
        "externalRatings.prime": Number(m.externalRatings?.prime || 0),
        "externalRatings.netflix": Number(m.externalRatings?.netflix || 0),
        "externalRatings.crunchyroll": Number(m.externalRatings?.crunchyroll || 0)
      }

    });

    res.json({message:"Movie Updated ✅"});

  }catch(err){
    console.log(err);
    res.status(500).json({error: err.message});
  }
});


// ---------- DELETE ----------
app.delete("/api/admin/delete/:id", async (req,res)=>{
  try{
    if(req.body.secret !== process.env.ADMIN_SECRET)
      return res.status(403).json({error:"Not allowed ❌"});

    await Movie.findByIdAndDelete(req.params.id);
    res.json({message:"Movie Deleted ✅"});

  }catch(err){
    res.status(500).json({error: err.message});
  }
});


// ---------- POSTER UPLOAD ----------
app.post("/api/admin/upload", upload.single("poster"), async (req,res)=>{
  try{
    if(!req.file)
      return res.status(400).json({error:"No file uploaded"});

    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({url: result.secure_url});

  }catch(err){
    res.status(500).json({error: err.message});
  }
});


// ================= PORT =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT} 🚀`));