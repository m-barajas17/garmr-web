// ============================================================
// GARMR · Datos de ejemplo (MongoDB)
// ------------------------------------------------------------
// Uso (después de schema.js):
//   mongosh garmr seed.js
// ============================================================

const db = db.getSiblingDB("garmr");

// --- Catálogo de hallazgos (muestra del catálogo de 55) ---
db.catalogo_hallazgos.insertMany([
  {
    codigo: "GARMR-A01-05",
    titulo: "Información interna del proyecto expuesta",
    categoria_owasp: "A01:2025 - Control de acceso roto",
    severidad_base: "critica",
    descripcion_negocio: "Un archivo interno quedó visible desde internet y muestra cómo está construido su sitio. Es como dejar los planos del local pegados en la puerta.",
    descripcion_tecnica: "Archivo de configuración/estado accesible sin autenticación desde la raíz del sitio.",
    deteccion: ["Solicitar rutas comunes de configuración desde el navegador", "Verificar respuesta 200 vs 403/404"],
    remediacion: ["Bloquear el acceso al archivo por servidor web", "Mover la configuración fuera de la raíz pública"],
    referencias: ["https://owasp.org/Top10/"],
    aplica_a: ["WordPress", "WooCommerce"]
  },
  {
    codigo: "GARMR-A02-03",
    titulo: "Faltan protecciones estándar del navegador",
    categoria_owasp: "A02:2025 - Fallas criptográficas y de configuración",
    severidad_base: "media",
    descripcion_negocio: "Su sitio no le da al navegador ciertas instrucciones de seguridad que ya vienen disponibles.",
    descripcion_tecnica: "Ausencia de cabeceras: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security.",
    deteccion: ["Revisar cabeceras de respuesta HTTP", "securityheaders.com"],
    remediacion: ["Configurar cabeceras de seguridad en el servidor o vía plugin", "Definir una CSP acorde al sitio"],
    referencias: ["https://securityheaders.com"],
    aplica_a: ["WordPress"]
  },
  {
    codigo: "GARMR-A06-01",
    titulo: "Componentes desactualizados con fallas conocidas",
    categoria_owasp: "A06:2025 - Componentes vulnerables y desactualizados",
    severidad_base: "alta",
    descripcion_negocio: "Uno o más complementos están en una versión con fallas ya publicadas. Es la puerta que más usan los ataques automáticos.",
    descripcion_tecnica: "Plugins/tema/núcleo en versiones con CVE conocidos.",
    deteccion: ["Comparar versiones expuestas contra avisos públicos"],
    remediacion: ["Actualizar en entorno de prueba primero", "Retirar complementos abandonados"],
    referencias: ["https://wpscan.com/"],
    aplica_a: ["WordPress", "WooCommerce"]
  }
]);

// --- Informe ejecutivo de ejemplo (del diagnóstico 1 en SQL) ---
db.informes.insertOne({
  diagnostico_id: 1,
  tipo: "ejecutivo",
  generado_en: new Date("2026-08-06T15:00:00Z"),
  sitio: "https://laespiga.com.co",
  puntaje: 64,
  resumen: "Su sitio tiene buenas bases, pero hay un hallazgo crítico que conviene cerrar pronto y dos mejoras recomendadas.",
  hallazgos: [
    { codigo: "GARMR-A01-05", titulo: "Información interna del proyecto expuesta", severidad: "critica", riesgo: "Facilita el trabajo a un atacante y expone detalles internos.", evidencia: ["capturas/laespiga_r12.png"], remediacion: "Bloquear el acceso a ese archivo." },
    { codigo: "GARMR-A02-03", titulo: "Faltan protecciones del navegador", severidad: "media", riesgo: "Reduce el blindaje frente a ciertos ataques.", evidencia: ["capturas/laespiga_r01.png"], remediacion: "Configurar cabeceras de seguridad." }
  ],
  plan_accion: [
    { paso: 1, accion: "Restringir el archivo expuesto", plazo: "24-72 horas" },
    { paso: 2, accion: "Configurar protecciones del navegador", plazo: "1-2 semanas" },
    { paso: 3, accion: "Ocultar versiones de tecnología", plazo: "próximo mantenimiento" }
  ]
});

// --- Conversación de chatbot de ejemplo ---
db.conversaciones_chatbot.insertOne({
  sesion_id: "sesion-demo-001",
  iniciada_en: new Date("2026-08-06T16:20:00Z"),
  origen: "index.html",
  mensajes: [
    { quien: "usuario", texto: "¿Por qué me atacarían a mí?", en: new Date("2026-08-06T16:20:05Z"), intencion_detectada: "porque_a_mi" },
    { quien: "bot", texto: "Los atacantes no buscan negocios, buscan versiones vulnerables...", en: new Date("2026-08-06T16:20:06Z") },
    { quien: "usuario", texto: "dame un ejemplo", en: new Date("2026-08-06T16:20:40Z"), intencion_detectada: "seguimiento_ejemplo" },
    { quien: "bot", texto: "Es como un ladrón que empuja todas las puertas de la cuadra...", en: new Date("2026-08-06T16:20:41Z") }
  ]
});

// --- Progreso en laboratorios de ejemplo ---
db.laboratorios_progreso.insertMany([
  { usuario_id: 3, laboratorio: "phishing", completado: true, resultado: { cayo: false }, fecha: new Date("2026-08-06T16:30:00Z") },
  { usuario_id: 3, laboratorio: "clave", completado: true, resultado: { puntaje: 5, tiempo_estimado: "millones de años" }, fecha: new Date("2026-08-06T16:35:00Z") }
]);

print("Datos de ejemplo GARMR insertados.");
print("catalogo_hallazgos: " + db.catalogo_hallazgos.countDocuments());
print("informes: " + db.informes.countDocuments());
print("conversaciones_chatbot: " + db.conversaciones_chatbot.countDocuments());
print("laboratorios_progreso: " + db.laboratorios_progreso.countDocuments());
