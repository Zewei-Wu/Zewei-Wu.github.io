#!/usr/bin/env node
/* Scaffold a research-blog post:  npm run new:post "Title of the post" */
import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new:post "Title of the post"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const today = new Date().toISOString().slice(0, 10);
const dir = path.join("src", "research-blog", "posts");
const file = path.join(dir, `${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`✗ ${file} already exists.`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: ${title}
subtitle:
date: ${today}
tags: []
# image: images/posts/${slug}-hero.png
draft: true
---

Write here. Delete \`draft: true\` above when it is ready to publish.
`
);

console.log(`✓ ${file}`);
console.log(`  → http://localhost:8080/research-blog/${slug}/`);
