import express from "express";
import {
  registerValidator,
  loginValidator,
  profileUpdateValidator,
} from "../validations/authValidation.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  deleteUser,
} from "../controllers/authController.js";
import { verifyToken, permitRoles } from "../middleware/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 example: johndoe
 *                 description: Username (alphanumeric and underscore only)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Valid email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *                 description: Password (minimum 6 characters)
 *               role:
 *                 type: string
 *                 enum: [reader, author, editor, admin]
 *                 default: reader
 *                 example: reader
 *                 description: User role (optional, defaults to reader)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *   put:
 *     summary: Update current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 example: johndoe
 *                 description: Username (alphanumeric and underscore only)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Valid email address
 *               currentPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: currentpassword123
 *                 description: Current password (required for email change)
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newpassword123
 *                 description: New password (optional)
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Username or email already exists
 *   delete:
 *     summary: Delete current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden
 */

const router = express.Router();
router.post("/register", registerValidator, registerUser);

router.post("/login", loginValidator, loginUser);

router.post("/logout", logoutUser);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    user: req.user,
    message: "User profile fetched successfully",
  });
});

router.put("/me", verifyToken, profileUpdateValidator, updateProfile);
router.delete("/me", verifyToken, (req, res) =>
  deleteUser({ ...req, params: { id: req.user._id } }, res)
);
router.delete("/users/:id", verifyToken, permitRoles("admin"), deleteUser);

export default router;
