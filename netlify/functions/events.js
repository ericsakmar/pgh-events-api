const spirit = require("./sources/sprirt.js");
const smalls = require("./sources/smalls.js");

// TODO error handling/logging
const getEvents = async source => await source.getEvents();

exports.handler = async function(_event, _context) {
  const results = await Promise.all([getEvents(spirit), getEvents(smalls)]);
  const events = results.flatMap(r => r);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
