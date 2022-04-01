const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/thunderbird.html").toString();

    return local;
  }

  const res = await fetch("https://thunderbirdmusichall.com/shows/?view=list");
  const body = await res.text();
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  // works its way up the siblings until it has one that has the month/year
  const getYear = n => {
    let year = $(n.prev());
    while (!year.hasClass("rhp-events-list-separator-month")) {
      year = $(year.prev());
    }

    return year
      .text()
      .trim()
      .split(" ")[1];
  };

  const events = $(".eventWrapper")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find("#eventTitle")
        .attr("title")
        .trim();

      const day = n
        .find("#eventDate")
        .text()
        .trim();

      const year = getYear(n);

      const time = n
        .find(".eventDoorStartDate")
        .text()
        .trim()
        .split(" ")[1];

      const rawDate = `${day} ${year} at ${time}`;

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = n
        .find(".venueLink")
        .text()
        .trim();

      const link = n
        .find("#eventTitle")
        .attr("href")
        .trim();

      return {
        title,
        date: date.toUTCString(),
        location,
        link,
        source: "THUNDERBIRD"
      };
    });

  return events;
};
