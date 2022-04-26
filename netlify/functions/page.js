const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
require("dotenv").config();

// we need to keep the puppeteer stuff in a seprate function because it makes the bundle size too big
exports.handler = async function(event, _context) {
  if (event.headers.authorization !== process.env.CLIENT_SECRET) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "forbidden" })
    };
  }

  const { url, selector } = event.queryStringParameters;

  try {
    const content = await getPageContent(url, selector);

    return {
      statusCode: 200,
      body: content
    };
  } catch {
    // timeout
    return {
      statusCode: 408,
      body: JSON.stringify({ message: `Timeout expired for ${url}` })
    };
  }
};

const getPageContent = async (url, selector) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(7000);
  page.setDefaultTimeout(7000);
  await page.goto(url);
  await page.waitForSelector(selector);
  const content = await page.content();
  await browser.close();

  return content;
};
