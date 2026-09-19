/* Visual + smoke check. Not part of the site build.
   node tools/shots.mjs   (dev server must be running on :8080) */
import { chromium } from "playwright";
import fs from "node:fs";

const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = "http://localhost:8080";
const OUT = process.env.SHOT_DIR || "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["research", "/research/"],
  ["cv", "/cv/"],
  ["art", "/art/"],
  ["research-blog", "/research-blog/"],
  ["post", "/research-blog/writing-a-post/"],
  ["art-blog", "/art-blog/"],
];

const problems = [];

const browser = await chromium.launch({ executablePath: EXE });

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 980 },
    deviceScaleFactor: 2,
    colorScheme: scheme,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console [${scheme}] ${page.url()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror [${scheme}] ${page.url()}: ${e.message}`));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (u.startsWith(BASE)) problems.push(`404? [${scheme}] ${u}`);
  });

  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${name}-${scheme}.png` });
    if (name === "home" || name === "art-blog") {
      await page.screenshot({ path: `${OUT}/${name}-${scheme}-full.png`, fullPage: true });
    }
  }
  await ctx.close();
}

/* --- behaviour checks ----------------------------------------------------- */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

await page.goto(BASE + "/", { waitUntil: "networkidle" });

// 1. Router swaps the panel without a full reload.
await page.evaluate(() => { window.__marker = "kept"; });
await page.click('.nav__link[href="/research/"]');
await page.waitForTimeout(700);
const kept = await page.evaluate(() => window.__marker === "kept");
const url = page.url();
const heading = await page.textContent(".sectionbar__title");
if (!kept) problems.push("router: full page reload happened (marker lost)");
if (!url.endsWith("/research/")) problems.push(`router: URL is ${url}`);
if ((heading || "").trim() !== "Research") problems.push(`router: section bar says "${heading}"`);

// 2. Back button restores the previous panel.
await page.goBack();
await page.waitForTimeout(600);
const backHeading = (await page.textContent(".sectionbar__title")) || "";
if (backHeading.trim() !== "Home") problems.push(`router: back gave "${backHeading}"`);

// 3. Theme toggle cycles and persists.
const before = await page.getAttribute("html", "data-theme");
await page.click("#theme-toggle");
await page.waitForTimeout(250);
const afterPref = await page.getAttribute("html", "data-theme-pref");
await page.reload({ waitUntil: "networkidle" });
const persisted = await page.getAttribute("html", "data-theme-pref");
if (persisted !== afterPref) problems.push(`theme: ${afterPref} did not persist (got ${persisted})`);

// 4. Cursor highlight variables get written on the sidebar.
await page.mouse.move(120, 400);
await page.waitForTimeout(200);
const mx = await page.evaluate(() =>
  getComputedStyle(document.getElementById("sidebar")).getPropertyValue("--mx").trim()
);
if (!mx) problems.push("glass: --mx was not set on pointer move");

// 5. Section bar highlights while scrolling.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  const h = document.getElementById("background");
  if (h) h.scrollIntoView();
});
await page.waitForTimeout(900);
const current = await page.evaluate(() => {
  const el = document.querySelector(".sectionbar__link.is-current");
  return el ? el.textContent.trim() : null;
});
if (!current) problems.push("sectionbar: no link marked current after scrolling");

// 6. Map renders markers.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const markers = await page.evaluate(() => document.querySelectorAll(".map-pin").length);
if (markers === 0) problems.push("map: no pins rendered (offline is expected in CI)");

// 7. Mobile drawer.
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mp = await m.newPage();
for (const [name, path] of [["home", "/"], ["art-blog", "/art-blog/"], ["research", "/research/"]]) {
  await mp.goto(BASE + path, { waitUntil: "networkidle" });
  await mp.waitForTimeout(400);
  await mp.screenshot({ path: `${OUT}/${name}-mobile.png` });
}
await mp.goto(BASE + "/", { waitUntil: "networkidle" });
await mp.click("#sidebar-toggle");
await mp.waitForTimeout(500);
const open = await mp.evaluate(() => document.getElementById("sidebar").classList.contains("is-open"));
if (!open) problems.push("mobile: drawer did not open");
await mp.screenshot({ path: `${OUT}/mobile-drawer.png` });

// 8. Horizontal overflow check at phone width.
const overflow = await mp.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth
);
if (overflow > 2) problems.push(`mobile: ${overflow}px of horizontal overflow`);

await browser.close();

console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "All checks passed.");
console.log("shots in " + OUT);
