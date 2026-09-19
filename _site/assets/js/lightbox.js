/* Click any figure image to view it large. Esc or a click closes it. */
(function () {
  "use strict";

  var box = null;
  var lastFocus = null;

  function ensure() {
    if (box) return box;
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<figure style="margin:0;display:grid;justify-items:center">' +
      '<img alt=""><figcaption class="lightbox__caption"></figcaption></figure>';
    box.hidden = true;
    document.body.appendChild(box);

    box.addEventListener("click", function (event) {
      if (event.target.tagName !== "IMG") close();
    });
    return box;
  }

  function open(img, caption) {
    var el = ensure();
    lastFocus = document.activeElement;
    el.querySelector("img").src = img.currentSrc || img.src;
    el.querySelector("img").alt = img.alt || "";
    var cap = el.querySelector(".lightbox__caption");
    cap.textContent = caption || "";
    cap.hidden = !caption;
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
    el.querySelector(".lightbox__close").focus();
  }

  function close() {
    if (!box || box.hidden) return;
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () {
      box.hidden = true;
      box.querySelector("img").removeAttribute("src");
    }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("click", function (event) {
    var img = event.target.closest(".figure:not([data-missing]) img");
    if (!img) return;
    if (img.closest("a")) return; // let real links win
    var fig = img.closest("figure");
    var cap = fig && fig.querySelector("figcaption");
    open(img, cap ? cap.textContent.trim() : "");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();
