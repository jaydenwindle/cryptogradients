import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

export default async (req, res) => {
  const { gradient } = req.query;
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: (await chromium.executablePath) || undefined,
    headless: chromium.headless,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1024,
      height: 1024,
    },
  });

  const color1 = `#${gradient.slice(0, 6)}`;
  const color2 = `#${gradient.slice(6, 12)}`;

  await page.setContent(
    `<html><body style="background: linear-gradient(135deg, ${color1}, ${color2})"></body></html>`
  );
  const data = await page.screenshot({
    type: "png",
  });
  await browser.close();

  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  res.setHeader("Content-Type", "image/png");

  res.end(data);
};
