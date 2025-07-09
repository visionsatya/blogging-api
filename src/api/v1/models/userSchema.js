import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
    trim: true,
    lowercase: true,
    minlength: [3, "user name must be at least 3 characters long"],
    maxlength: [30, "user name must be at most 30 characters long"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    trim: true,
    minlength: [3, "username must be at least 3 characters long"],
    maxlength: [20, "username must be at most 20 characters long"],
  },
  email: {
    type: String,
    required: [true, "user email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "user email must be a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "user password is required"],
  },
  role: {
    type: String,
    enum: ["admin", "editor", "author", "reader"],
    default: "reader",
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
