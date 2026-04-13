const express = require("express");
const path = require("path");

const fetchIndiaNews = require("./fetchNews");

const app = express();

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/api/news", async (req, res) => {
  try {

    const articles = await fetchIndiaNews();

    const cleaned = articles.map(article => ({
      title: article.title,
      description: article.description, // ✅ now sent to frontend
      image: article.image,
      source: article.source,
      url: article.url
    }));

    res.json(cleaned);

  } catch (err) {

    console.error(err);
    res.status(500).send("Failed to fetch news");

  }
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);