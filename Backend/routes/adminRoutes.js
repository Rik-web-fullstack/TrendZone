const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/productModel");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/add-product", upload.array("images", 4), async (req, res) => {
  try {
    /* =========================
       🔐 COOKIE AUTH
    ========================= */
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    /* =========================
       ☁️ CLOUDINARY UPLOAD
    ========================= */
    const imageUrls = [];

    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "trendzone_products" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      imageUrls.push(uploadResult.secure_url);
    }

    /* =========================
       💾 SAVE PRODUCT
    ========================= */
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      Category: req.body.Category,
      SubCategory: req.body.SubCategory,
      Prod_img: imageUrls,
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

module.exports = router;
