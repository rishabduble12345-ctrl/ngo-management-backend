const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({

title: { type:String, required:true },
description: String,
posterUrl: String,
type: { type:String, required:true },

externalRatings:{
  imdb:{ type:Number, default:0 },
  rottenTomatoes:{ type:Number, default:0 },
  metacritic:{ type:Number, default:0 },
  prime:{ type:Number, default:0 },
  netflix:{ type:Number, default:0 },
  crunchyroll:{ type:Number, default:0 }
},

otakuMeter:{
  type:Number,
  default:0
},

totalRatings:{
  type:Number,
  default:0
},

averageRating:{
  type:Number,
  default:0
}

},{ minimize:false });   // ⭐ IMPORTANT

module.exports = mongoose.model("Movie", MovieSchema);