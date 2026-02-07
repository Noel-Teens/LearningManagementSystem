const express = require("express");
const multer = require("multer");
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

// Use memory storage so we can upload directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE ARTICLE (Admin + Trainer)
router.post(
  "/",
  protect,
  authorize("Admin", "SuperAdmin", "Trainer"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createArticle
);

// SEARCH ARTICLES
router.get("/search", protect, searchArticles);

// GET ARTICLE DETAILS
router.get("/:id", protect, getArticleById);

// UPDATE ARTICLE (Admin only)
router.put(
  "/:id",
  protect,
  authorize("Admin", "SuperAdmin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateArticle
);

// DELETE ARTICLE (Admin only)
router.delete("/:id", protect, authorize("Admin", "SuperAdmin"), deleteArticle);

module.exports = router;
