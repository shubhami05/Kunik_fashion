// routes/heroRoutes.js
import express from "express";
import HeroImage from "../models/HeroImage.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const images = await HeroImage.find();
  res.json(images);
});

router.post("/", async (req, res) => {
  try {
    const heroImage = new HeroImage(req.body);
    await heroImage.save();
    res.status(201).json(heroImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHeroImage = await HeroImage.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedHeroImage) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    res.json(updatedHeroImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a hero image
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHeroImage = await HeroImage.findByIdAndDelete(id);

    if (!deletedHeroImage) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    res.json({ message: "Hero image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
