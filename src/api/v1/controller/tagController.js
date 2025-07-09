import tagModel from "../models/tagSchema.js";

// Create Tag
const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    const tag = await tagModel.create({ name, description });
    res.status(201).json({ tag, message: "Tag created successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create tag", error: error.message });
  }
};

// Get All Tags
const getTags = async (req, res) => {
  try {
    const tags = await tagModel.find();
    res.status(200).json({ tags });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tags", error: error.message });
  }
};

// Get Tag by ID
const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await tagModel.findById(id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ tag });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tag", error: error.message });
  }
};

// Update Tag
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const tag = await tagModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ tag, message: "Tag updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update tag", error: error.message });
  }
};

// Delete Tag
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await tagModel.findByIdAndDelete(id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete tag", error: error.message });
  }
};

export { createTag, getTags, getTagById, updateTag, deleteTag };
