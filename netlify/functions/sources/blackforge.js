const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    const local = fs.readFileSync("./test/blackforge.html").toString();
    return local;
  }

  const res = await fetch("/.netlify/functions/page", {
    method: "GET",
    headers: {
      Authorization: process.env.CLIENT_SECRET
    }
  });
  const body = await res.text();

  // fs.writeFileSync("./netlify/functions/sources/blackforge.html", content);

  return body;
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
      source: "BLACKFORGE"
    }));

  return events;
};
