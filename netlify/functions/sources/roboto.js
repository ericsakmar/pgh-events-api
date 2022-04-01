const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/roboto.html").toString();
    return local;
  }

  const res = await fetch("https://www.therobotoproject.com/calendar.html");
  const body = await res.text();

  // fs.writeFileSync("./test/roboto.html", body);
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".paragraph li")
    .toArray()
    .map(el => {
      const n = $(el);

      const rawDate = n
        .find("strong")
        .text()
        .trim();

      const title = n
        .text()
        .trim()
        .replace(rawDate, "")
        .replace("(Tickets here)", "")
        .replace("(Information here)", "")
        .replace("(Info here)", "")
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = "The Mr. Roboto Project";

      const link = n
        .find("a")
        .attr("href")
        .trim();

      return { title, date, location, link, source: "ROBOTO" };
    });

  return events;
};
