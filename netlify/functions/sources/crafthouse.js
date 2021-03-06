const cheerio = require("cheerio");
const chrono = require("chrono-node");
const fetchPage = require("./fetchPage");

const url = "http://www.crafthousepgh.com/stage/list/";

exports.getEvents = async () => {
  const data = await fetchPage.fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".type-tribe_events")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".tribe-event-url")
        .text()
        .trim();

      const rawDate = n
        .find(".tribe-event-date-start")
        .text()
        .trim()
        .replace("@", "at");

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = n
        .find(".tribe-events-venue-details a")
        .text()
        .trim();

      const link = n
        .find(".tribe-event-url")
        .attr("href")
        .trim();

      return { title, date, location, link, source: url, hasTime: true };
    });

  return events;
};
