/* ============================================================
   GARMR · laboratorios.js — Controlador del hub
   Cambia entre los laboratorios: al tocar una tarjeta, muestra
   su panel y oculta los demás.
   ============================================================ */

(function () {
  "use strict";

  var cards = document.querySelectorAll(".lab-card[data-lab]");
  var paneles = document.querySelectorAll("[data-lab-panel]");
  if (!cards.length || !paneles.length) return;

  function mostrar(lab) {
    cards.forEach(function (c) { c.classList.toggle("activa", c.getAttribute("data-lab") === lab); });
    paneles.forEach(function (p) { p.hidden = p.getAttribute("data-lab-panel") !== lab; });
  }

  cards.forEach(function (c) {
    c.addEventListener("click", function () {
      if (c.classList.contains("bloqueada")) return;
      mostrar(c.getAttribute("data-lab"));
    });
  });
})();
