const express = require("express");
const router = express.Router();
const users = require("../models/userModel");
const products = require("../models/productModel");

/* ================================
   💖 ADD TO WISHLIST
================================ */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if product already in wishlist
    const alreadyAdded = user.wishlist.find(
      (item) => item.toString() === productId
    );
    if (alreadyAdded) {
      return res.status(200).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    res
      .status(500)
      .json({ message: "Failed to add product to wishlist", error });
  }
});

/* ================================
   📦 GET USER WISHLIST
================================ */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await users
      .findById(userId)
      .populate("wishlist")
      .select("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch wishlist", error });
  }
});

/* ================================
   ❌ REMOVE FROM WISHLIST
================================ */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Wishlist Remove Error:", error);
    res.status(500).json({ message: "Failed to remove item", error });
  }
});

module.exports = router;
