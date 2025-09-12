import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const router = express.Router();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("📩 Signup Request Body:", req.body);  // Debug line

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    console.log("✅ User Created:", newUser);  // Debug line

    res.status(201).json({
      token: generateToken(newUser._id),
      user: { name: newUser.name, email: newUser.email, _id: newUser._id }
    });
  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error);  // Debug line
    res.status(500).json({ message: error.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      user: { name: user.name, email: user.email, _id: user._id }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Summary (group by category)


export default router;

