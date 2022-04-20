const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/preserving.html").toString();
    return local;
  }

  const res = await fetch("https://www.preservingunderground.com/shows");
  const body = await res.text();
  // fs.writeFileSync("./test/preserving.html", body);
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(`[data-hook="events-card"]`)
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(`[data-hook="title"]`)
        .text()
        .trim();

      const rawDate = n
        .find(`[data-hook="date"]`)
        .text()
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = "Preserving Underground";

      const link = n
        .find(`[data-hook="title"] a`)
        .attr("href")
        .trim();

      return {
        title,
        date,
        location,
        link,
        source: "PRESERVING",
        hasTime: true
      };
    });

  return events;
};
