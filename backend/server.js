require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { MONGO_URI } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend (optional for now)
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Remove this if you no longer want local uploads
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
