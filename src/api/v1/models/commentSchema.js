import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "comment is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
    required: [true, "blog is required"],
  },
  date: {
    type: Date,
    default: Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  },
});

const commentModel = mongoose.model("comment", commentSchema);
export default commentModel;
