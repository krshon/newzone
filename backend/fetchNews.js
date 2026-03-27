const Parser = require("rss-parser");
const parser = new Parser();

async function fetchIndiaNews() {
  const feed = await parser.parseURL(
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
  );

  const articles = feed.items.map(article => ({
    title: article.title,
    link: article.link,
    source: article.source?.title || "Unknown",
    publishedAt: article.pubDate
  }));

  return articles;
}

module.exports = fetchIndiaNews;