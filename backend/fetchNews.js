const axios = require("axios");
require("dotenv").config();

async function fetchIndiaNews() {
  try {

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
    );

    return response.data.articles
      .filter(article => article.urlToImage) // keep only articles with images
      .map(article => ({
        title: article.title,
        image: article.urlToImage,
        source: article.source.name,
        url: article.url
      }));

  } catch (err) {
    console.error("News fetch failed:", err.response?.data || err.message);
    return [];
  }
}

module.exports = fetchIndiaNews;