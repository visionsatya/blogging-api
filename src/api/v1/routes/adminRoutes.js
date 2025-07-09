import express from "express";
import adminController from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin analytics and management
 */

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get overview analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Overview analytics data
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /analytics/most-viewed-posts:
 *   get:
 *     summary: Get most viewed blog posts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts to return
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: List of most viewed posts
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /analytics/user-activity:
 *   get:
 *     summary: Get user activity logs
 *     tags: [Admin]
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
 *           default: 20
 *         description: Number of logs per page
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by specific user ID
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *     responses:
 *       200:
 *         description: User activity logs
 *       403:
 *         description: Forbidden
 */
// Analytics endpoints
router.get(
  "/analytics/overview",
  verifyAdmin,
  adminController.getOverviewAnalytics
);
router.get(
  "/analytics/most-viewed-posts",
  verifyAdmin,
  adminController.getMostViewedPosts
);
router.get(
  "/analytics/user-activity",
  verifyAdmin,
  adminController.getUserActivityLogs
);

export default router;
