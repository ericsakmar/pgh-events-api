const cheerio = require("cheerio");
const chrono = require("chrono-node");
const fetchPage = require("./fetchPage");

const url = "http://belvederesultradive.com/";

exports.getEvents = async () => {
  const data = await fetchPage.fetchPage(url);

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
        source: url,
        hasTime: false // 9pm, or in the event description
      };
    })
    .filter(e => e.title !== "");

  return events;
};
