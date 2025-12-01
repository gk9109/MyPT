import React from "react";

export default function DailyArticle({ article }) {
  if (!article) return null; // -> nothing to show yet

  // -> small helper to format date nicely
  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div id="DailyArticle" className="p-3">
      
      {/* -> Title */}
      <h2 style={{ fontWeight: "600", marginBottom: "10px" }}>
        {article.title}
      </h2>

      {/* -> Publication date */}
      {formattedDate && (
        <p style={{ fontSize: "0.9rem", color: "gray" }}>{formattedDate}</p>
      )}

      {/* -> Description / preview */}
      <p style={{ marginTop: "10px", lineHeight: "1.5" }}>
        {article.description || "No description available."}
      </p>

      {/* -> Open article button */}
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary mt-3"
        style={{ borderRadius: "8px" }}
      >
        Read Full Article
      </a>

      {/* 
        --------------------------------------
        -> Save button (if you add saving later)
        --------------------------------------

        <button className="btn btn-outline-secondary mt-3 ms-2">
          Save
        </button>
      */}
    </div>
  );
}
