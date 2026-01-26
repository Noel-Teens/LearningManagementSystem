import axios from "axios";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/context/AuthContext";
function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
const canEdit = role === "admin" || role === "superadmin" || role === "trainer";
const canDelete = role === "admin" || role === "superadmin";
  useEffect(() => {
    axios
  .get(`http://localhost:5000/api/articles/${id}`)
  .then(res => setArticle(res.data))
  .catch(err => {
    console.error(err);
    alert("Failed to load article");
  })

      
  }, [id]);

  if (!article) return <p>Loading...</p>;
  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this article?"
  );

  if (!confirmDelete) return;

  try {

    //alert(token);
    await api.delete(`/articles/${id}`), {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    alert("Article deleted successfully");
    navigate("/search"); // or admin dashboard
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
      </p><br />

      <p className="meta">
        <strong>Tags:</strong>{" "}
        {article.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </p><br />

      <hr />

      <p className="article-content"><strong>Content:</strong>{article.content}</p><br />
        <h3><strong>Version History</strong></h3>

          {article.versions.length === 0 && <p>No previous versions</p>}

          {article.versions
            .slice(0, -1)
            .reverse()
            .map((v, index) => (
              <div key={index} className="version-card">
                <p><b>Updated At:</b> {new Date(v.updatedAt).toLocaleString()}</p>
                <p>{v.content}</p><br />
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
  <div className="flex items-center justify-center primary-btn">
  <button
      
      onClick={handleDelete}
    >
      Delete Article
      
    </button>
    </div>
)}
    </div>
  </div>
);
}
    

export default ArticleDetails;