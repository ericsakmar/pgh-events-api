const fetch = require("node-fetch");

exports.fetchPage = async url => {
  const res = await fetch(url);
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
