const fs = require("fs");
const cheerio = require("cheerio");
const fetchDynamicPage = require("./fetchDynamicPage");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/brillo.html").toString();
    return local;
  }

  const url = "http://www.brilloboxpgh.com/events/";
  const waitForSelector = ".eo-eb-event-box";

  const data = await fetchDynamicPage.fetchDynamicPage(url, waitForSelector);
  // fs.writeFileSync("./test/brillo.html", data);

  return data;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".eo-eb-event-box")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".eo-eb-event-title")
        .text()
        .trim();

      const rawDate = n
        .find(".eo-eb-date-container")
        .text()
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = "Brillobox";

      const link = n
        .find(".eo-eb-event-title a")
        .attr("href")
        .trim();

      return {
        title,
        date,
        location,
        link,
        source: "BRILLO",
        hasTime: false // you may be able to get it from the event description
      };
    });

  return events;
};
