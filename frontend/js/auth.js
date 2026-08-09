/* ============================================================
   GARMR · auth.js
   Validación del lado del cliente para login y registro.
   Es una maqueta: no hay backend. Al validar bien, muestra un
   aviso y redirige al panel de ejemplo (dashboard.html).
   ============================================================ */

(function () {
  "use strict";

  var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function marcarError(idInput, idError, mostrar) {
    var input = document.getElementById(idInput);
    var error = document.getElementById(idError);
    if (!input || !error) return;
    if (mostrar) { input.setAttribute("aria-invalid", "true"); error.classList.add("visible"); }
    else { input.removeAttribute("aria-invalid"); error.classList.remove("visible"); }
  }

  function irAlPanel(idAviso) {
    var aviso = document.getElementById(idAviso);
    if (aviso) aviso.classList.add("visible");
    setTimeout(function () { window.location.href = "dashboard.html"; }, 1100);
  }

  /* Fuerza de contraseña (0..4) */
  function fuerzaClave(v) {
    var p = 0;
    if (v.length >= 8) p++;
    if (/[A-Z]/.test(v)) p++;
    if (/[0-9]/.test(v)) p++;
    if (/[^A-Za-z0-9]/.test(v)) p++;
    return p;
  }

  var barra = document.getElementById("barraClave");
  var campoClave = document.getElementById("pass");
  if (barra && campoClave) {
    var colores = ["var(--sangre)", "var(--sangre)", "var(--sev-media)", "var(--jade)", "var(--jade)"];
    var anchos = ["0%", "30%", "55%", "80%", "100%"];
    campoClave.addEventListener("input", function () {
      var f = fuerzaClave(campoClave.value);
      barra.style.width = anchos[f];
      barra.style.background = colores[f];
    });
  }

  /* Login */
  var formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email").value.trim();
      var pass = document.getElementById("pass").value;
      var ok = true;
      if (!reEmail.test(email)) { marcarError("email", "errEmail", true); ok = false; } else marcarError("email", "errEmail", false);
      if (pass.length < 1) { marcarError("pass", "errPass", true); ok = false; } else marcarError("pass", "errPass", false);
      if (ok) irAlPanel("avisoOk");
    });
  }

  /* Registro */
  var formReg = document.getElementById("formRegistro");
  if (formReg) {
    formReg.addEventListener("submit", function (e) {
      e.preventDefault();
      var negocio = document.getElementById("negocio").value.trim();
      var sitio = document.getElementById("sitio").value.trim();
      var email = document.getElementById("email").value.trim();
      var pass = document.getElementById("pass").value;
      var ok = true;
      if (negocio.length < 2) { marcarError("negocio", "errNegocio", true); ok = false; } else marcarError("negocio", "errNegocio", false);
      var sitioOk = /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(sitio);
      if (!sitioOk) { marcarError("sitio", "errSitio", true); ok = false; } else marcarError("sitio", "errSitio", false);
      if (!reEmail.test(email)) { marcarError("email", "errEmail", true); ok = false; } else marcarError("email", "errEmail", false);
      if (fuerzaClave(pass) < 3 || pass.length < 8) { marcarError("pass", "errPass", true); ok = false; } else marcarError("pass", "errPass", false);
      if (ok) irAlPanel("avisoOk");
    });
  }
})();
