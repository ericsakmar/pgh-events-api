const spirit = require("../../src/sprirt");

const getEvents = async source => await source.getEvents();

exports.handler = async function(_event, _context) {
  const results = await Promise.all([getEvents(spirit)]);

  const events = results
    .flatMap(r => r)
    .slice()
    .sort((a, b) => a.date - b.date);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
