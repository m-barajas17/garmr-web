/* ============================================================
   GARMR · lab-phishing.js — Laboratorio "El correo trampa"
   Máquina de estados sencilla: el usuario decide, se revela el
   veredicto, y puede explorar las 4 señales resaltándolas en el
   correo.
   ============================================================ */

(function () {
  "use strict";

  var lab = document.getElementById("labPhishing");
  if (!lab) return;

  var decision = document.getElementById("labDecision");
  var resultado = document.getElementById("labResultado");
  var veredicto = document.getElementById("veredicto");
  var vTitulo = document.getElementById("veredictoTitulo");
  var vTexto = document.getElementById("veredictoTexto");
  var btnFalso = document.getElementById("btnFalso");
  var enlaceReal = document.getElementById("enlaceReal");
  var btnReiniciar = document.getElementById("btnReiniciar");

  /* Al pasar el mouse por el botón falso, se revela el enlace real
     (como cuando el navegador muestra a dónde apunta un enlace). */
  if (btnFalso && enlaceReal) {
    btnFalso.addEventListener("mouseenter", function () { enlaceReal.classList.add("visible"); });
    btnFalso.addEventListener("click", function () { elegir("clic"); });
  }

  /* Decisión del usuario */
  decision.querySelectorAll("[data-eleccion]").forEach(function (btn) {
    btn.addEventListener("click", function () { elegir(btn.getAttribute("data-eleccion")); });
  });

  function elegir(eleccion) {
    if (eleccion === "clic") {
      veredicto.className = "veredicto veredicto--cayo";
      vTitulo.textContent = "Caíste en la trampa.";
      vTexto.textContent = "Y no te sientas mal: está diseñado por expertos justamente para que caigas. Lo importante es que aquí no perdiste nada. Ahora mira las 4 señales que te habrían salvado.";
    } else {
      veredicto.className = "veredicto veredicto--bien";
      vTitulo.textContent = "¡Bien! Olfateaste la trampa.";
      vTexto.textContent = "Ese instinto es justo lo que te protege. Pero repasemos qué te delató exactamente, para que la próxima estés seguro de por qué desconfiaste.";
    }
    decision.style.display = "none";
    resultado.classList.add("visible");
    resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* Explorar las señales: al tocar un paso, se resalta la zona
     correspondiente en el correo. */
  lab.querySelectorAll(".senal-paso").forEach(function (paso) {
    paso.addEventListener("click", function () {
      var n = paso.getAttribute("data-paso");
      // limpia marcas previas
      lab.querySelectorAll(".senal.marcada").forEach(function (s) { s.classList.remove("marcada"); });
      lab.querySelectorAll(".senal-paso.activa").forEach(function (p) { p.classList.remove("activa"); });
      // marca la señal elegida
      var zona = lab.querySelector('.senal[data-senal="' + n + '"]');
      if (zona) {
        if (n === "4") enlaceReal.classList.add("visible");
        zona.classList.add("marcada");
        zona.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      paso.classList.add("activa");
    });
  });

  /* Reiniciar */
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", function () {
      resultado.classList.remove("visible");
      decision.style.display = "flex";
      enlaceReal.classList.remove("visible");
      lab.querySelectorAll(".senal.marcada").forEach(function (s) { s.classList.remove("marcada"); });
      lab.querySelectorAll(".senal-paso.activa").forEach(function (p) { p.classList.remove("activa"); });
      lab.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
