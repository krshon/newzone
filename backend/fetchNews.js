const Parser = require("rss-parser");

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["content:encoded", "contentEncoded"]
    ]
  }
});

async function fetchIndiaNews() {
  try {
    const feed = await parser.parseURL(
      "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
    );

    const articles = feed.items.map(article => {
      // Extract source from title (Google format: "... - Source")
      const titleParts = article.title.split(" - ");
      const source =
        titleParts.length > 1
          ? titleParts.pop()
          : "Unknown";

      const cleanTitle =
        titleParts.join(" - ") || article.title;

      return {
        title: cleanTitle,
        description: article.contentSnippet || "",
        source: source,
        link: article.link,
        publishedAt: article.pubDate
      };
    });

    return articles;
  } catch (err) {
    console.error("RSS fetch failed:", err.message);
    return [];
  }
}

module.exports = fetchIndiaNews;