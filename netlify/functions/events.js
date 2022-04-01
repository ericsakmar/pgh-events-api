const blackforge = require("./sources/blackforge.js");
const brillo = require("./sources/brillo.js");
const clubcafe = require("./sources/clubcafe.js");
const kingfly = require("./sources/kingfly.js");
const preserving = require("./sources/preserving.js");
const roboto = require("./sources/roboto.js");
const roxian = require("./sources/roxian.js");
const smalls = require("./sources/smalls.js");
const spirit = require("./sources/sprirt.js");
const thunderbird = require("./sources/thunderbird.js");

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
    getEvents(blackforge),
    getEvents(brillo),
    getEvents(clubcafe),
    getEvents(kingfly),
    getEvents(preserving),
    getEvents(roboto),
    getEvents(roxian),
    getEvents(smalls),
    getEvents(spirit),
    getEvents(thunderbird)
  ]);

  const events = results.flatMap(r => r);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
