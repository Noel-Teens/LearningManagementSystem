import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState(""); // string for input
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);

        setContent(res.data?.content || "");
        setCategory(res.data?.category || "");
        setTags(Array.isArray(res.data?.tags) ? res.data.tags.join(", ") : "");
      } catch (error) {
        console.error("Fetch article error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const updateArticle = async () => {
    try {
      const res = await api.put(`/articles/${id}`, {
        content,
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      const articleId = res.data.article?._id || res.data._id || id;

      navigate(`/article/${articleId}`,{raplace:true});
    } catch (error) {
      console.error("Update article error:", error);
      alert("Failed to update article");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
  <div className="auth-page">
    <div className="auth-card">

      <h2 className="auth-title">Edit Article (Admin)</h2>
      <p className="auth-subtitle">Update article details</p>

      <label className="form-label">Category</label>
      <input
        className="auth-input"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />

      <label className="form-label">Tags (comma separated)</label>
      <input
        className="auth-input"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <label className="form-label">Content</label>
      <textarea
        
          className="auth-input"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

      <button className="primary-btn" onClick={updateArticle}>
        Update Article
      </button>
      </div>
    </div>
  );
}

export default EditArticle;
