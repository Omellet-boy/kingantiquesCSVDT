const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // ✅ Find admin by username
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Check password
  if (admin.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Create token
  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    "YOUR_SECRET_KEY",  // replace with real secret
    { expiresIn: "2h" }
  );

  res.json({ token });
});

module.exports = router;
