const fetchIndiaNews = require("./fetchNews");

async function test() {
  const articles = await fetchIndiaNews();

  articles.slice(0, 5).forEach((a, i) => {
    console.log(`${i + 1}. ${a.title}`);
  });
}

test();