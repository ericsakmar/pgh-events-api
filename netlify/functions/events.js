const spirit = require("./sources/sprirt.js");
const smalls = require("./sources/smalls.js");
const thunderbird = require("./sources/thunderbird.js");

const getEvents = async source => {
  try {
    return await source.getEvents();
  } catch (e) {
    console.error(e);
  }
};

exports.handler = async function(event, _context) {
  const results = await Promise.all([
    getEvents(spirit),
    getEvents(smalls),
    getEvents(thunderbird)
  ]);

  const events = results.flatMap(r => r);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
