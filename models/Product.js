const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
