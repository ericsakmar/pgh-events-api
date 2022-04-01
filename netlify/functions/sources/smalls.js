const fs = require("fs");
const cheerio = require("cheerio");
const { parse } = require("date-fns");
const fetch = require("node-fetch");

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

      const date = parse(
        rawDate,
        "MMMM d',' yyyy h':'mm aaa",
        new Date()
      ).toISOString();

      const location = n
        .find(".venue-location-name")
        .text()
        .trim();

      const link = n
        .find(".more-info")
        .attr("href")
        .trim();

      return { title, date, location, link, source: "SMALLS" };
    });

  return events;
};
