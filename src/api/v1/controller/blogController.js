import blogModel from "../models/blogSchema.js";
import categoryModel from "../models/categorySchema.js";
import tagModel from "../models/tagSchema.js";

const createBlog = async (req, res) => {
  try {
    const { title, content, category, categoryName, tags, tagNames } = req.body;
    let categoryId = category;
    if (categoryName) {
      const foundCategory = await categoryModel.findOne({ name: categoryName });
      if (!foundCategory) {
        return res.status(400).json({ message: "Category not found" });
      }
      categoryId = foundCategory._id;
    }
    let tagIds = tags || [];
    if (tagNames && Array.isArray(tagNames)) {
      // Find existing tags
      const foundTags = await tagModel.find({ name: { $in: tagNames } });
      const foundTagNames = foundTags.map(tag => tag.name);
      // Create missing tags
      const missingTagNames = tagNames.filter(name => !foundTagNames.includes(name));
      let createdTags = [];
      if (missingTagNames.length > 0) {
        createdTags = await tagModel.insertMany(missingTagNames.map(name => ({ name })));
      }
      tagIds = [
        ...foundTags.map(tag => tag._id),
        ...createdTags.map(tag => tag._id)
      ];
    }
    const newBlog = new blogModel({
      title,
      content,
      author: req.user._id,
      category: categoryId,
      tags: tagIds,
    });
    await newBlog.save();
    res.status(201).json({ blog: newBlog, message: "Blog created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || "date";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Filtering
    const filter = {};
    if (req.query.author) {
      filter.author = req.query.author;
    }
    if (req.query.published !== undefined) {
      filter.published = req.query.published === "true";
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    // If category/tag fields are added to the schema, add:
    // if (req.query.category) filter.category = req.query.category;
    // if (req.query.tag) filter.tags = req.query.tag;

    const total = await blogModel.countDocuments(filter);
    const blogs = await blogModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "name")
      .populate("category", "name")
      .populate("tags", "name");

    res.status(200).json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: error.message });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModel
      .findById(id)
      .populate("author", "name")
      .populate("category", "name")
      .populate("tags", "name");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog, message: "Blog fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, tagNames } = req.body;
  try {
    let tagIds = tags || [];
    if (tagNames && Array.isArray(tagNames)) {
      const foundTags = await tagModel.find({ name: { $in: tagNames } });
      const foundTagNames = foundTags.map(tag => tag.name);
      const missingTagNames = tagNames.filter(name => !foundTagNames.includes(name));
      let createdTags = [];
      if (missingTagNames.length > 0) {
        createdTags = await tagModel.insertMany(missingTagNames.map(name => ({ name })));
      }
      tagIds = [
        ...foundTags.map(tag => tag._id),
        ...createdTags.map(tag => tag._id)
      ];
    }
    const blog = await blogModel.findByIdAndUpdate(id, {
      title,
      content,
      category,
      tags: tagIds,
    });
    res.status(200).json({ blog, message: "Blog updated successfully" });
  } catch (error) {
    res.status(404).json({ message: "Blog not found" });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await blogModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Blog not found" });
  }
};

const likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Remove dislike if present
    blog.dislikes = blog.dislikes.filter(
      (uid) => uid.toString() !== userId.toString()
    );
    // Toggle like
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      blog.likes.push(userId);
    }
    await blog.save();
    res.status(200).json({
      message: "Blog liked status updated",
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const dislikeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Remove like if present
    blog.likes = blog.likes.filter(
      (uid) => uid.toString() !== userId.toString()
    );
    // Toggle dislike
    if (blog.dislikes.includes(userId)) {
      blog.dislikes = blog.dislikes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      blog.dislikes.push(userId);
    }
    await blog.save();
    res.status(200).json({
      message: "Blog dislike status updated",
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const publishBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Only admin, or owner (editor/author) can publish
    if (
      req.user.role !== "admin" &&
      blog.author.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot publish this blog" });
    }
    blog.published = true;
    await blog.save();
    res.status(200).json({ message: "Blog published", blog });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const unpublishBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Only admin, or owner (editor/author) can unpublish
    if (
      req.user.role !== "admin" &&
      blog.author.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot unpublish this blog" });
    }
    blog.published = false;
    await blog.save();
    res.status(200).json({ message: "Blog unpublished", blog });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  publishBlog,
  unpublishBlog,
};
