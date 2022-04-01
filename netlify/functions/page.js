const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
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

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true
  });

  const page = await browser.newPage();
  await page.goto("https://blackforgecoffee.com/pages/events");
  await page.waitForSelector(".eaec-grid-item-info");
  const content = await page.content();
  await browser.close();

  return {
    statusCode: 200,
    body: content
  };
};
