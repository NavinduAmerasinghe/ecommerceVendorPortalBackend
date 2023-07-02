const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name as the current timestamp + file extension
  },
});

const upload = multer({ storage: storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get a single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a new product
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { sku, quantity, name, description } = req.body;
    const images = req.files.map((file) => file.path);
    const newProduct = await Product.create({
      sku,
      quantity,
      name,
      images,
      description,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a product
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const { sku, quantity, name, description } = req.body;
    let images = [];
    if (req.files) {
      images = req.files.map((file) => file.path);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        sku,
        quantity,
        name,
        images,
        description,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
