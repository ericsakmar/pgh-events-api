const cheerio = require("cheerio");
const chrono = require("chrono-node");
const fetchPage = require("./fetchPage");

const url = "https://jergels.com/calendar/";

exports.getEvents = async () => {
  const data = await fetchPage.fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".article-block")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find("img")
        .attr("alt")
        .trim();

      const rawDate = n
        .find(".article-content")
        .text()
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = "Jergel's Rhythm Grille";

      const link = n
        .find("a")
        .attr("href")
        .trim();

      return { title, date, location, link, source: url, hasTime: false };
    });

  return events;
};
