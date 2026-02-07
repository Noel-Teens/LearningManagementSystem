import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditArticle.css";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  // existing media (URLs)
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  // new uploads
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);

  // Media tab state
  const [mediaTab, setMediaTab] = useState("image");

  // Delete flags
  const [deleteImageFlag, setDeleteImageFlag] = useState(false);
  const [deleteVideoFlag, setDeleteVideoFlag] = useState(false);
  const [deleteFileFlag, setDeleteFileFlag] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setContent(res.data?.content || "");
        setCategory(res.data?.category || "");
        setTags(Array.isArray(res.data?.tags) ? res.data.tags.join(", ") : "");

        setImageUrl(res.data?.image || null);
        setVideoUrl(res.data?.video || null);
        setFileUrl(res.data?.file || null);

        // Reset delete flags in case
        setDeleteImageFlag(false);
        setDeleteVideoFlag(false);
        setDeleteFileFlag(false);
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);
      formData.append("category", category);
      formData.append(
        "tags",
        tags.split(",").map(t => t.trim()).filter(Boolean)
      );

      if (image) formData.append("image", image);
      if (video) formData.append("video", video);
      if (file) formData.append("file", file);

      // Append delete flags if set
      if (deleteImageFlag) formData.append("deleteImage", "true");
      if (deleteVideoFlag) formData.append("deleteVideo", "true");
      if (deleteFileFlag) formData.append("deleteFile", "true");

      const res = await axios.put(
        `http://localhost:5000/api/articles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const articleId = res.data._id || id;
      navigate(`/article/${articleId}`, { replace: true });
    } catch (error) {
      console.error("Update article error:", error.response?.data || error.message);
      alert("Failed to update article");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Edit Article (Admin)</h2>
        <p className="auth-subtitle">Update article details</p>

        <label className="form-label">Category</label>
        <input
          className="auth-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label className="form-label">Tags (comma separated)</label>
        <input
          className="auth-input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <label className="form-label">Content</label>
        <textarea
          className="auth-input"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Existing Media Preview with Delete */}
        {imageUrl && (
          <>
            <label className="form-label">Current Image</label>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <img
                src={imageUrl}
                alt="Article"
                style={{ width: "100%" }}
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null);
                  setImage(null);
                  setDeleteImageFlag(true);
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                aria-label="Delete Image"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {videoUrl && (
          <>
            <label className="form-label">Current Video</label>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <video controls width="100%">
                <source src={videoUrl} />
              </video>
              <button
                type="button"
                onClick={() => {
                  setVideoUrl(null);
                  setVideo(null);
                  setDeleteVideoFlag(true);
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                aria-label="Delete Video"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {fileUrl && (
          <>
            <label className="form-label">Current File</label>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-block", marginRight: "10px" }}
              >
                View / Download File
              </a>
              <button
                type="button"
                onClick={() => {
                  setFileUrl(null);
                  setFile(null);
                  setDeleteFileFlag(true);
                }}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                aria-label="Delete File"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {/* Media Tabs */}
        <div className="tabs media-tabs" style={{ marginTop: "20px" }}>
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

        {/* Media Inputs */}
        {mediaTab === "image" && (
          <div className="media-tab" style={{ marginTop: "15px" }}>
            <label className="file-label">Replace Image</label>
            <input
              type="file"
              accept="image/*"
              className="auth-file-input"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}

        {mediaTab === "video" && (
          <div className="media-tab" style={{ marginTop: "15px" }}>
            <label className="file-label">Replace Video</label>
            <input
              type="file"
              accept="video/*"
              className="auth-file-input"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>
        )}

        {mediaTab === "file" && (
          <div className="media-tab" style={{ marginTop: "15px" }}>
            <label className="file-label">Replace File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              className="auth-file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        )}

        <button
          className="primary-btn"
          onClick={updateArticle}
          style={{ marginTop: "30px" }}
        >
          Update Article
        </button>
      </div>
    </div>
  );
}

export default EditArticle;
