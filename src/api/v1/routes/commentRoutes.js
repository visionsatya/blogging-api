import express from "express";
import { verifyToken, permitRoles } from "../middleware/authMiddleware.js";
import {
  addComment,
  getComments,
  deleteComment,
  editComment,
} from "../controllers/commentController.js";
import commentValidator from "../validations/commentValidator.js";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Blog comments management
 */

/**
 * @swagger
 * /blog/{blogId}/comment:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: This is a comment on the blog post.
 *                 description: Comment content
 *     responses:
 *       201:
 *         description: Comment added successfully
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
 *       404:
 *         description: Blog post not found
 */
/**
 * @swagger
 * /blog/{blogId}/comments:
 *   get:
 *     summary: Get all comments for a blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog post ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of comments per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *         description: Sort comments by date
 *     responses:
 *       200:
 *         description: List of comments
 */
/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *   put:
 *     summary: Edit a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: Updated comment content.
 *                 description: Updated comment content
 *     responses:
 *       200:
 *         description: Comment updated successfully
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
 *       403:
 *         description: Forbidden - Not the comment author
 *       404:
 *         description: Comment not found
 */
const router = express.Router();

// Add a comment to a blog post
router.post(
  "/blog/:blogId/comment",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  commentValidator,
  addComment
);
// Get all comments for a blog post
router.get("/blog/:blogId/comments", getComments);
// Delete a comment
router.delete(
  "/comment/:commentId",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  deleteComment
);
// Edit a comment
router.put(
  "/comment/:commentId",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  commentValidator,
  editComment
);

export default router;
