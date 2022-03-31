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
  if (
    !(
      process.env.NETLIFY_DEV === "true" ||
      (event.headers.referrer &&
        event.headers.referrer.includes("pgh-live.netlify.app"))
    )
  ) {
    return {
      statusCode: 401,
      body: JSON.stringify("Unauthorized")
    };
  }

  const results = await Promise.all([
    getEvents(spirit),
    getEvents(smalls),
    getEvents(thunderbird)
  ]);

  // console.log(results[2]);

  const events = results.flatMap(r => r);

  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
