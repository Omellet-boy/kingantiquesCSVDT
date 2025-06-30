const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer storage via Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "king-antiques",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// ✅ Create product
router.post("/", upload.single("image"), async (req, res) => {
  console.log("BODY →", req.body);
  console.log("FILE →", req.file);

  try {
    const newProduct = new Product({
      name: req.body.name,
      code: req.body.code,
      price: req.body.price,
      description: req.body.description,
      type: req.body.type,
      image: req.file ? req.file.path : "", // ✅ This is the Cloudinary URL
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving product" });
  }
});

// ✅ Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Get single product by ID (for edit)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// ✅ Update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      code: req.body.code,
      price: req.body.price,
      description: req.body.description,
      type: req.body.type,
    };

    if (req.file) {
      updateData.image = req.file.path; // ✅ Cloudinary URL
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating product" });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
