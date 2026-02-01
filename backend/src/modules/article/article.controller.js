const cloudinary = require("../../config/cloudinary.js");
const Article = require("./article.model");

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, resource_type = "image" ) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type, chunk_size: resource_type === "video" ? 6000000 : undefined, },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// CREATE ARTICLE
exports.createArticle = async (req, res) => {
  console.log("createArticle HIT");

  try {
    const files = req.files || {};
    let imageUrl = null;
    let videoUrl = null;
    let fileUrl = null;

    // Upload media to Cloudinary
    if (files.image && files.image[0]) {
      imageUrl = await uploadToCloudinary(files.image[0].buffer, "articles/images");
    }
    if (files.video && files.video[0]) {
      console.time("cloudinary");
      videoUrl = await uploadToCloudinary(files.video[0].buffer, "articles/videos", "video");
      console.timeEnd("cloudinary");
    }
    if (files.file && files.file[0]) {
      fileUrl = await uploadToCloudinary(files.file[0].buffer, "articles/files", "raw");
    }

    // Convert tags string to array
    const tags = typeof req.body.tags === "string"
      ? req.body.tags.split(",").map(t => t.trim()).filter(Boolean)
      : req.body.tags || [];

    // Save article in MongoDB
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: tags,
      image: imageUrl,
      video: videoUrl,
      file: fileUrl,
      versions: [{ content: req.body.content, updatedAt: new Date() }],
      createdBy: req.user.id,
    });
    
    res.status(201).json(article);
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: "Failed to create article", error: error.message });
  }
};

// SEARCH ARTICLES
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
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

// UPDATE ARTICLE
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const files = req.files || {};
    if (files.image && files.image[0]) {
      article.image = await uploadToCloudinary(files.image[0].buffer, "articles/images");
    }
    if (files.video && files.video[0]) {
      article.video = await uploadToCloudinary(files.video[0].buffer, "articles/videos", "video");
    }
    if (files.file && files.file[0]) {
      article.file = await uploadToCloudinary(files.file[0].buffer, "articles/files", "raw");
    }
    // DELETE FLAGS
if (req.body.deleteImage === "true") {
  article.image = null;
}

if (req.body.deleteVideo === "true") {
  article.video = null;   // <-- this was missing before
}

if (req.body.deleteFile === "true") {
  article.file = null;
}

    // Convert tags string to array
    const tags = typeof req.body.tags === "string"
      ? req.body.tags.split(",").map(t => t.trim()).filter(Boolean)
      : req.body.tags || [];

    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;
    article.category = req.body.category || article.category;
    article.tags = tags;
    article.versions.push({ content: article.content, updatedAt: new Date() });

    await article.save();
    res.json(article);
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

// DELETE ARTICLE
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    await article.deleteOne();
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};
