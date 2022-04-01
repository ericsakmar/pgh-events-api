const fs = require("fs");
const cheerio = require("cheerio");
const fetchDynamicPage = require("./fetchDynamicPage");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/blackforge.html").toString();
    return local;
  }

  const url = "https://blackforgecoffee.com/pages/events";
  const waitForSelector = ".eaec-grid-item-info";

  const data = await fetchDynamicPage.fetchDynamicPage(url, waitForSelector);

  return data;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(".eaec-grid-item script")
    .toArray()
    .map(el => {
      const ldJson = el.children[0].data;
      const json = JSON.parse(ldJson);
      return json;
    })
    .filter(event => event.location.name !== undefined)
    .map(event => ({
      title: event.name,
      date: event.startDate,
      location: event.location.name,
      link: "https://blackforgecoffee.com/pages/events",
      source: "BLACKFORGE"
    }));

  return events;
};
