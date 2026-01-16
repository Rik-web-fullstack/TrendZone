const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

// 🔹 GET ALL PRODUCTS (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};

    if (category) filter.Category = category.toLowerCase().trim();
    if (subcategory) filter.SubCategory = subcategory.toLowerCase().trim();

    const products = await Product.find(filter).sort({ _id: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// 🔥 GET SINGLE PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

module.exports = router;
