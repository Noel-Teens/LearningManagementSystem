import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./search.css";
import { useAuth } from "../auth/context/AuthContext";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  // Normalize role (IMPORTANT)
  const userRole = (localStorage.getItem("role") || "")
    .toUpperCase()
    .trim();

  const search = async () => {
    if (!keyword.trim()) {
      alert("Please enter a keyword");
      return;
    }


    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/articles/search",
        {
          params: { keyword },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Search result:", res.data);
      setArticles(res.data);

      if (res.data.length === 0) {
        alert("No articles found");
      }
    } catch (err) {
      console.error("Search failed:", err.response || err);
      alert("Search failed. Try again.");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">Search Articles</h2>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            className="auth-input"
            type="text"
            placeholder="Enter keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />

          <button
            type="button"
            className="primary-btn"
            onClick={search}
          >
            Search
          </button>
        </div>

        <ul className="article-list">
          {articles.map((article) => (
            <li key={article._id} className="article-item">
              <h4
                onClick={() => navigate(`/article/${article._id}`)}
                style={{
                  cursor: "pointer",
                  color: "#4f46e5",
                }}
              >
                {article.title}
              </h4>
              <p>
                <strong>Category:</strong> {article.category}
              </p>
              <hr />
            </li>
          ))}
        </ul>

        {/* ✅ Create Article only for Admin & Trainer */}
        {["admin", "superadmin", "trainer"].includes(user?.role?.toLowerCase()) && (
          <button
            className="secondary-btn"
            style={{ width: "100%", marginTop: "20px" }}
            onClick={() => navigate("/admin/create")}
          >
            + Create Article
          </button>
        )}

      </div>
    </div>
  );
}

export default Search;

