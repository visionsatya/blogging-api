import jwt from "jsonwebtoken";
import userModel from "../models/userSchema.js";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

const verifyAdmin = [verifyToken, permitRoles("admin")];

export { verifyToken, permitRoles, verifyAdmin };
