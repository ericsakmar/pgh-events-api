const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/roxian.html").toString();
    return local;
  }

  const res = await fetch(
    "https://www.livenation.com/venue/KovZ917Ax13/roxian-theatre-events"
  );
  const body = await res.text();
  // fs.writeFileSync("./test/roxian.html", body);
  return body;
};

exports.getEvents = async () => {
  const data = await getData();

  const $ = cheerio.load(data);

  const events = $(`head script[type="application/ld+json"]`)
    .toArray()
    .map(el => {
      const ldJson = el.children[0].data;
      const json = JSON.parse(ldJson);
      return json;
    })
    .filter(event => event["@type"] === "MusicEvent")
    .map(event => ({
      title: event.name,
      date: event.startDate,
      location: event.location.name,
      link: event.url,
      source: "ROXIAN",
      hasTime: true
    }));

  return events;
};
