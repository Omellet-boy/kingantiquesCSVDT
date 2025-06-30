const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// ✅ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
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
      image: req.file ? "/uploads/" + req.file.filename : ""
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
      description: req.body.description
    };

    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
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
