const rawEvents = require("./spirit-events.json");
const sanitizeHtml = require("sanitize-html");

exports.getEvents = async () => {
  const events = rawEvents.upcoming.map(e => ({
    title: e.title,
    description: sanitizeHtml(e.body, { allowedTags: [] }).trim(),
    date: e.startDate,
    location: e.location.addressTitle,
    source: "SPIRIT"
  }));

  return events;
};
