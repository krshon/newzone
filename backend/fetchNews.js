const axios = require("axios");
require("dotenv").config();

async function fetchIndiaNews() {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&pageSize=50&apiKey=${process.env.NEWS_API_KEY}`
    );

    const formattedNews = response.data.articles
      .filter(article => article.urlToImage)
      .map(article => ({
        title: article.title || "No title available",
        description:
          article.description ||
          article.content ||
          "Click to read full article...",
        image: article.urlToImage,
        source: article.source?.name || "Unknown source",
        url: article.url
      }));

    return formattedNews;

  } catch (err) {
    console.error("News fetch failed:", err.response?.data || err.message);
    return [];
  }
}

module.exports = fetchIndiaNews;