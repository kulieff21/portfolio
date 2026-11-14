// Screenshots of the four Twenion demo sites for the Twenion module (public/work/).
// node tools/capture-demos.mjs   (CHROME_PATH: a Chromium executable)
import { chromium } from "playwright-core";

const exe =
  process.env.CHROME_PATH ??
  "C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe";
const demos = {
  cargo: "https://twenion.github.io/cargo-site-demo/",
  ecommerce: "https://twenion.github.io/ecommerce-site-demo/",
  hotel: "https://twenion.github.io/hotel-site-demo/",
  manufacturing: "https://twenion.github.io/manufacturing-site-demo/",
};
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
for (const [slug, url] of Object.entries(demos)) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(3500); // let the hero animations settle
  await page.screenshot({ path: `public/work/demo-${slug}.jpg`, type: "jpeg", quality: 82 });
  console.log("saved", slug);
}
await browser.close();
