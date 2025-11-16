// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

router.get("/", async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};

    // Convert incoming params to lowercase for reliable matching
    if (category) filter.Category = category.toLowerCase().trim();
    if (subcategory) filter.SubCategory = subcategory.toLowerCase().trim();

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


module.exports = router;
