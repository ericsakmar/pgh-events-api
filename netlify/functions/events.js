const spirit = require("./sources/sprirt.js");
const smalls = require("./sources/smalls.js");
const thunderbird = require("./sources/thunderbird.js");
const blackforge = require("./sources/blackforge.js");
require("dotenv").config();

const getEvents = async source => {
  try {
    return await source.getEvents();
  } catch (e) {
    console.error(e);
  }
};

exports.handler = async function(event, _context) {
  if (event.headers.authorization !== process.env.CLIENT_SECRET) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "forbidden" })
    };
  }

  const results = await Promise.all([
    getEvents(spirit),
    getEvents(smalls),
    getEvents(thunderbird),
    getEvents(blackforge)
  ]);

  const events = results.flatMap(r => r);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
