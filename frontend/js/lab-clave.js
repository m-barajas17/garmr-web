/* ============================================================
   GARMR · lab-clave.js — Laboratorio "La clave débil"
   El usuario escribe una contraseña y ve en vivo:
   - una estimación de cuánto tardaría un atacante en romperla,
   - qué le falta,
   - un comentario de Garmr.

   Todo ocurre en el navegador: la contraseña NO se guarda ni se
   envía a ningún lado.
   ============================================================ */

(function () {
  "use strict";

  var input = document.getElementById("claveInput");
  if (!input) return;

  var medidor = document.getElementById("claveMedidor");
  var tiempoCaja = document.getElementById("claveTiempoCaja");
  var tiempo = document.getElementById("claveTiempo");
  var analisis = document.getElementById("claveAnalisis");
  var comentario = document.getElementById("claveComentario");

  // Lista corta de claves comunes (las que un atacante prueba primero).
  var COMUNES = [
    "123456", "12345678", "123456789", "password", "contrasena", "contraseña",
    "qwerty", "111111", "12345", "abc123", "1234567", "123123", "admin",
    "iloveyou", "colombia", "111222", "000000", "1234", "hola", "amor"
  ];

  // Velocidad de un atacante con buen equipo (intentos por segundo).
  var RATE = 1e10; // 10 mil millones/seg — escenario de fuerza bruta offline

  function poolTamano(v) {
    var pool = 0;
    if (/[a-z]/.test(v)) pool += 26;
    if (/[A-Z]/.test(v)) pool += 26;
    if (/[0-9]/.test(v)) pool += 10;
    if (/[^A-Za-z0-9]/.test(v)) pool += 33;
    return pool;
  }

  function formatoTiempo(seg) {
    if (seg < 1) return "al instante";
    var u = [
      [60, "segundo"], [60, "minuto"], [24, "hora"],
      [30, "día"], [12, "mes"], [100, "año"]
    ];
    var val = seg, i = 0, nombre = "segundo";
    for (i = 0; i < u.length; i++) {
      if (val < u[i][0]) { nombre = u[i][1]; break; }
      val = val / u[i][0];
      nombre = u[i][1];
    }
    if (i >= u.length) {
      if (val < 10) return "unos " + Math.round(val * 100) + " años";
      if (val < 1000) return "cientos de años";
      if (val < 1e6) return "miles de años";
      return "millones de años";
    }
    var n = Math.max(1, Math.round(val));
    var plural = n === 1 ? nombre : (nombre === "mes" ? "meses" : nombre + "s");
    return "unos " + n + " " + plural;
  }

  function analizar(v) {
    var checks = [
      { ok: v.length >= 12, txt: "Tiene al menos 12 caracteres" },
      { ok: /[A-Z]/.test(v) && /[a-z]/.test(v), txt: "Mezcla mayúsculas y minúsculas" },
      { ok: /[0-9]/.test(v), txt: "Incluye números" },
      { ok: /[^A-Za-z0-9]/.test(v), txt: "Incluye símbolos" },
      { ok: COMUNES.indexOf(v.toLowerCase()) === -1, txt: "No es una contraseña común" }
    ];
    return checks;
  }

  function actualizar() {
    var v = input.value;

    if (!v) {
      medidor.querySelectorAll("i").forEach(function (s) { s.style.background = "var(--acero)"; s.style.borderColor = "var(--borde)"; });
      tiempo.textContent = "—";
      tiempoCaja.className = "clave-tiempo";
      analisis.innerHTML = "";
      comentario.innerHTML = "<strong>Garmr:</strong> Escribe una contraseña arriba y te digo, en tiempo real, qué tan rápido caería. Prueba primero con una mala a propósito, como <em>123456</em>.";
      return;
    }

    var esComun = COMUNES.indexOf(v.toLowerCase()) !== -1;
    var pool = poolTamano(v);

    // log10 del número de combinaciones y del tiempo en segundos
    var log10combos = v.length * Math.log10(pool || 1);
    var log10seg = log10combos - Math.log10(RATE);
    var segundos = esComun ? 0 : (log10seg > 17 ? Infinity : Math.pow(10, log10seg));

    tiempo.textContent = esComun ? "al instante" : formatoTiempo(segundos);

    // Puntaje 0..5 según el tiempo (o 0 si es común)
    var score;
    if (esComun) score = 0;
    else if (log10seg < 0) score = 1;        // < 1 seg
    else if (log10seg < 2.5) score = 2;      // < ~5 min
    else if (log10seg < 5) score = 3;        // < ~1 día
    else if (log10seg < 9.5) score = 4;      // < ~100 años
    else score = 5;

    var colores = ["var(--sangre)", "var(--sangre)", "var(--sev-media)", "var(--sev-media)", "var(--jade)", "var(--jade)"];
    medidor.querySelectorAll("i").forEach(function (s, idx) {
      if (idx < score) { s.style.background = colores[score]; s.style.borderColor = colores[score]; }
      else { s.style.background = "var(--acero)"; s.style.borderColor = "var(--borde)"; }
    });

    tiempoCaja.className = "clave-tiempo " + (score <= 1 ? "malo" : score <= 3 ? "medio" : "bueno");

    // Análisis
    var checks = analizar(v);
    analisis.innerHTML = "";
    checks.forEach(function (c) {
      var fila = document.createElement("div");
      fila.className = "clave-check " + (c.ok ? "ok" : "no");
      fila.innerHTML = '<span class="marca">' + (c.ok ? "✓" : "✕") + "</span>" + c.txt;
      analisis.appendChild(fila);
    });

    // Comentario de Garmr
    var msg;
    if (esComun) msg = "Esa está en la primera página del manual de cualquier atacante. Es lo primero que prueban. Cámbiala ya.";
    else if (score <= 1) msg = "Cae casi al instante. Muy corta o muy predecible: a un robot no le cuesta nada.";
    else if (score <= 3) msg = "Vas mejorando, pero aún es rompible con paciencia. Súmale largo y variedad.";
    else if (score === 4) msg = "¡Buena! Esta ya le da mucho trabajo a un atacante. Recuerda no repetirla en otros sitios.";
    else msg = "Excelente. Esta resiste. Ahora el toque final: activa el doble factor (2FA) y serás casi intocable.";
    comentario.innerHTML = "<strong>Garmr:</strong> " + msg;
  }

  input.addEventListener("input", actualizar);
  actualizar();
})();
