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
const uploadRoutes = require("./routes/upload");

const app = express();

/* ================== IMPORTANT FOR RENDER ================== */
app.set("trust proxy", 1);

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // local dev
      "https://trendzone-frontend.onrender.com"     // 🔥 CHANGE THIS
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================== STATIC FILES ================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== ROUTES ================== */
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", uploadRoutes);

/* ================== NEW ARRIVALS ================== */
app.get("/new-arrivals", async (req, res) => {
  try {
    const productModel = require("./models/productModel");
    const latestProducts = await productModel
      .find()
      .sort({ _id: -1 })
      .limit(6);
    res.json(latestProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
