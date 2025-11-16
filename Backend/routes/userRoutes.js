const express = require("express");
const router = express.Router();
const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ⚠️ In production, use environment variables
const JWT_SECRET = "secretkey";

/* ================================
   🟢 REGISTER ROUTE
================================ */
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      name,
      phone,
      email,
      password: hashedPassword,
      address,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(400).json({ message: "Error during registration", error });
  }
});

/* ================================
   🔵 LOGIN ROUTE (with cookie)
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send JWT token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ✅ Set to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Include user ID in response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // optional for frontend storage if you want
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

/* ================================
   🟣 VERIFY LOGIN (auto-login)
================================ */
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ loggedIn: false, message: "No token found" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await users.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ loggedIn: false, message: "Invalid token" });

    // ✅ Auto-login success response
    res.json({
      loggedIn: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(401).json({ loggedIn: false, message: "Token verification failed" });
  }
});

/* ================================
   🔴 LOGOUT ROUTE
================================ */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
