const express = require("express");
const { protect } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");

const {
  createArticle,
  searchArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require("./article.controller");

const router = express.Router();

// CREATE ARTICLE (Admin + Trainer)
router.post("/", protect, authorize("Admin", "SuperAdmin", "Trainer"), createArticle);

// SEARCH ARTICLES
router.get("/search", protect, searchArticles);

// GET ARTICLE DETAILS
router.get("/:id", protect, getArticleById);

// UPDATE ARTICLE (Admin only)
router.put("/:id", protect, authorize("Admin", "SuperAdmin"), updateArticle);

// DELETE ARTICLE (Admin only)
router.delete("/:id", protect, authorize("Admin", "SuperAdmin"), deleteArticle);

module.exports = router;
