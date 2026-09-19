import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFootnote from "markdown-it-footnote";
import { katex } from "@mdit/plugin-katex";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { DateTime } from "luxon";

export default function (eleventyConfig) {
  /* ------------------------------------------------------------------ *
   * Static assets copied straight through to the built site.
   * `src/images`, `src/arts`, `src/files`, `src/fonts` are YOUR content
   * folders — copy them over from the old repo's docs/ directory.
   * ------------------------------------------------------------------ */
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/arts");
  eleventyConfig.addPassthroughCopy("src/files");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy({ "src/root": "." });
  // KaTeX stylesheet + fonts, self-hosted so equations work offline.
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "assets/vendor/katex/katex.min.css",
    "node_modules/katex/dist/fonts": "assets/vendor/katex/fonts",
  });
  // Leaflet, self-hosted so the map needs no third-party requests.
  eleventyConfig.addPassthroughCopy({
    "node_modules/leaflet/dist/leaflet.js": "assets/vendor/leaflet/leaflet.js",
    "node_modules/leaflet/dist/leaflet.css": "assets/vendor/leaflet/leaflet.css",
    "node_modules/leaflet/dist/images": "assets/vendor/leaflet/images",
  });

  eleventyConfig.addWatchTarget("src/assets/");

  /* ------------------------------------------------------------------ *
   * YAML data files (src/_data/*.yaml) behave like JSON data files.
   * ------------------------------------------------------------------ */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPlugin(syntaxHighlight);

  /* ------------------------------------------------------------------ *
   * Markdown: anchors on headings, {.class} attributes, footnotes,
   * $inline$ / $$display$$ math rendered to HTML at build time.
   * ------------------------------------------------------------------ */
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAttrs)
    .use(markdownItFootnote)
    .use(katex)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "heading-anchor",
        symbol: "#",
      }),
      level: [2, 3],
      slugify: (s) => slugify(s),
    });
  eleventyConfig.setLibrary("md", md);

  /* ------------------------------------------------------------------ *
   * Collections
   * ------------------------------------------------------------------ */
  // Panel sections of the main site, ordered by the `order` front-matter key.
  eleventyConfig.addCollection("panels", (api) =>
    api
      .getFilteredByTag("panel")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  // Standalone pages listed under the panels in the sidebar.
  eleventyConfig.addCollection("standalone", (api) =>
    api
      .getFilteredByTag("standalone")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  // Research blog posts, newest first. Drafts are excluded from production.
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByTag("post")
      .filter((p) => !(p.data.draft && process.env.ELEVENTY_RUN_MODE === "build"))
      .sort((a, b) => b.date - a.date)
  );

  // Art pieces, newest first.
  eleventyConfig.addCollection("art", (api) =>
    api.getFilteredByTag("art").sort((a, b) => b.date - a.date)
  );

  // Art pieces bucketed: [{ section, years: [{ year, items }] }]
  eleventyConfig.addCollection("artBySection", (api) => {
    const items = api
      .getFilteredByTag("art")
      .sort((a, b) => b.date - a.date);
    const order = ["Photography", "Digital Art"];
    const sections = new Map();
    for (const item of items) {
      const section = item.data.section || "Other";
      if (!sections.has(section)) sections.set(section, new Map());
      const year = String(item.data.year || item.date.getUTCFullYear());
      const years = sections.get(section);
      if (!years.has(year)) years.set(year, []);
      years.get(year).push(item);
    }
    return [...sections.entries()]
      .sort((a, b) => {
        const ai = order.indexOf(a[0]);
        const bi = order.indexOf(b[0]);
        return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
      })
      .map(([section, years]) => ({
        section,
        slug: slugify(section),
        years: [...years.entries()]
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, items]) => ({ year, items })),
      }));
  });

  /* ------------------------------------------------------------------ *
   * Filters
   * ------------------------------------------------------------------ */
  eleventyConfig.addFilter("slug", slugify);

  // Render a markdown string from a data file (block / inline).
  eleventyConfig.addFilter("md", (value) => (value ? md.render(String(value)) : ""));
  eleventyConfig.addFilter("mdi", (value) =>
    value ? md.renderInline(String(value)) : ""
  );

  // True when src/<path> exists — lets templates fall back to a placeholder.
  eleventyConfig.addFilter("assetExists", (src) =>
    Boolean(src) && fs.existsSync(path.join("src", String(src).replace(/^\/+/, "")))
  );

  eleventyConfig.addFilter("orPlaceholder", function (src) {
    const prefix = eleventyConfig.pathPrefix || "/";
    const clean = String(src || "").replace(/^\/+/, "");
    const exists = clean && fs.existsSync(path.join("src", clean));
    return path.posix.join(prefix, exists ? clean : "assets/img/placeholder.svg");
  });

  eleventyConfig.addFilter("readableDate", (value, fmt = "LLLL d, yyyy") =>
    DateTime.fromJSDate(new Date(value), { zone: "utc" }).toFormat(fmt)
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    DateTime.fromJSDate(new Date(value), { zone: "utc" }).toISODate()
  );

  // Pull the <h2> headings out of rendered HTML to build the panel's section bar.
  eleventyConfig.addFilter("sectionHeadings", (html) => {
    if (!html) return [];
    const out = [];
    const re = /<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      const text = m[2]
        .replace(/<a\b[^>]*class="heading-anchor"[\s\S]*?<\/a>/g, "")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) out.push({ id: m[1], text });
    }
    return out;
  });

  // First <img src> in rendered HTML — used for research blog cards.
  eleventyConfig.addFilter("firstImage", (html) => {
    if (!html) return null;
    const m = /<img[^>]+src="([^"]+)"/.exec(html);
    return m ? m[1] : null;
  });

  // Plain-text excerpt for cards and meta descriptions.
  eleventyConfig.addFilter("excerpt", (html, words = 28) => {
    if (!html) return "";
    const text = String(html)
      .replace(/<figure[\s\S]*?<\/figure>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const parts = text.split(" ");
    return parts.length <= words
      ? text
      : parts.slice(0, words).join(" ") + "…";
  });

  /* ------------------------------------------------------------------ *
   * Shortcodes
   * ------------------------------------------------------------------ */
  // {% img "images/front.jpg", "Alt text", "Optional caption" %}
  // Falls back to a placeholder if the file is not in the repo yet, so the
  // site still builds before you copy your media folders across.
  eleventyConfig.addShortcode("img", function (src, alt = "", caption = "", cls = "") {
    const prefix = eleventyConfig.pathPrefix || "/";
    const clean = String(src).replace(/^\/+/, "");
    const exists = fs.existsSync(path.join("src", clean));
    const href = exists
      ? path.posix.join(prefix, clean)
      : path.posix.join(prefix, "assets/img/placeholder.svg");
    const missing = exists ? "" : ' data-missing="true"';
    const figcaption = caption
      ? `<figcaption>${caption}</figcaption>`
      : "";
    return `<figure class="figure ${cls}"${missing}><img src="${href}" alt="${escapeAttr(
      alt
    )}" loading="lazy" decoding="async">${figcaption}</figure>`;
  });

  // {% plotly "plots/sfrd.json" %} — lazily loads plotly.js only where used.
  eleventyConfig.addShortcode("plotly", function (dataPath, height = "420px") {
    const prefix = eleventyConfig.pathPrefix || "/";
    const href = path.posix.join(prefix, String(dataPath).replace(/^\/+/, ""));
    const id = "plotly-" + Math.random().toString(36).slice(2, 9);
    return `<div class="plotly-figure" id="${id}" data-plotly-src="${href}" style="min-height:${height}"></div>`;
  });

  /* ------------------------------------------------------------------ *
   * Dev server + directory config
   * ------------------------------------------------------------------ */
  eleventyConfig.setServerOptions({ port: 8080, showAllHosts: true });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Set PATH_PREFIX=/repo-name when deploying to a GitHub *project* page.
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}

function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}
