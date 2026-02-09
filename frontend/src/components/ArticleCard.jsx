import "./article.css";

export default function ArticleCard() {
  const role = localStorage.getItem("role");

  return (
    <div className="article-card">
      <h3>Introduction to React</h3>

      <div className="article-meta">
        <span className="category">Frontend</span>
        <span className="tag">#react</span>
        <span className="tag">#javascript</span>
      </div>

      <p className="article-text">
        React is a JavaScript library for building user interfaces.
      </p>

      {role === "ADMIN" && (
        <button className="edit-btn">Edit Article</button>
      )}
    </div>
  );
}
