const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  code: String,
  price: Number,
  description: String,
  image: String,
  type: String
});


module.exports = mongoose.model("Product", ProductSchema);
