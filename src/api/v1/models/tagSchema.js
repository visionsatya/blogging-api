import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

const tagModel = mongoose.model("Tag", tagSchema);
export default tagModel;
