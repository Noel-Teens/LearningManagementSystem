import api from "../../shared/api/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();
  const canEdit = role === "admin" || role === "superadmin" || role === "trainer";
  const canDelete = role === "admin" || role === "superadmin";
  
  useEffect(() => {
    api
      .get(`/articles/${id}`)
      .then((res) => setArticle(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load article");
      });
  }, [id]);

  if (!article) return <p>Loading...</p>;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/articles/${id}`);
      alert("Article deleted successfully");
      navigate("/search");
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{article.title}</h2>

        <p className="meta">
          <strong>Category:</strong> {article.category}
        </p>
        <br />

        <p className="meta">
          <strong>Tags:</strong>{" "}
          {article.tags?.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </p>
        <br />

        <hr />

        {/* 🖼 IMAGE */}
        {article.image && (
          <>
            <h3><strong>Image</strong></h3>
            <img
              src={article.image}
              alt="Article"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                marginBottom: "15px",
              }}
            />
          </>
        )}

        {/* 🎥 VIDEO */}
        {article.video && (
          <>
            <h3><strong>Video</strong></h3>
            <video
              controls
              width="100%"
              style={{ marginBottom: "15px" }}
            >
              <source src={article.video} />
              Your browser does not support the video tag.
            </video>
          </>
        )}

        {/* 📄 FILE */}
        {article.file && (
          <>
            <h3><strong>Attachment</strong></h3><br />
            <a
              href={article.file}
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
            >
              Download File
            </a>
            <br />
            <br />
          </>
        )}

        <p className="article-content">
          <strong>Content:</strong> {article.content}
        </p>
        <br />

        <h3>
          <strong>Version History</strong>
        </h3>

        {article.versions.length === 0 && <p>No previous versions</p>}

        {article.versions
          .slice(0, -1)
          .reverse()
          .map((v, index) => (
            <div key={index} className="version-card">
              <p>
                <b>Updated At:</b>{" "}
                {new Date(v.updatedAt).toLocaleString()}
              </p>

              {/* version media */}
              {v.image && (
                <img
                  src={v.image}
                  alt="Version"
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              )}

              {v.video && (
                <video controls width="100%">
                  <source src={v.video} />
                </video>
              )}

              {v.file && (
                <p>
                  <a href={v.file} target="_blank" rel="noreferrer">
                    View attached file
                  </a>
                </p>
              )}

              <p>{v.content}</p>
              <br />
              <hr />
            </div>
          ))}

        {canEdit && (
          <button
            className="primary-btn"
            onClick={() => navigate(`/admin/edit/${id}`)}
          >
            Edit Article
          </button>
        )}

        {canDelete && (
          <div className="flex items-center justify-center">
            <button className="primary-btn" onClick={handleDelete}>
              Delete Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;
