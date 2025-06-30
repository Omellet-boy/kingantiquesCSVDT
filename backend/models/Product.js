const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  code: String,
  price: Number,
  description: String,
  type: String,
  image: String,
  imagePublicId: String
});

module.exports = mongoose.model("Product", productSchema);
