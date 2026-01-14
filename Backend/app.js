require("dotenv").config();
const db = require("./config/db");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/upload"); // ✅ new route file

const app = express();

// 🔹 Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend port
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 🔹 Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Route registration
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", uploadRoutes);

// 🔹 New Arrivals API
app.get("/new-arrivals", async (req, res) => {
  try {
    const productModel = require("./models/productModel");
    const latestProducts = await productModel.find().sort({ _id: -1 }).limit(6);
    res.json(latestProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
