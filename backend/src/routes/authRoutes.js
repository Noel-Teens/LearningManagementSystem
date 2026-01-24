const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER (create admin/user manually)
router.post("/register", async (req, res) => {
  console.log("====== REGISTER API HIT ======");
  console.log("REQ BODY:", req.body);

  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const user = await User.create({
      email,
      password: hash,
      role: role || "Learner"
    });

    console.log("User created:", user);

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("🔥 REGISTER CRASH ERROR 🔥");
    console.error(err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message
    });
  }
});



// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRET_KEY"
  );

  res.json({ token, role: user.role });
});

module.exports = router;