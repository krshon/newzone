const fetchIndiaNews = require("./fetchNews");

async function pipeline() {
  const articles = await fetchIndiaNews();

  console.log("Total articles fetched:", articles.length);
  console.log("\nFirst article:\n", articles[0]);
}

pipeline();