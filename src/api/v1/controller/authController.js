import { validationResult } from "express-validator";
import userModel from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, password, role } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Check for existing username
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let assignedRole = "reader";
    if (role && ["admin", "editor", "author", "reader"].includes(role)) {
      // Only allow 'admin' if the requester is an admin (future: via admin panel)
      if (role === "admin") {
        // For now, prevent direct registration as admin
        assignedRole = "reader";
      } else {
        assignedRole = role;
      }
    }
    const newUser = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: assignedRole,
    });
    const token = generateToken(newUser._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(user._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Login successful", user: user });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.user._id;
  const { name, username, email, password } = req.body;
  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (username) {
      // Check if username is taken by another user
      const existingUsername = await userModel.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updateFields.username = username;
    }
    if (email) {
      // Check if email is taken by another user
      const existingEmail = await userModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateFields.email = email;
    }
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: updateFields }, { new: true })
      .select("-password");
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Only the user themselves or an admin can delete
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this user" });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

export { registerUser, loginUser, logoutUser, updateProfile, deleteUser };
