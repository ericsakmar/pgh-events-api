const fetch = require("node-fetch");
const AbortController = require("abort-controller");

const getPage = async (url, waitForSelector) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 9000);

  const res = await fetch(
    `https://pgh-events-api.netlify.app/.netlify/functions/page?url=${encodeURIComponent(
      url
    )}&selector=${encodeURIComponent(waitForSelector)}`,
    {
      method: "GET",
      headers: {
        Authorization: process.env.CLIENT_SECRET
      },
      signal: controller.signal
    }
  );

  clearTimeout(id);

  return res;
};

exports.fetchDynamicPage = async (url, waitForSelector) => {
  let res;

  try {
    res = await getPage(url, waitForSelector);
  } catch (exception) {
    const error = {
      exception,
      url
    };

    throw error;
  }

  const body = await res.text();

  if (res.ok) {
    return body;
  }

  const error = {
    code: res.status,
    url,
    body
  };

  throw error;
};
