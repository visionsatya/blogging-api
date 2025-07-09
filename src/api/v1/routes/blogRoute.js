import express from "express";
import blogValidator from "../validations/blogValidator.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  publishBlog,
  unpublishBlog,
} from "../controllers/blogController.js";
import { verifyToken, permitRoles } from "../middleware/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog posts management
 */

/**
 * @swagger
 * /createblog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: My First Blog
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: This is the content of my first blog post.
 *               excerpt:
 *                 type: string
 *                 maxLength: 500
 *                 example: A brief summary of the blog post
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["technology", "programming"]
 *               category:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Blog created successfully
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
 *         description: Forbidden - Insufficient permissions
 */
/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of blogs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search blogs by title or content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter blogs by category ID
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter blogs by author ID
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: List of blogs
 */
/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog data
 *   put:
 *     summary: Update a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: Updated Blog Title
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: Updated content for the blog post.
 *               excerpt:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated brief summary of the blog post
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["technology", "programming", "web-development"]
 *               category:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/updated-image.jpg
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Blog updated successfully
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
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Blog not found
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted
 */
/**
 * @swagger
 * /blog/{id}/like:
 *   post:
 *     summary: Like a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog liked
 */
/**
 * @swagger
 * /blog/{id}/dislike:
 *   post:
 *     summary: Dislike a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog disliked
 */
/**
 * @swagger
 * /blog/{id}/publish:
 *   put:
 *     summary: Publish a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog published
 */
/**
 * @swagger
 * /blog/{id}/unpublish:
 *   put:
 *     summary: Unpublish a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog unpublished
 */

const router = express.Router();

router.post(
  "/createblog",
  verifyToken,
  permitRoles("admin", "editor", "author"),
  blogValidator,
  createBlog
);
router.get(
  "/blogs",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  getAllBlogs
);
router.get(
  "/blog/:id",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  getBlogById
);
router.put(
  "/blog/:id",
  verifyToken,
  permitRoles("admin", "editor", "author"),
  blogValidator,
  updateBlog
);
router.delete(
  "/blog/:id",
  verifyToken,
  permitRoles("admin", "editor", "author"),
  deleteBlog
);
router.post(
  "/blog/:id/like",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  likeBlog
);
router.post(
  "/blog/:id/dislike",
  verifyToken,
  permitRoles("admin", "editor", "author", "reader"),
  dislikeBlog
);
router.put(
  "/blog/:id/publish",
  verifyToken,
  permitRoles("admin", "editor", "author"),
  publishBlog
);
router.put(
  "/blog/:id/unpublish",
  verifyToken,
  permitRoles("admin", "editor", "author"),
  unpublishBlog
);

export default router;
