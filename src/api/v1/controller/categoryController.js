import categoryModel from "../models/categorySchema.js";

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await categoryModel.create({ name, description });
    res
      .status(201)
      .json({ category, message: "Category created successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create category", error: error.message });
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
};

// Get Category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch category", error: error.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res
      .status(200)
      .json({ category, message: "Category updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update category", error: error.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
