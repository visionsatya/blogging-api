import express from "express";
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Blog tags management
 */

/**
 * @swagger
 * /tag:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 30
 *                 example: JavaScript
 *                 description: Tag name
 *               description:
 *                 type: string
 *                 maxLength: 100
 *                 example: JavaScript programming language
 *                 description: Tag description (optional)
 *     responses:
 *       201:
 *         description: Tag created successfully
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
 *         description: Tag already exists
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
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
 *         description: Number of tags per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tags by name
 *     responses:
 *       200:
 *         description: List of tags
 */
/**
 * @swagger
 * /tag/{id}:
 *   get:
 *     summary: Get a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag data
 *   put:
 *     summary: Update a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 30
 *                 example: Updated Tag Name
 *                 description: Tag name
 *               description:
 *                 type: string
 *                 maxLength: 100
 *                 example: Updated tag description
 *                 description: Tag description (optional)
 *     responses:
 *       200:
 *         description: Tag updated successfully
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
 *       404:
 *         description: Tag not found
 *   delete:
 *     summary: Delete a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         required: true
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag deleted
 */
router.post("/", createTag);
router.get("/", getTags);
router.get("/:id", getTagById);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
