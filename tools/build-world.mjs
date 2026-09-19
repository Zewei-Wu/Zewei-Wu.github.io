/* One-off: regenerate src/assets/data/world.geo.json from Natural Earth data.
   Only needed if you want different geometry — the output is committed.

     npm i -D world-atlas topojson-client
     node tools/build-world.mjs
     npm uninstall world-atlas topojson-client

   Source: world-atlas (Natural Earth, public domain).                        */
import fs from "node:fs";
import * as topojson from "topojson-client";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
const geo = topojson.feature(topo, topo.objects.countries);
const round = (c) =>
  Array.isArray(c[0]) ? c.map(round) : [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100];

geo.features = geo.features.filter((f) => f.properties.name !== "Antarctica");
for (const f of geo.features) f.geometry.coordinates = round(f.geometry.coordinates);

/* Russia and Fiji have rings that wrap the antimeridian. Drawn naively they
   become a stripe straight across the map, so cut them in two at ±180 instead
   of discarding them (discarding loses the whole Russian mainland). */
const span = (ring) => {
  const lons = ring.map((p) => p[0]);
  return Math.max(...lons) - Math.min(...lons);
};

/* Sutherland–Hodgman clip of one ring against lon >= k (side 1) or <= k (-1). */
function clipLon(ring, k, side) {
  const inside = (p) => (side === 1 ? p[0] >= k : p[0] <= k);
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const cur = ring[i];
    const prev = ring[(i + ring.length - 1) % ring.length];
    if (inside(cur) !== inside(prev)) {
      const t = (k - prev[0]) / (cur[0] - prev[0]);
      out.push([k, prev[1] + t * (cur[1] - prev[1])]);
    }
    if (inside(cur)) out.push(cur);
  }
  return out;
}

for (const f of geo.features) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const next = [];
  for (const poly of polys) {
    if (span(poly[0]) <= 180) { next.push(poly); continue; }
    // re-express in 0..360 so the ring is contiguous, then cut it at 180
    const shifted = poly.map((r) => r.map(([x, y]) => [x < 0 ? x + 360 : x, y]));
    const west = shifted.map((r) => clipLon(r, 180, -1)).filter((r) => r.length > 2);
    const east = shifted
      .map((r) => clipLon(r, 180, 1).map(([x, y]) => [x - 360, y]))
      .filter((r) => r.length > 2);
    if (west.length) next.push(west);
    if (east.length) next.push(east);
  }
  f.geometry.type = "MultiPolygon";
  f.geometry.coordinates = next;
}
geo.features = geo.features.filter((f) => f.geometry.coordinates.length);

fs.mkdirSync("src/assets/data", { recursive: true });
fs.writeFileSync(
  "src/assets/data/world.geo.json",
  JSON.stringify({
    type: "FeatureCollection",
    features: geo.features.map((f) => ({
      type: "Feature",
      properties: { name: f.properties.name },
      geometry: f.geometry,
    })),
  })
);
console.log("wrote src/assets/data/world.geo.json");
