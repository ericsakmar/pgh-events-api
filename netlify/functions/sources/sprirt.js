const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/spirit.html").toString();

    return local;
  }

  const res = await fetch("https://www.spiritpgh.com/events?view=list");
  const body = await res.text();
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".eventlist-event")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".entry-title")
        .text()
        .trim();

      const rawDate = n
        .find(".eventlist-meta-date")
        .text()
        .trim();

      const rawTime = n
        .find(".event-time-12hr")
        .text()
        .trim()
        .split(" ")[0];

      const date = chrono.parseDate(`${rawDate} ${rawTime}`, {
        timezone: "EDT"
      });

      const location = n
        .find(".eventlist-meta-address strong")
        .text()
        .trim();

      const rawLink = n
        .find(".main-image-wrapper a")
        .attr("href")
        .trim();

      const link = `https://spiritpgh.com${rawLink}`;

      return { title, date, location, link, source: "SPIRIT" };
    });

  return events;
};
