const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/conalmaEllsworth.html").toString();
    return local;
  }

  const res = await fetch("https://www.conalmapgh.com/ellsworth-events");
  const body = await res.text();
  // fs.writeFileSync("./test/conalmaEllsworth.html", body);
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
        .find(".eventlist-title")
        .text()
        .trim();

      const rawDate = n
        .find(".eventlist-meta-date")
        .text()
        .trim();

      const rawTime = n
        .find(".event-time-12hr-start")
        .text()
        .trim();

      const date = chrono.parseDate(`${rawDate} ${rawTime}`, {
        timezone: "EDT"
      });

      const location = "Con Alma - Ellsworth";

      const link = n
        .find(".eventlist-title-link")
        .attr("href")
        .trim();

      return {
        title,
        date,
        location,
        link: `https://www.conalmapgh.com${link}`,
        source: "CONALMAELLSWORTH"
      };
    });

  return events;
};
