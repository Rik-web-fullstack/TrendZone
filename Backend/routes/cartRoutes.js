const express = require("express");
const router = express.Router();
const users = require("../models/userModel");
const products = require("../models/productModel");

/* ================================
   🛒 ADD TO CART
================================ */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart successfully", cart: user.cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Failed to add product to cart", error });
  }
});

/* ================================
   📦 GET USER CART
================================ */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await users
      .findById(userId)
      .populate("cart.product")
      .select("cart");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
});

/* ================================
   ✏️ UPDATE QUANTITY
================================ */
router.put("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
      await user.save();
      return res.status(200).json({ message: "Cart updated", cart: user.cart });
    }

    res.status(404).json({ message: "Product not found in cart" });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Failed to update cart", error });
  }
});

/* ================================
   ❌ REMOVE FROM CART
================================ */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    res.status(200).json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).json({ message: "Failed to remove item", error });
  }
});

/* ================================
   🧹 CLEAR ENTIRE CART (After Payment)
================================ */
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Empty the cart array
    user.cart = [];

    await user.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Failed to clear cart", error });
  }
});

module.exports = router;
