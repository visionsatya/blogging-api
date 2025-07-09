import Blog from "../models/blogSchema.js";
import User from "../models/userSchema.js";
import Comment from "../models/commentSchema.js";

const adminController = {
  // GET /admin/analytics/overview
  async getOverviewAnalytics(req, res) {
    try {
      const [totalPosts, totalUsers, totalComments] = await Promise.all([
        Blog.countDocuments(),
        User.countDocuments(),
        Comment.countDocuments(),
      ]);
      res.json({ totalPosts, totalUsers, totalComments });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch analytics", error: err.message });
    }
  },

  // GET /admin/analytics/most-viewed-posts
  async getMostViewedPosts(req, res) {
    try {
      const posts = await Blog.find()
        .sort({ views: -1 })
        .limit(5)
        .select("title views author createdAt");
      res.json({ posts });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Failed to fetch most viewed posts",
          error: err.message,
        });
    }
  },

  // GET /admin/analytics/user-activity
  async getUserActivityLogs(req, res) {
    // Placeholder: No activity log model implemented yet
    res.json({ logs: [] });
  },
};

export default adminController;
