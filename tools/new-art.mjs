#!/usr/bin/env node
/* Scaffold an art-blog entry.
 *
 *   npm run new:art -- "Cobb Gate at dusk" arts/photography/2026_3_cobb.jpeg
 *
 * The second argument is the image path relative to src/ and is optional —
 * without it the entry is created with a blank image field. If the filename
 * follows the YYYY_M_ convention the date is taken from it.
 */
import fs from "node:fs";
import path from "node:path";

const [title, image = ""] = process.argv.slice(2);
if (!title) {
  console.error('Usage: npm run new:art -- "Title" [arts/photography/2026_3_file.jpeg]');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "piece";

const fromName = /(\d{4})_(\d{1,2})_/.exec(image);
const now = new Date();
const year = fromName ? fromName[1] : String(now.getUTCFullYear());
const month = fromName ? String(Number(fromName[2])).padStart(2, "0")
                       : String(now.getUTCMonth() + 1).padStart(2, "0");

const section = image.includes("/pixel/") || image.includes("/digital/")
  ? "Digital Art"
  : "Photography";

const dir = path.join("src", "art-blog", "pieces");
const file = path.join(dir, `${year}-${month}-${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`✗ ${file} already exists.`);
  process.exit(1);
}

if (image && !fs.existsSync(path.join("src", image))) {
  console.warn(`! src/${image} not found yet — the entry will show a placeholder until you add it.`);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
date: ${year}-${month}-01
year: "${year}"
section: "${section}"
category: ""
image: ${JSON.stringify(image)}
gear: ""
---

- One or two lines about the piece.
`
);

console.log(`✓ ${file}`);
console.log("  Fill in category (e.g. Landscapes & Architecture) and gear (e.g. Nikon D750, M | f5.6, 1/1600, ISO200).");
