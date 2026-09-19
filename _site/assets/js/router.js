/* Panel router.
   ---------------------------------------------------------------------------
   Every panel is a real page with a real URL — this just swaps the contents of
   #panel in place so the left bar never blinks. With JS off, or if a fetch
   fails, the links are ordinary links and everything still works.            */
(function () {
  "use strict";

  var panel = document.getElementById("panel");
  var main = document.getElementById("main");
  if (!panel || !window.fetch || !window.history.pushState) return;

  var cache = new Map();
  var loading = false;

  function sameOrigin(url) {
    try { return new URL(url, location.href).origin === location.origin; }
    catch (e) { return false; }
  }

  function markActive(url) {
    document.querySelectorAll("[data-panel-link]").forEach(function (link) {
      var isActive = link.getAttribute("href") === url;
      link.classList.toggle("is-active", isActive && link.classList.contains("nav__link"));
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function announce() {
    document.dispatchEvent(new CustomEvent("panel:load"));
  }

  function swap(html, url, push) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var next = doc.getElementById("panel");
    if (!next) { location.href = url; return; }

    panel.innerHTML = next.innerHTML;
    panel.dataset.panelUrl = next.dataset.panelUrl || url;
    panel.dataset.panelTitle = next.dataset.panelTitle || "";
    document.title = doc.title;

    var desc = doc.querySelector('meta[name="description"]');
    var here = document.querySelector('meta[name="description"]');
    if (desc && here) here.setAttribute("content", desc.getAttribute("content"));

    if (push) history.pushState({ panel: url }, "", url);
    markActive(url);

    /* Restart the entrance animation on the freshly swapped panel. It lives
       on .panel__body, not .panel — see the note in site.css. */
    var body = panel.querySelector(".panel__body");
    if (body) {
      body.style.animation = "none";
      void body.offsetWidth;
      body.style.animation = "";
    }

    window.scrollTo({ top: 0, behavior: "instant" in document.documentElement.style ? "instant" : "auto" });
    if (main) main.focus({ preventScroll: true });
    announce();
  }

  function load(url, push) {
    if (loading) return;
    if (cache.has(url)) { swap(cache.get(url), url, push); return; }

    loading = true;
    panel.setAttribute("aria-busy", "true");

    fetch(url, { headers: { "X-Requested-With": "panel" } })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (html) {
        cache.set(url, html);
        swap(html, url, push);
      })
      .catch(function () { location.href = url; })
      .finally(function () {
        loading = false;
        panel.removeAttribute("aria-busy");
      });
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest("a[data-panel-link]");
    if (!link || link.target === "_blank") return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || !sameOrigin(href)) return;
    if (href === location.pathname) { event.preventDefault(); window.scrollTo({ top: 0 }); return; }

    event.preventDefault();
    load(href, true);
    document.dispatchEvent(new CustomEvent("nav:navigate"));
  });

  window.addEventListener("popstate", function () {
    load(location.pathname, false);
  });

  /* Warm the cache on hover so switching feels instant. */
  document.addEventListener("pointerover", function (event) {
    var link = event.target.closest && event.target.closest("a[data-panel-link]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || cache.has(href) || !sameOrigin(href) || href.charAt(0) === "#") return;
    fetch(href).then(function (r) { return r.ok ? r.text() : null; })
      .then(function (html) { if (html) cache.set(href, html); })
      .catch(function () {});
  }, { passive: true });
})();

/* Mobile drawer -------------------------------------------------------------- */
(function () {
  "use strict";

  var sidebar = document.getElementById("sidebar");
  var toggle = document.getElementById("sidebar-toggle");
  var scrim = document.getElementById("scrim");
  if (!sidebar || !toggle || !scrim) return;

  function open() {
    sidebar.classList.add("is-open");
    scrim.hidden = false;
    requestAnimationFrame(function () { scrim.classList.add("is-open"); });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
  }
  function close() {
    sidebar.classList.remove("is-open");
    scrim.classList.remove("is-open");
    setTimeout(function () { scrim.hidden = true; }, 240);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  toggle.addEventListener("click", function () {
    sidebar.classList.contains("is-open") ? close() : open();
  });
  scrim.addEventListener("click", close);
  document.addEventListener("nav:navigate", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) close();
  });
})();
