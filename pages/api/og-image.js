import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

import randomColor from "randomcolor";

export default async (req, res) => {
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: (await chromium.executablePath) || undefined,
    headless: chromium.headless,
  });

  const page = await browser.newPage({
    viewport: {
      width: 2048,
      height: 1170,
    },
  });

  const color1 = randomColor();
  const color2 = randomColor();

  await page.setContent(
    `<html>
      <head><link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"></head>
      <body style="background: linear-gradient(135deg, ${color1}, ${color2})">
      <div class="flex flex-col h-full w-full items-center justify-center">
        <h1 class="text-9xl font-bold mb-2 text-white">
          CryptoGradients
        </h1>
        <h2 class="text-5xl font-medium mb-12 text-white">
          10k unique gradients, stored on-chain
        </h2>
      </div>
      </body>
      </html>`
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

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
