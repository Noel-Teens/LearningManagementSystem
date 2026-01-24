import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  
  const createArticle = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/articles",
      {
        title,
        content,
        category,
        tags: tags.split(",").map(t => t.trim())
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    navigate("/search");
  } catch (error) {
    console.error("Create article failed:", error.response?.data || error.message);
    alert("Failed to create article");
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
        onChange={e => setTitle(e.target.value)}
      />

      <input
        className="auth-input"
        placeholder="Category"
        onChange={e => setCategory(e.target.value)}
      />

      <input
        className="auth-input"
        placeholder="Tags (comma separated)"
        onChange={e => setTags(e.target.value)}
      />

      <input
        className="auth-input"
        placeholder="Content"
        onChange={e => setContent(e.target.value)}
      />

      <button className="primary-btn" onClick={createArticle}>
        Save Article
      </button>

    </div>
  </div>
);

}

export default CreateArticle;