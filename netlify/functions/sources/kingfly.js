const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/kingfly.html").toString();
    return local;
  }

  const res = await fetch("https://www.kingflyspirits.com/events");
  const body = await res.text();
  // fs.writeFileSync("./test/kingfly.html", body);
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".summary-item-record-type-event")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".summary-title")
        .text()
        .trim();

      const rawDate = n
        .find(".summary-metadata-item--date")
        .first()
        .text()
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = "Kingfly Spirits";

      const link = n
        .find(".summary-title-link")
        .attr("href")
        .trim();

      return {
        title,
        date,
        location,
        link: `https://www.kingflyspirits.com${link}`,
        source: "KINGFLY"
      };
    });

  return events;
};
