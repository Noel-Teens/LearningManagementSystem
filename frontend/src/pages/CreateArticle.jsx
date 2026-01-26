import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateArticle() {
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/articles",
        {
          title,
          content,
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      setSuccess("Article created successfully!");

      // Navigate immediately to the new article page
      // Ensure _id exists
const articleId = res.data.article?._id || res.data._id;

if (!articleId) {
  alert("Article created but no ID returned from server");
  return;
}
navigate(`/article/${articleId}`, { replace: true });

    } catch (error) {
      console.error("Create article failed:", error.response?.data || error.message);
      alert("Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Article (Admin)</h2>
        <p className="auth-subtitle">Add new knowledge content</p>

        <input
          className="auth-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <textarea
          className="auth-input"
          placeholder="Content"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="primary-btn" onClick={createArticle} disabled={loading}>
          {loading ? "Saving..." : "Save Article"}
        </button>

        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
}

export default CreateArticle;
