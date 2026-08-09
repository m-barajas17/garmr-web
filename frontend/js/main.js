/* ============================================================
   GARMR · main.js
   Comportamientos base: menú móvil y revelado al hacer scroll.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      toggle.setAttribute("aria-expanded", String(abierto));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("abierto");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Revelado al hacer scroll ---------- */
  var revelables = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && revelables.length) {
    var io = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revelables.forEach(function (el) { io.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add("visible"); });
  }
})();
