/* Highlights the section bar link for whatever heading you are reading,
   and makes the links scroll smoothly without jumping under the bar. */
(function () {
  "use strict";

  var observer = null;

  function setup() {
    if (observer) { observer.disconnect(); observer = null; }

    var links = Array.prototype.slice.call(
      document.querySelectorAll("[data-section-link]")
    );
    if (!links.length) return;

    var map = new Map();
    links.forEach(function (link) {
      var target = document.getElementById(link.dataset.sectionLink);
      if (target) map.set(target, link);
    });
    if (!map.size) return;

    var visible = new Set();

    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });

        var current = null;
        map.forEach(function (_link, heading) {
          if (visible.has(heading)) {
            if (!current || heading.compareDocumentPosition(current) &
                Node.DOCUMENT_POSITION_FOLLOWING) {
              current = heading;
            }
          }
        });

        links.forEach(function (l) { l.classList.remove("is-current"); });
        if (current && map.get(current)) {
          var active = map.get(current);
          active.classList.add("is-current");
          var bar = active.parentElement;
          if (bar && bar.scrollWidth > bar.clientWidth) {
            var offset = active.offsetLeft - bar.clientWidth / 2 + active.clientWidth / 2;
            bar.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
          }
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );

    map.forEach(function (_link, heading) { observer.observe(heading); });
  }

  /* Fade the right edge only when the bar really does overflow. */
  function markScrollable() {
    document.querySelectorAll(".sectionbar__nav, .topbar__nav").forEach(function (bar) {
      bar.classList.toggle("is-scrollable", bar.scrollWidth - bar.clientWidth > 4);
    });
  }

  function refresh() { setup(); markScrollable(); }

  refresh();
  window.addEventListener("resize", markScrollable, { passive: true });
  document.addEventListener("panel:load", refresh);
})();
