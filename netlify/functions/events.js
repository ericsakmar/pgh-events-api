const fetch = require("node-fetch");

const belvederes = require("./sources/belvederes.js");
const blackforge = require("./sources/blackforge.js");
const brillo = require("./sources/brillo.js");
const clubcafe = require("./sources/clubcafe.js");
const conAlmaDowntown = require("./sources/conalmaDowntown.js");
const conAlmaEllsworth = require("./sources/conalmaEllsworth.js");
const governmentCenter = require("./sources/governmentcenter.js");
const kingfly = require("./sources/kingfly.js");
const preserving = require("./sources/preserving.js");
const roboto = require("./sources/roboto.js");
const roxian = require("./sources/roxian.js");
const smalls = require("./sources/smalls.js");
const spirit = require("./sources/sprirt.js");
const stageae = require("./sources/stageae.js");
const thunderbird = require("./sources/thunderbird.js");

require("dotenv").config();

const getEventsWithBackup = backup => async source => {
  try {
    return await source.getEvents();
  } catch (error) {
    console.error(error);

    const old = backup.filter(event => event.source === error.url);
    return old;
  }
};

const getCurrent = async () => {
  const res = await fetch("https://pgh.events/page-data/index/page-data.json");
  const pageData = await res.json();
  return pageData.result.data.allEvents.edges.map(e => e.node);
};

exports.handler = async function(event, _context) {
  if (event.headers.authorization !== process.env.CLIENT_SECRET) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "forbidden" })
    };
  }

  const backup = await getCurrent();
  const getEvents = getEventsWithBackup(backup);

  const results = await Promise.all([
    getEvents(belvederes),
    getEvents(blackforge),
    getEvents(brillo),
    getEvents(clubcafe),
    getEvents(conAlmaDowntown),
    getEvents(conAlmaEllsworth),
    getEvents(governmentCenter),
    getEvents(kingfly),
    getEvents(preserving),
    getEvents(roboto),
    getEvents(roxian),
    getEvents(smalls),
    getEvents(spirit),
    getEvents(stageae),
    getEvents(thunderbird)
  ]);

  const events = results.flatMap(r => r);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
