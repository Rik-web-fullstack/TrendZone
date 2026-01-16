const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const productModel = require("../models/productModel");

// 🔹 Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });


router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Admin products route is working" });
});

/* ==========================================================
   ✅ CREATE PRODUCT (Upload)
========================================================== */


router.post("/", upload.array("file", 12), async (req, res) => {
  try {
    const { name, price, description, Category, SubCategory } = req.body;
    if (!name || !price || !description || !Category || !SubCategory)
      return res.status(400).json({ success: false, message: "Missing required fields." });

    const newProduct = new productModel({
      name: name.trim(),
      price: price.trim(),
      description: description.trim(),
      Category: Category.toLowerCase().trim(),
      SubCategory: SubCategory.toLowerCase().trim(),
      Prod_img: req.files.map((file) => file.filename),
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "✅ Product uploaded successfully!", product: newProduct });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed." });
  }
});

/* ==========================================================
   ✅ READ ALL PRODUCTS (Admin View)
========================================================== */
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().sort({ _id: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products." });
  }
});

/* ==========================================================
   ✅ UPDATE PRODUCT (Admin Edit)
========================================================== */
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, Category, SubCategory } = req.body;
    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      { name, price, description, Category, SubCategory },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Product not found." });

    res.json({ success: true, message: "✅ Product updated successfully!", product: updated });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ success: false, message: "Update failed." });
  }
});

/* ==========================================================
   ✅ DELETE PRODUCT (Admin Delete)
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Product not found." });

    res.json({ success: true, message: "🗑️ Product deleted successfully!" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: "Delete failed." });
  }
});

module.exports = router;
