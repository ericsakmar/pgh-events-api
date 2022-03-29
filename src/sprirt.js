const rawEvents = require("./spirit-events.json");

exports.getEvents = async () => {
  const events = rawEvents.upcoming.map(e => ({
    title: e.title,
    description: e.body, // TODO remove html tags
    date: e.startDate,
    location: e.location.addressTitle,
    source: "SPIRIT"
  }));

  return events;
};
