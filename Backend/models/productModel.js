const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: String, required: true },
  description: { type: String, trim: true },
  Category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, // ✅ Always stored in lowercase
    index: true,      // ✅ Faster searches
  },
  SubCategory: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  Prod_img: [
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }
]

});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
