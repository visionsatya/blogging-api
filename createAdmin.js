import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userModel from "./src/api/v1/models/userSchema.js";
import connectDB from "./src/api/v1/config/db.js";

dotenv.config();

async function createAdmin() {
  const name = "Satendra Singh"; // Change as needed
  const username = "ssadmin"; // Change as needed
  const email = "ssadmin@gmail.com"; // Change as needed
  const password = "Ssadmin@123"; // Change as needed
  const role = "admin";

  try {
    await connectDB();
    const existing = await userModel.findOne({ email });
    if (existing) {
      console.log("Admin user already exists with this email.");
      process.exit(0);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });
    console.log("Admin user created:", adminUser);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
}

createAdmin();
