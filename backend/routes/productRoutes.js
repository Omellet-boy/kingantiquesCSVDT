const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Configure Multer-Storage-Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "king-antiques",      // change to any folder name you like
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
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
      image: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : ""
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

// ✅ Get single product by ID
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.image;
    let imagePublicId = product.imagePublicId;

    // If new image uploaded → replace old Cloudinary image
    if (req.file) {
      // delete old image from Cloudinary
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        code: req.body.code,
        price: req.body.price,
        description: req.body.description,
        type: req.body.type,
        image: imageUrl,
        imagePublicId: imagePublicId
      },
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Delete the image from Cloudinary
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
