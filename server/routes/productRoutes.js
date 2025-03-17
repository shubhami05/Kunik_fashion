// routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    
    if (!featuredProducts.length) {
      return res.status(204).json({ message: "No featured products found" });
    }

    res.json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    
    const updatedProduct = await Product.findOneAndUpdate({id:req.params.id}, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.delete("/:id", async (req, res) => {
//   try {
//     await Product.findOneAndDelete({ id: req.params.id });
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    // console.log("Deleting product with ID:", req.params.id); // Debugging log

    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });

    if (!deletedProduct) {
      // console.log("Product not found in DB");
      return res.status(404).json({ error: "Product not found" });
    }

    // console.log("Deleted Product:", deletedProduct);
    res.json({ message: "Product deleted" });
  } catch (error) {
    // console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;