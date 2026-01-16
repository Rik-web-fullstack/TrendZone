const express = require("express");
const router = express.Router();
const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/* ================================
   🟢 REGISTER
================================ */
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    const existingUser = await users.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

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
    res.status(400).json({ message: "Error during registration" });
  }
});

/* ================================
   🔵 LOGIN
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================================
   🟣 VERIFY LOGIN
================================ */
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ loggedIn: false });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await users.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ loggedIn: false });

    res.json({
      loggedIn: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(401).json({ loggedIn: false });
  }
});

/* ================================
   🔴 LOGOUT
================================ */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
