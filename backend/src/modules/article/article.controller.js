const Article = require("./article.model");

// CREATE ARTICLE (Admin + Trainer)
exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
      versions: [
        {
          content: req.body.content,
          updatedAt: new Date(),
        },
      ],
      createdBy: req.user.id,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: "Failed to create article" });
  }
};

// SEARCH ARTICLES (Admin + Learner + Trainer)
exports.searchArticles = async (req, res) => {
  try {
    const { keyword } = req.query;

    const articles = await Article.find({
      title: { $regex: keyword, $options: "i" },
    });

    res.json(articles);
  } catch (error) {
    console.error("Search article error:", error);
    res.status(500).json({ message: "Failed to search articles" });
  }
};

// GET ARTICLE DETAILS
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

// UPDATE ARTICLE (Admin only)
exports.updateArticle = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

// DELETE ARTICLE (Admin only)
exports.deleteArticle = async (req, res) => {
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
};
