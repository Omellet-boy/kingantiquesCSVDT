const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // ✅ Load .env

// ✅ Import secrets directly from config.js
const { MONGO_URI } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static HTML files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// ❌ REMOVE local uploads serving (Cloudinary is used now)
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
