/* Collaborator map.
   ---------------------------------------------------------------------------
   Leaflet and the country outlines are served from this repo — no third-party
   requests, works offline, and the land/ocean colours follow the site theme.
   Pin data comes from src/_data/collaborators.yaml.

   Set `map.basemap: tiles` in src/_data/site.yaml to use CARTO raster tiles
   instead of the vector outlines (needs an internet connection).            */
(function () {
  "use strict";

  var ASSETS = document.documentElement.dataset.assets || "/assets/";
  var LEAFLET_JS = ASSETS + "vendor/leaflet/leaflet.js";
  var LEAFLET_CSS = ASSETS + "vendor/leaflet/leaflet.css";
  var WORLD = ASSETS + "data/world.geo.json";

  var TILES = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };
  var TILE_ATTR =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  var scriptLoader = null;
  var worldLoader = null;
  var instances = [];

  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (scriptLoader) return scriptLoader;
    scriptLoader = new Promise(function (resolve, reject) {
      if (!document.querySelector("link[data-leaflet]")) {
        var css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = LEAFLET_CSS;
        css.setAttribute("data-leaflet", "");
        document.head.appendChild(css);
      }
      var js = document.createElement("script");
      js.src = LEAFLET_JS;
      js.async = true;
      js.onload = function () { resolve(window.L); };
      js.onerror = function () { reject(new Error("leaflet")); };
      document.head.appendChild(js);
    });
    return scriptLoader;
  }

  function loadWorld() {
    if (worldLoader) return worldLoader;
    worldLoader = fetch(WORLD).then(function (r) {
      if (!r.ok) throw new Error("world");
      return r.json();
    });
    return worldLoader;
  }

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function landStyle() {
    return {
      fillColor: cssVar("--map-land", "#cdd8ea"),
      fillOpacity: 1,
      color: cssVar("--map-stroke", "#ffffff"),
      weight: 0.7,
      opacity: 1,
    };
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function addPins(map, L, pins) {
    var bounds = [];
    pins.forEach(function (pin) {
      var lat = Number(pin.lat), lon = Number(pin.lon);
      if (!isFinite(lat) || !isFinite(lon)) return;
      bounds.push([lat, lon]);

      L.marker([lat, lon], {
        icon: L.divIcon({
          className: "map-pin-wrap",
          html: '<span class="map-pin pin-' + escapeHtml(pin.kind || "institution") + '"></span>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
        title: pin.name,
        alt: pin.name,
        riseOnHover: true,
      })
        .addTo(map)
        .bindPopup(
          "<strong>" + escapeHtml(pin.name) + "</strong>" +
          (pin.place ? "<em>" + escapeHtml(pin.place) + "</em>" : "") +
          (pin.note ? "<p style='margin:.45rem 0 0'>" + escapeHtml(pin.note) + "</p>" : "")
        );
    });
    return bounds;
  }

  function build(el, L, world) {
    var pins;
    try { pins = JSON.parse(el.dataset.pins || "[]"); } catch (e) { pins = []; }
    if (!pins.length) { el.dataset.mapReady = "1"; return; }

    var useTiles = el.dataset.basemap === "tiles";

    var map = L.map(el, {
      scrollWheelZoom: false,
      worldCopyJump: true,
      minZoom: 1,
      maxZoom: useTiles ? 12 : 7,
      attributionControl: useTiles,
      zoomSnap: 0.25,
    });

    var layer = null;
    if (useTiles) {
      layer = L.tileLayer(TILES[theme()], {
        attribution: TILE_ATTR, subdomains: "abcd", maxZoom: 12,
      }).addTo(map);
    } else if (world) {
      layer = L.geoJSON(world, {
        style: landStyle,
        interactive: false,
        renderer: L.canvas({ padding: 0.3 }),
      }).addTo(map);
    }

    var bounds = addPins(map, L, pins);
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [46, 46] });
    else if (bounds.length) map.setView(bounds[0], 4);

    /* Wheel zoom only after a click, so the page keeps scrolling normally
       when the cursor passes over the map. */
    map.on("click", function () { map.scrollWheelZoom.enable(); });
    map.on("mouseout", function () { map.scrollWheelZoom.disable(); });

    instances.push({ map: map, layer: layer, tiles: useTiles });
    el.dataset.mapReady = "1";
  }

  function theme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function init() {
    var targets = Array.prototype.slice.call(
      document.querySelectorAll("[data-map]:not([data-map-ready])")
    );
    if (!targets.length) return;

    var wantsWorld = targets.some(function (el) { return el.dataset.basemap !== "tiles"; });

    Promise.all([loadLeaflet(), wantsWorld ? loadWorld().catch(function () { return null; }) : null])
      .then(function (res) {
        targets.forEach(function (el) { build(el, res[0], res[1]); });
      })
      .catch(function () {
        targets.forEach(function (el) {
          el.innerHTML = '<p class="cv-fallback">The map could not be loaded.</p>';
          el.dataset.mapReady = "1";
        });
      });
  }

  document.addEventListener("theme:change", function () {
    instances.forEach(function (entry) {
      if (!entry.layer) return;
      if (entry.tiles) entry.layer.setUrl(TILES[theme()]);
      else entry.layer.setStyle(landStyle());
    });
  });

  document.addEventListener("panel:load", function () {
    instances.length = 0;
    init();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
