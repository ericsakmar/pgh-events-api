const fs = require("fs");
const cheerio = require("cheerio");
const { parse } = require("date-fns");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    console.log("local");
    const local = fs
      .readFileSync("./netlify/functions/sources/spirit.html")
      .toString();

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

      const date = chrono.parseDate(`${rawDate} ${rawTime}`);

      const location = n
        .find(".eventlist-meta-address strong")
        .text()
        .trim();

      // const link = n
      //   .find(".more-info")
      //   .attr("href")
      //   .trim();
      const link = "TODO";

      return { title, date, location, link, source: "SPIRIT" };
    });

  return events;
};
