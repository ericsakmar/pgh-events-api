const fetch = require("node-fetch");
const AbortController = require("abort-controller");

exports.fetchPage = async url => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 9000);

  const res = await fetch(url, {
    signal: controller.signal
  });

  clearTimeout(id);

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
