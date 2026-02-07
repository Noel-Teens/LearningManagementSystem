import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateArticle.css";
function CreateArticle() {
  
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [file, setFile] = useState("");
  const [mediaTab, setMediaTab] = useState("image");
  const navigate = useNavigate();
  const createArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append(
        "tags",
        tags.split(",").map(t => t.trim()).filter(Boolean)
      );

      if (image) formData.append("image", image);
      if (video) formData.append("video", video);
      if (file) formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/articles",
        
          formData,
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
        {/* MEDIA TABS */}
        <div className="tabs media-tabs">
          <button
            type="button"
            className={`tab-button ${mediaTab === "image" ? "active" : ""}`}
            onClick={() => setMediaTab("image")}
          >
            Image
          </button>

          <button
            type="button"
            className={`tab-button ${mediaTab === "video" ? "active" : ""}`}
            onClick={() => setMediaTab("video")}
          >
            Video
          </button>

          <button
            type="button"
            className={`tab-button ${mediaTab === "file" ? "active" : ""}`}
            onClick={() => setMediaTab("file")}
          >
            Attachment
          </button>
        </div>

        {/* MEDIA CONTENT */}
        {mediaTab === "image" && (
          <div className="media-tab">
            <label className="file-label">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="auth-file-input"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}

        {mediaTab === "video" && (
          <div className="media-tab">
            <label className="file-label">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              className="auth-file-input"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>
        )}

        {mediaTab === "file" && (
          <div className="media-tab">
            <label className="file-label">
              Upload Attachment (PDF / DOC / PPT)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              className="auth-file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        )}

        <button className="primary-btn" onClick={createArticle} disabled={loading}>
          {loading ? "Saving..." : "Save Article"}
        </button>

        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
}

export default CreateArticle;
