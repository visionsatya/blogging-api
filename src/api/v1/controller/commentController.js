import commentModel from "../models/commentSchema.js";
import blogModel from "../models/blogSchema.js";

// Add a comment to a blog post
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    const newComment = await commentModel.create({
      comment,
      user: userId,
      blog: blogId,
    });

    await blogModel.findByIdAndUpdate(blogId, {
      $push: { comments: newComment._id },
    });

    res
      .status(201)
      .json({ comment: newComment, message: "Comment added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// Get all comments for a blog post
const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel
      .find({ blog: blogId })
      .populate("user", "name");
    res.status(200).json({ comments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Only the user who wrote the comment or an admin can delete
    if (
      req.user.role !== "admin" &&
      comment.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }
    await commentModel.findByIdAndDelete(commentId);
    await blogModel.findByIdAndUpdate(comment.blog, {
      $pull: { comments: commentId },
    });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message });
  }
};

// Edit a comment
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const existingComment = await commentModel.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Only the user who wrote the comment or an admin can edit
    if (
      req.user.role !== "admin" &&
      existingComment.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }
    existingComment.comment = comment;
    await existingComment.save();
    res.status(200).json({ comment: existingComment, message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment", error: error.message });
  }
};

export { addComment, getComments, deleteComment, editComment };
