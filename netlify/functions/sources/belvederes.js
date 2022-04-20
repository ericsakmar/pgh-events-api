const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chrono = require("chrono-node");

const getData = async () => {
  // if (process.env.NETLIFY_DEV === "true") {
  //   const local = fs.readFileSync("./test/belvederes.html").toString();
  //   return local;
  // }

  const res = await fetch("http://belvederesultradive.com/");
  const body = await res.text();
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".eventbox")
    .toArray()
    .map(el => {
      const n = $(el);

      const title = n
        .find(".eventtextx")
        .text()
        .trim();

      const rawDate = n
        .find(".date")
        .text()
        .trim();

      const date = chrono.parseDate(rawDate, { timezone: "EDT" });

      const location = "Belvederes Ultra Dive";

      const link = n.find("a").attr("href");

      return {
        title,
        date,
        location,
        link,
        source: "BELVEDERES",
        hasTime: false // 9pm, or in the event description
      };
    })
    .filter(e => e.title !== "");

  return events;
};
