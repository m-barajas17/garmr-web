/* ============================================================
   GARMR · chatbot.js — "Garmr", el sabueso guardián
   ------------------------------------------------------------
   Garmr es un personaje: un guardián veterano que monta guardia
   sobre sitios web. Habla en primera persona, directo pero
   cercano, y explica con analogías.

   Conversación más amplia:
   - Recuerda tu nombre y el último tema (contexto).
   - Entiende seguimientos: "¿por qué?", "dame un ejemplo",
     "¿cómo lo evito?", "explícame más".

   FUNCIONA SIN CONEXIÓN Y SIN API (base de conocimiento local).
   Para conectar un modelo real, ver responderConAPI() al final.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Contexto de la conversación ---------------- */
  var ctx = { nombre: null, ultimoTema: null };

  /* ---------------- Base de conocimiento ----------------
     Cada tema puede tener:
       respuesta : la explicación principal
       ejemplo   : para "dame un ejemplo"
       evitar    : para "¿cómo lo evito?"
       mas       : para "explícame más"
  */
  var BASE = [
    {
      id: "wordpress",
      claves: ["que es wordpress", "wordpress"],
      respuesta: "WordPress es la plataforma con la que está hecho más de un tercio de los sitios del mundo. Es la estructura del local: sólida por sí misma, pero se le instalan <strong>complementos</strong> de terceros — y ahí es donde suelo olfatear los problemas.",
      ejemplo: "Por ejemplo: una panadería con su tienda en WordPress instala un complemento para cupones. Ese complemento quedó sin actualizar dos años, y por ahí es por donde entran. No fue WordPress: fue la máquina de terceros que le enchufaron.",
      mas: "WordPress tiene tres capas: el <strong>núcleo</strong> (la base), el <strong>tema</strong> (cómo se ve) y los <strong>complementos</strong> (qué hace). Cada una puede tener fallas, pero en mi experiencia el 90% de los sustos vienen de los complementos y de no actualizar."
    },
    {
      id: "plugin",
      claves: ["que es un plugin", "plugin", "complemento", "complementos"],
      respuesta: "Un complemento (plugin) le agrega funciones a tu sitio: un formulario, una tienda, una galería. Yo los veo como <strong>máquinas de un tercero</strong> que metes a tu local y a las que les das llave. Un sitio típico tiene 20 o más.",
      evitar: "Tres reglas que le ladro a todos: <strong>1)</strong> instala solo los que de verdad uses, <strong>2)</strong> mantenlos actualizados, <strong>3)</strong> borra (no solo desactives) los que ya no usas. Un complemento apagado pero instalado sigue siendo una puerta.",
      ejemplo: "Imagina que le das una copia de la llave de tu local a 20 proveedores distintos. Con que uno la pierda, cualquiera entra. Así funcionan los complementos."
    },
    {
      id: "porque_a_mi",
      claves: ["quien me va a atacar", "por que me atacarian", "quien querria", "a mi no me pasa", "por que a mi", "soy pequeno", "por que me hackearian"],
      respuesta: "La pregunta que más me hacen. La respuesta incómoda: <strong>nadie en particular</strong>. Los atacantes no buscan negocios, buscan versiones vulnerables. Un robot recorre internet probando puertas; no le importa si eres una panadería o un banco, solo si tu puerta cede.",
      ejemplo: "Es como un ladrón que camina por la cuadra empujando todas las puertas. No te eligió a ti: eligió la que estaba abierta. Resulta que era la tuya.",
      mas: "Estos robots prueban miles de sitios por minuto buscando un complemento específico con una falla conocida. Si lo tienes, entras a su lista automáticamente. Por eso 'nunca me ha pasado' no es seguridad: es suerte que todavía no se acaba."
    },
    {
      id: "backup",
      claves: ["backup", "respaldo", "copia de seguridad", "perder informacion", "copia"],
      respuesta: "Un backup es una <strong>copia de seguridad</strong> de tu sitio guardada fuera del servidor. Es tu red de seguridad: si borran o dañan todo, restauras y sigues.",
      evitar: "El error que más huelo: tener backups que nadie ha probado. Un respaldo que no sabes restaurar no es un respaldo, es una ilusión. Pruébalo cada tanto y guárdalo <strong>en otro lugar</strong>, no en el mismo servidor.",
      ejemplo: "Si tu local se incendia, ¿de qué sirve que la caja fuerte con las copias esté dentro del local? El backup va afuera."
    },
    {
      id: "ransomware",
      claves: ["ransomware", "secuestro", "cifrar mi sitio", "piden rescate", "secuestran"],
      respuesta: "El ransomware es un ataque que <strong>bloquea o cifra</strong> tu sitio y te piden dinero para devolvértelo. Es el ladrón que te cambia la chapa y te cobra por la nueva llave.",
      evitar: "No pagues: financias al siguiente ataque y muchas veces igual no devuelven nada. La defensa real es aburrida pero infalible: backups verificados y guardados aparte. Con eso, restauras y no negocias con nadie."
    },
    {
      id: "phishing",
      claves: ["phishing", "correo falso", "me llego un correo", "estafa por correo", "correo sospechoso"],
      respuesta: "El phishing es cuando alguien se hace pasar por alguien de confianza — tu banco, tu proveedor, hasta tu hosting — para que entregues contraseñas o datos. Es un lobo con piel de oveja tocando tu puerta.",
      evitar: "Mi regla de oro: <strong>desconfía de la urgencia</strong>. 'Tu cuenta será bloqueada en 24 horas' es la trampa clásica. Nunca metas tu clave desde un enlace de un correo: entra tú directo al sitio, escribiendo la dirección.",
      ejemplo: "Te llega un correo de 'tu banco' con un botón 'Verificar cuenta'. El botón te lleva a una página idéntica a la del banco, pero es falsa. Escribes tu clave... y se la acabas de dar al lobo. ¿Quieres probarlo sin riesgo? Tengo un laboratorio para eso."
    },
    {
      id: "suplantacion",
      claves: ["suplantacion", "correos falsos con mi nombre", "spf", "dmarc", "dkim", "envian correos", "usan mi correo"],
      respuesta: "Si tu dominio no tiene bien configurados <strong>SPF, DKIM y DMARC</strong>, cualquiera puede mandar correos que parecen venir de tu empresa. Es alguien firmando con tu nombre sin que puedas evitarlo.",
      evitar: "Son tres candados que se configuran una vez en tu dominio y cierran esa puerta. En GARMR los revisamos y los dejamos listos; no es algo que el dueño tenga que entender a fondo, pero sí exigir que esté hecho."
    },
    {
      id: "contrasena",
      claves: ["contrasena segura", "clave segura", "password", "que contrasena", "doble factor", "2fa", "autenticacion", "contraseña"],
      respuesta: "Una buena contraseña es <strong>larga y única</strong> para cada sitio. Mejor una frase que una palabra rara: 'MiPerroGarmrVigilaDeNoche' vence a 'P@ss123' y encima la recuerdas.",
      evitar: "Lo más importante no es la clave, es el <strong>doble factor (2FA)</strong>: ese código que llega a tu celular. Aunque adivinen tu contraseña, sin el segundo factor no entran. Actívalo hoy en tu WordPress y en tu correo.",
      ejemplo: "Una clave sola es una chapa. El 2FA es la segunda chapa que solo tú puedes abrir desde el celular. Dos chapas, dos veces más difícil."
    },
    {
      id: "https",
      claves: ["https", "candado", "certificado", "ssl", "tls", "cifrado"],
      respuesta: "El candado del navegador (HTTPS) significa que la información viaja <strong>cifrada</strong> entre el visitante y tu sitio, para que nadie la lea en el camino.",
      mas: "Cuidado con un mito: tener candado NO quiere decir que el sitio esté seguro por dentro. Un sitio puede tener HTTPS impecable y aun así estar lleno de complementos vulnerables. El candado protege el camino, no la casa."
    },
    {
      id: "actualizar",
      claves: ["actualizar", "actualizacion", "updates", "por que actualizar", "version vieja", "desactualizado"],
      respuesta: "Actualizar es lo más importante y lo que más se descuida. Cuando se descubre una falla, se publica su arreglo… y también queda a la vista de los atacantes. Si no actualizas, quedas con una puerta <strong>rota y anunciada</strong>.",
      evitar: "La clave es actualizar <strong>con respaldo previo</strong> y, si puedes, probar en un entorno aparte antes de tocar el sitio real. Justo eso es lo que hace el monitoreo mensual de GARMR: actualiza sin romper.",
      ejemplo: "Es como cuando avisan por radio que cierto modelo de cerradura se abre con un truco. El fabricante saca la cerradura nueva, pero si tú no la cambias, ahora TODOS los ladrones saben cómo abrir la tuya."
    },
    {
      id: "hackeado",
      claves: ["me hackearon", "hackearon mi sitio", "sitio comprometido", "que hago si", "ya me atacaron", "sitio infectado", "me entraron"],
      respuesta: "Tranquilo, respira. Vamos con cabeza fría: <strong>1)</strong> no borres nada aún, es evidencia; <strong>2)</strong> pon el sitio en mantenimiento si puedes; <strong>3)</strong> avisa a tu hosting; <strong>4)</strong> cambia las contraseñas de administrador.",
      mas: "Lo más importante y lo que casi nadie hace: limpiar sin encontrar <strong>por dónde entraron</strong> hace que vuelva a pasar en días. Hay que hallar la puerta, no solo barrer el desastre. Si quieres, GARMR te ayuda a rastrearlo."
    },
    {
      id: "owasp",
      claves: ["owasp", "top 10", "estandar"],
      respuesta: "OWASP es la organización que publica el <strong>Top 10</strong> de los riesgos más críticos en aplicaciones web: el estándar mundial. Mi catálogo de hallazgos está mapeado a OWASP, así cada revisión tiene fundamento y no es una opinión suelta.",
    },
    {
      id: "cabeceras",
      claves: ["cabeceras", "headers", "proteccion del navegador"],
      respuesta: "Las cabeceras de seguridad son <strong>instrucciones que tu sitio le da al navegador</strong> del visitante: 'no dejes que otro sitio me muestre disfrazado', 'no ejecutes este tipo de código'. Cuando faltan, el navegador no usa protecciones que ya trae.",
    },
    {
      id: "laboratorios",
      claves: ["laboratorio", "laboratorios", "probar", "practicar", "simulacion", "aprender haciendo"],
      respuesta: "¡Mi parte favorita! Los <strong>laboratorios</strong> son pruebas seguras donde vives un ataque sin ningún riesgo, para aprender a olerlo tú mismo: el correo trampa, la clave débil y el plugin abandonado. Se cae para no volver a caer.",
    },
    {
      id: "servicio",
      claves: ["que es garmr", "que haces", "que ofrecen", "de que se trata", "servicio", "como funciona garmr"],
      respuesta: "Soy Garmr: monto guardia sobre sitios en WordPress. Reviso, encuentro lo que quedó expuesto y te lo explico claro. Trabajo en cuatro niveles: <strong>diagnóstico gratis</strong>, auditoría, corrección y monitoreo mensual.",
    },
    {
      id: "precio",
      claves: ["cuanto cuesta", "precio", "precios", "vale", "tarifa", "cobran"],
      respuesta: "El diagnóstico inicial es <strong>gratis</strong>. Los demás niveles, orientativos: auditoría desde $700.000 COP (pago único), corrección desde $900.000 COP y monitoreo desde $180.000 COP al mes. El precio final depende del tamaño de tu sitio.",
    },
    {
      id: "legal",
      claves: ["es legal", "legal", "permiso", "ley 1273", "sin autorizacion"],
      respuesta: "Sí, y me tomo esto en serio. El diagnóstico gratis solo mira <strong>lo que tu sitio ya le muestra a cualquiera</strong> en internet: no entro, no uso claves, no ataco. Para revisar por dentro (auditoría) siempre pido tu <strong>autorización por escrito</strong>, como manda la Ley 1273 de 2009.",
    },
    {
      id: "quien_eres",
      claves: ["quien eres", "eres un perro", "eres real", "eres un robot", "eres una ia", "como te llamas", "tu nombre"],
      respuesta: "Soy Garmr — en la mitología nórdica, el sabueso que vigila la puerta. Aquí hago lo mismo: vigilo tu sitio. Soy un asistente, sí, pero uno que sabe de esto. Pregúntame lo que quieras sobre la seguridad de tu negocio.",
    }
  ];

  /* ---------------- Frases de personalidad ---------------- */
  var SALUDO = "Soy <strong>Garmr</strong>. 🐺 Llevo la guardia de este lugar. Pregúntame lo que quieras sobre la seguridad de tu sitio — o toca una pista de abajo. Y si me dices tu nombre, mejor.";
  var SUGERENCIAS = ["¿Por qué me atacarían a mí?", "¿Qué es un backup?", "¿Cómo hago una buena contraseña?", "Me hackearon, ¿qué hago?", "¿Qué son los laboratorios?"];

  /* ---------------- Utilidades ---------------- */
  function normalizar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[¿?¡!.,]/g, " ").replace(/\s+/g, " ").trim();
  }

  function detectarNombre(texto) {
    var m = normalizar(texto).match(/(?:me llamo|mi nombre es|soy)\s+([a-z]{2,20})/);
    if (m) {
      // evita "soy dueño", "soy nuevo", etc.
      var stop = ["dueno", "nuevo", "cliente", "un", "una", "el", "la", "de"];
      if (stop.indexOf(m[1]) === -1) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
    }
    return null;
  }

  function esSeguimiento(t) {
    if (/\b(ejemplo|ejemplos|un caso)\b/.test(t)) return "ejemplo";
    if (/\b(evito|evitar|prevenir|protejo|proteger|como me cuido|que hago)\b/.test(t)) return "evitar";
    if (/\b(mas|explica|explicame|profundiza|detalle|amplia|no entiendo)\b/.test(t)) return "mas";
    if (/\b(por que|porque|por que es asi)\b/.test(t)) return "mas";
    return null;
  }

  /* Motor local: contexto + seguimientos + coincidencia por claves */
  function responder(textoOriginal) {
    var t = normalizar(textoOriginal);

    // 1) ¿Dio su nombre?
    var nombre = detectarNombre(textoOriginal);
    if (nombre) {
      ctx.nombre = nombre;
      return "¡Encantado, " + nombre + "! Cuenta conmigo. ¿Qué quieres saber sobre la seguridad de tu sitio?";
    }

    // 2) ¿Es una pregunta de seguimiento sobre el último tema?
    var seg = esSeguimiento(t);
    if (seg && ctx.ultimoTema) {
      var temaPrev = BASE.find(function (x) { return x.id === ctx.ultimoTema; });
      if (temaPrev && temaPrev[seg]) return temaPrev[seg];
      if (temaPrev && seg === "mas" && temaPrev.ejemplo) return temaPrev.ejemplo;
    }

    // 3) Coincidencia por palabras clave
    var mejor = null, mejorPuntaje = 0;
    BASE.forEach(function (item) {
      var puntaje = 0;
      item.claves.forEach(function (clave) {
        if (t.indexOf(normalizar(clave)) !== -1) puntaje += clave.split(" ").length;
      });
      if (puntaje > mejorPuntaje) { mejorPuntaje = puntaje; mejor = item; }
    });

    if (mejor) {
      ctx.ultimoTema = mejor.id;
      var prefijo = (ctx.nombre && Math.random() < 0.35) ? ctx.nombre + ", " : "";
      var r = mejor.respuesta;
      // baja mayúscula inicial si le ponemos prefijo con nombre
      if (prefijo) r = r.charAt(0).toLowerCase() + r.slice(1);
      return prefijo + r;
    }

    // 4) Sin coincidencia — respuesta de Garmr, no genérica
    return "Esa no la tengo olfateada del todo. Puedo ayudarte con contraseñas, backups, phishing, ransomware, actualizaciones, o cómo funciona GARMR. Prueba, por ejemplo: <strong>\"¿por qué me atacarían a mí?\"</strong> o pídeme <strong>un ejemplo</strong> del último tema.";
  }

  /* ---------------- (Opcional) modelo real ----------------
     async function responderConAPI(texto) {
       const r = await fetch("/api/chat", {           // tu backend
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ mensaje: texto, contexto: ctx })
       });
       return (await r.json()).respuesta;
     }
     La clave de API va en el backend, NUNCA en el front.
  */

  /* ---------------- Interfaz ---------------- */
  var iconoEnviar = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  var rutaSigilo = "assets/sigilo.svg";

  var boton = document.createElement("button");
  boton.className = "garmr-btn";
  boton.setAttribute("aria-label", "Hablar con Garmr");
  boton.innerHTML = '<img src="' + rutaSigilo + '" alt="">';

  var panel = document.createElement("div");
  panel.className = "garmr-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Garmr, asistente de seguridad");
  panel.innerHTML =
    '<div class="garmr-head">' +
      '<img src="' + rutaSigilo + '" alt="">' +
      '<div class="info"><strong>GARMR</strong><small>De guardia</small></div>' +
      '<button aria-label="Cerrar" id="garmrCerrar">×</button>' +
    '</div>' +
    '<div class="garmr-cuerpo" id="garmrCuerpo"></div>' +
    '<div class="garmr-sugerencias" id="garmrSug"></div>' +
    '<div class="garmr-input">' +
      '<input type="text" id="garmrInput" placeholder="Escríbele a Garmr…" aria-label="Escribe tu mensaje" />' +
      '<button id="garmrEnviar" aria-label="Enviar">' + iconoEnviar + '</button>' +
    '</div>';

  document.body.appendChild(boton);
  document.body.appendChild(panel);

  var cuerpo = panel.querySelector("#garmrCuerpo");
  var input = panel.querySelector("#garmrInput");
  var enviar = panel.querySelector("#garmrEnviar");
  var cerrar = panel.querySelector("#garmrCerrar");
  var sug = panel.querySelector("#garmrSug");

  function agregar(html, quien) {
    var m = document.createElement("div");
    m.className = "msg msg--" + quien;
    m.innerHTML = html;
    cuerpo.appendChild(m);
    cuerpo.scrollTop = cuerpo.scrollHeight;
  }

  function olfateando() {
    var e = document.createElement("div");
    e.className = "msg msg--bot olfateando";
    e.innerHTML = "<i></i><i></i><i></i>";
    cuerpo.appendChild(e);
    cuerpo.scrollTop = cuerpo.scrollHeight;
    return e;
  }

  function pintarSug() {
    sug.innerHTML = "";
    SUGERENCIAS.forEach(function (s) {
      var chip = document.createElement("button");
      chip.className = "garmr-chip";
      chip.textContent = s;
      chip.addEventListener("click", function () { procesar(s); });
      sug.appendChild(chip);
    });
  }

  function procesar(texto) {
    texto = String(texto).trim();
    if (!texto) return;
    agregar(texto.replace(/</g, "&lt;"), "yo");
    input.value = "";
    var esc = olfateando();
    setTimeout(function () {
      esc.remove();
      agregar(responder(texto), "bot");
    }, 600 + Math.random() * 400);
  }

  var abierto = false;
  function alternar() {
    abierto = !abierto;
    panel.classList.toggle("abierto", abierto);
    if (abierto) {
      if (!cuerpo.hasChildNodes()) { agregar(SALUDO, "bot"); pintarSug(); }
      setTimeout(function () { input.focus(); }, 350);
    }
  }

  boton.addEventListener("click", alternar);
  cerrar.addEventListener("click", alternar);
  enviar.addEventListener("click", function () { procesar(input.value); });
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") procesar(input.value); });
})();
