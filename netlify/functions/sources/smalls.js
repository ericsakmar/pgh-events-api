const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs
      .readFileSync("./netlify/functions/sources/smalls.html")
      .toString();

    return local;
  }

  const res = await fetch("https://mrsmalls.com/listing");
  const body = await res.text();
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".event")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".show-title")
        .text()
        .trim();

      const rawDate = n
        .find(".date-show")
        .attr("content")
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });
      const d2 = chrono.parseDate(rawDate);
      console.log(date, d2);

      const location = n
        .find(".venue-location-name")
        .text()
        .trim();

      const link = n
        .find(".more-info")
        .attr("href")
        .trim();

      return { title, date, d2, location, link, source: "SMALLS" };
    });

  return events;
};
