const express = require("express");
const Article = require("../models/Article");
const { verifyToken, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// CREATE ARTICLE (Admin + Trainer)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
      versions: [
        {
          content: req.body.content,
          updatedAt: new Date()
        }
      ],
      createdBy: req.user.id
    });

    res.status(201).json(article);
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: "Failed to create article" });
  }
});


// SEARCH ARTICLES (Admin + User + Trainer)
router.get("/search", async (req, res) => {
  const { keyword } = req.query;
  const articles = await Article.find({
    title: { $regex: keyword, $options: "i" }
  });
  res.json(articles);
});

// GET ARTICLE DETAILS
router.get("/:id", async (req, res) => {

  const article = await Article.findById(req.params.id);
  res.json(article);
});

// UPDATE ARTICLE (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const article = await Article.findById(req.params.id);

  article.content = req.body.content;
  article.category = req.body.category;
  article.tags = req.body.tags;

  article.versions.push({
    content: req.body.content,
    updatedAt: new Date(),
  });

  await article.save();
  res.json(article);
});
  // DELETE ARTICLE (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.deleteOne();

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
});


module.exports = router;
