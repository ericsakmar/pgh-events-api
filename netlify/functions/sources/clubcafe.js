const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/clubcafe.html").toString();
    return local;
  }

  const res = await fetch(
    "https://www.ticketweb.com/venue/club-cafe-pittsburgh-pa/23219?pl=opusfood.php"
  );
  const body = await res.text();
  // fs.writeFileSync("./test/clubcafe.html", body);
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
    .flatMap(events => events)
    .filter(event => event["@type"] === "TheaterEvent")
    .map(event => {
      return {
        title: event.name,
        date: event.startDate,
        location: event.location.name,
        link: event.url,
        source: "CLUBCAFE"
      };
    });

  return events;
};
