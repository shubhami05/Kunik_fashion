import express from 'express';
const router = express.Router();
import Category from '../models/Category.js';

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch categories",
      error: error.message 
    });
  }
});

// Add new category
router.post('/', async (req, res) => {
  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }

    const category = new Category({
      name: req.body.name,
      isActive: true
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }
    res.status(500).json({ 
      message: "Failed to create category",
      error: error.message 
    });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    // Check if updating to an existing name
    if (req.body.editName) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${req.body.editName}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({ 
          message: "Category with this name already exists" 
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }
    res.status(500).json({ 
      message: "Failed to update category",
      error: error.message 
    });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Instead of hard delete, set isActive to false
    category.isActive = false;
    await category.save();
    
    res.status(200).json({ message: "Category deactivated successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to delete category",
      error: error.message 
    });
  }
});

// Toggle category status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Toggle the isActive status
    category.isActive = !category.isActive;
    await category.save();
    
    res.json({ 
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to update category status",
      error: error.message 
    });
  }
});

export default router;
