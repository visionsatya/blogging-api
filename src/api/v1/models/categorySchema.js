import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    maxlength: 200,
  },
}, { timestamps: true });

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel; 