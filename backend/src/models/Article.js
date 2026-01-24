const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  tags: [String],
  versions: [
    {
      content: String,
      updatedAt: Date
    }
  ]
});

module.exports =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

