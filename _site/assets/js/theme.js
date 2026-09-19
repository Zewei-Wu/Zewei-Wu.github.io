/* Theme switching: system → light → dark → system.
   The initial value is applied inline in <head> to avoid a flash. */
(function () {
  "use strict";

  var ORDER = ["system", "light", "dark"];
  var LABEL = { system: "System", light: "Light", dark: "Dark" };
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function read() {
    try { return localStorage.getItem("theme") || "system"; } catch (e) { return "system"; }
  }
  function write(value) {
    try {
      if (value === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", value);
    } catch (e) { /* private mode — the choice just won't persist */ }
  }

  function apply(pref) {
    root.dataset.themePref = pref;
    root.dataset.theme = pref === "dark" || (pref === "system" && mq.matches) ? "dark" : "light";
    document.querySelectorAll("#theme-toggle").forEach(function (btn) {
      btn.title = "Theme: " + LABEL[pref];
      btn.setAttribute("aria-label", "Colour theme: " + LABEL[pref] + ". Click to change.");
      var text = btn.querySelector(".theme-toggle__text");
      if (text) text.textContent = LABEL[pref];
    });
  }

  function bind() {
    document.querySelectorAll("#theme-toggle").forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", function () {
        var next = ORDER[(ORDER.indexOf(read()) + 1) % ORDER.length];
        write(next);
        apply(next);
        document.dispatchEvent(new CustomEvent("theme:change", { detail: { pref: next } }));
      });
    });
  }

  mq.addEventListener("change", function () {
    if (read() === "system") apply("system");
    document.dispatchEvent(new CustomEvent("theme:change", { detail: { pref: read() } }));
  });

  apply(read());
  bind();
  document.addEventListener("panel:load", bind);
})();
