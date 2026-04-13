const express = require("express");
const path = require("path");
const axios = require("axios");

const fetchIndiaNews = require("./fetchNews");

const app = express();

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/api/news", async (req, res) => {
  try {

    const articles = await fetchIndiaNews();

    // Send articles to FastAPI analyzer
    const analysis = await axios.post(
      "http://127.0.0.1:8000/analyze-news",
      { articles }
    );

    res.json(analysis.data.articles);

  } catch (err) {

    console.error(err.message);
    res.status(500).send("Failed to fetch analyzed news");

  }
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);