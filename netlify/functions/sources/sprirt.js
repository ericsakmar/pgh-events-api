const rawEvents = require("./spirit-events.json");
const fetch = require("node-fetch");

const getData = async () => {
  if (process.env.NETLIFY_DEV === "true") {
    return rawEvents;
  }

  const res = await fetch("https://www.spiritpgh.com/events?format=json");
  const json = await res.json();
  return json;
};

exports.getEvents = async () => {
  const data = await getData();

  const events = data.items.map(e => ({
    title: e.title,
    // description: sanitizeHtml(e.body, { allowedTags: [] }).trim(),
    date: e.startDate,
    location: e.location.addressTitle,
    source: "SPIRIT",
    link: "TODO"
  }));

  return events;
};
