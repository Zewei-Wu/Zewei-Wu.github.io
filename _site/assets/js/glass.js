/* Pointer-reactive highlight on frosted surfaces.
   Writes --mx / --my onto the element; the gradient lives in CSS so the
   effect degrades to nothing if this script never runs. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fine = window.matchMedia("(pointer: fine)");
  var frame = null;
  var pending = [];

  function flush() {
    frame = null;
    for (var i = 0; i < pending.length; i++) {
      var job = pending[i];
      job.el.style.setProperty("--mx", job.x + "%");
      job.el.style.setProperty("--my", job.y + "%");
    }
    pending.length = 0;
  }

  function onMove(event) {
    var el = event.currentTarget;
    var rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pending.push({
      el: el,
      x: (((event.clientX - rect.left) / rect.width) * 100).toFixed(2),
      y: (((event.clientY - rect.top) / rect.height) * 100).toFixed(2),
    });
    if (!frame) frame = requestAnimationFrame(flush);
  }

  function enter(event) { event.currentTarget.classList.add("is-pointer"); }
  function leave(event) { event.currentTarget.classList.remove("is-pointer"); }

  function bind(scope) {
    if (reduced.matches || !fine.matches) return;
    (scope || document).querySelectorAll(".glass").forEach(function (el) {
      if (el.dataset.glassBound) return;
      el.dataset.glassBound = "1";
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
    });
  }

  bind(document);
  document.addEventListener("panel:load", function () { bind(document); });
})();
