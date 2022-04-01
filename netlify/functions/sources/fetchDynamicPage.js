const fs = require("fs");
const fetch = require("node-fetch");

exports.fetchDynamicPage = async (url, waitForSelector) => {
  const res = await fetch(
    `https://pgh-events-api.netlify.app/.netlify/functions/page?url=${encodeURIComponent(
      url
    )}&selector=${encodeURIComponent(waitForSelector)}`,
    {
      method: "GET",
      headers: {
        Authorization: process.env.CLIENT_SECRET
      }
    }
  );

  const body = await res.text();
  return body;
};
