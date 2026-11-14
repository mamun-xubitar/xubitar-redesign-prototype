// Full-page screenshots of every prototype page (desktop + mobile).
// Usage: node files/design/_src/shoot.mjs [baseUrl] [outDir] [page1.html,page2.html]
// Requires the static server (python3 -m http.server 4173 --directory files/design).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || "http://127.0.0.1:4173";
const outDir = resolve(process.argv[3] || resolve(here, "..", "screens"));
const only = process.argv[4] ? process.argv[4].split(",") : null;

const pages = [
  "start-here.html", "index.html", "services.html",
  "service-shopify-development.html", "service-shopify-support.html", "service-ai-automation.html",
  "service-seo-ai-search.html", "service-custom-web.html", "work.html", "case-study.html",
  "agencies.html", "products.html", "about.html", "careers.html", "contact.html", "style-guide.html",
].filter((p) => !only || only.includes(p));

const viewports = [
  { name: "desktop", width: 1440, height: 900, scale: 1 },
  { name: "mobile", width: 390, height: 844, scale: 2, mobile: true },
];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.scale,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`${base}/${p}?review=0`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important}.chat,.review{display:none!important}" });
    await page.waitForTimeout(250);
    const file = `${outDir}/${vp.name}-${p.replace(".html", "")}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log("saved", file);
  }
  await ctx.close();
}
await browser.close();
