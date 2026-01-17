const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/productModel");

const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   🔐 ADMIN AUTH MIDDLEWARE
========================= */
const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  next();
};

/* =========================
   ➕ ADD PRODUCT
========================= */
router.post(
  "/add-product",
  isAdmin,
  upload.array("images", 4),
  async (req, res) => {
    try {
      const images = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "trendzone_products" },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            )
            .end(file.buffer);
        });

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        Category: req.body.Category,
        SubCategory: req.body.SubCategory,
        Prod_img: images,
      });

      res.status(201).json({ message: "Product added", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Add failed" });
    }
  }
);

/* =========================
   ✏️ UPDATE PRODUCT TEXT
========================= */
router.put("/update-product/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   🖼️ UPDATE PRODUCT IMAGES
========================= */
router.put(
  "/update-product-images/:id",
  isAdmin,
  upload.array("images", 4),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Not found" });

      // ✅ FIX: normalize deleteImageIds from FormData
      let deleteImageIds = req.body.deleteImageIds || [];
      if (!Array.isArray(deleteImageIds)) {
        deleteImageIds = [deleteImageIds];
      }

      // 🔥 DELETE SELECTED IMAGES FROM CLOUDINARY
      for (const pid of deleteImageIds) {
        await cloudinary.uploader.destroy(pid);
      }

      // 🔥 REMOVE FROM DB
      product.Prod_img = product.Prod_img.filter(
        (img) => !deleteImageIds.includes(img.public_id)
      );

      // 📤 ADD NEW IMAGES
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "trendzone_products" },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            )
            .end(file.buffer);
        });

        product.Prod_img.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      await product.save();

      res.json({ message: "Images updated", images: product.Prod_img });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Image update failed" });
    }
  }
);

/* =========================
   🗑️ DELETE PRODUCT + IMAGES
========================= */
router.delete("/delete-product/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    // ✅ FIX: handle old products safely
    for (const img of product.Prod_img) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();

    res.json({ message: "Product & images deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
