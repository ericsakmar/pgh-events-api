const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/governmentCenter.html").toString();
    return local;
  }

  const res = await fetch("https://www.thegovernmentcenter.com/events");
  const body = await res.text();
  // fs.writeFileSync("./test/governmentCenter.html", body);
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".events")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".heading-27")
        .text()
        .trim();

      const rawDate = n
        .find(".date")
        .text()
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = n
        .find(".location")
        .text()
        .trim();

      const link = n.attr("href").trim();

      return {
        title,
        date,
        location,
        link: `https://www.thegovernmentcenter.com${link}`,
        source: "GOVERNMENTCENTER",
        hasTime: false
      };
    });

  return events;
};
