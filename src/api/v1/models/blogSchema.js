import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "blog title is required"],
  },
  content: {
    type: String,
    required: [true, "blog content is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  date: {
    type: Date,
    default: Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  published: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
});

blogSchema.index({ title: "text", content: "text" });

const blogModel = mongoose.model("blog", blogSchema);
export default blogModel;
