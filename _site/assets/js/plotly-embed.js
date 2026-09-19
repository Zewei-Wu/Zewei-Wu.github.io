/* Renders {% plotly "path/to/figure.json" %} blocks.
   ---------------------------------------------------------------------------
   Export a figure from Python with:

       import plotly.io as pio
       pio.write_json(fig, "src/files/plots/sfrd.json")

   then in a post:  {% plotly "files/plots/sfrd.json" %}

   plotly.js is only downloaded on pages that actually contain a figure, and
   the layout is nudged to match the current colour theme.                   */
(function () {
  "use strict";

  var PLOTLY_JS = "https://cdn.plot.ly/plotly-2.35.2.min.js";
  var loader = null;
  var mounted = [];

  function loadPlotly() {
    if (window.Plotly) return Promise.resolve(window.Plotly);
    if (loader) return loader;
    loader = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = PLOTLY_JS;
      s.async = true;
      s.onload = function () { resolve(window.Plotly); };
      s.onerror = function () { reject(new Error("plotly failed to load")); };
      document.head.appendChild(s);
    });
    return loader;
  }

  function themeLayout() {
    var styles = getComputedStyle(document.documentElement);
    var ink = styles.getPropertyValue("--ink").trim() || "#10233f";
    var rule = styles.getPropertyValue("--rule").trim() || "rgba(0,0,0,.12)";
    return {
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: ink, family: getComputedStyle(document.body).fontFamily },
      xaxis: { gridcolor: rule, zerolinecolor: rule },
      yaxis: { gridcolor: rule, zerolinecolor: rule },
      margin: { t: 32, r: 18, b: 44, l: 56 },
    };
  }

  function render(el) {
    var src = el.dataset.plotlySrc;
    if (!src) return;
    el.dataset.plotlyReady = "1";

    Promise.all([loadPlotly(), fetch(src).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })])
      .then(function (results) {
        var Plotly = results[0];
        var fig = results[1];
        var layout = Object.assign({}, themeLayout(), fig.layout || {});
        Plotly.newPlot(el, fig.data || [], layout, {
          responsive: true,
          displayModeBar: "hover",
          displaylogo: false,
        });
        mounted.push(el);
      })
      .catch(function () {
        el.innerHTML = '<p class="cv-fallback">This figure could not be loaded.</p>';
      });
  }

  function init() {
    document.querySelectorAll("[data-plotly-src]:not([data-plotly-ready])")
      .forEach(render);
  }

  document.addEventListener("theme:change", function () {
    if (!window.Plotly) return;
    mounted.forEach(function (el) {
      window.Plotly.relayout(el, themeLayout());
    });
  });

  document.addEventListener("panel:load", init);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
