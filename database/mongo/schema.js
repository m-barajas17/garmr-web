// ============================================================
// GARMR · Base de datos documental (MongoDB)
// ------------------------------------------------------------
// Guarda el contenido flexible y anidado que encaja mal en
// tablas: el catálogo de hallazgos, los informes generados, las
// conversaciones del chatbot y el progreso en los laboratorios.
//
// Uso:
//   mongosh garmr schema.js
// ============================================================

const db = db.getSiblingDB("garmr");

// ------------------------------------------------------------
// catalogo_hallazgos
//   El catálogo de 55 hallazgos mapeado a OWASP Top 10.
//   Documental porque cada hallazgo tiene campos variables y
//   evoluciona con el tiempo.
// ------------------------------------------------------------
db.createCollection("catalogo_hallazgos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "titulo", "categoria_owasp", "severidad_base"],
      properties: {
        codigo:          { bsonType: "string", description: "p.ej. GARMR-A01-05" },
        titulo:          { bsonType: "string" },
        categoria_owasp: { bsonType: "string" },
        severidad_base:  { enum: ["critica", "alta", "media", "baja"] },
        descripcion_negocio: { bsonType: "string" },
        descripcion_tecnica: { bsonType: "string" },
        deteccion:       { bsonType: "array" },
        remediacion:     { bsonType: "array" },
        referencias:     { bsonType: "array" },
        aplica_a:        { bsonType: "array" }
      }
    }
  }
});
db.catalogo_hallazgos.createIndex({ codigo: 1 }, { unique: true });
db.catalogo_hallazgos.createIndex({ categoria_owasp: 1 });

// ------------------------------------------------------------
// informes
//   Cada informe generado (ejecutivo + técnico). Estructura
//   anidada: hallazgos con evidencia y plan de acción. El
//   diagnostico_id enlaza con la tabla 'diagnosticos' de SQL.
// ------------------------------------------------------------
db.createCollection("informes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["diagnostico_id", "tipo", "generado_en"],
      properties: {
        diagnostico_id: { bsonType: "int" },
        tipo:           { enum: ["ejecutivo", "tecnico"] },
        generado_en:    { bsonType: "date" },
        sitio:          { bsonType: "string" },
        puntaje:        { bsonType: "int", minimum: 0, maximum: 100 },
        resumen:        { bsonType: "string" },
        hallazgos:      { bsonType: "array" },
        plan_accion:    { bsonType: "array" }
      }
    }
  }
});
db.informes.createIndex({ diagnostico_id: 1, tipo: 1 });

// ------------------------------------------------------------
// conversaciones_chatbot
//   Registro de las charlas con Garmr. Cada conversación es una
//   lista variable de mensajes; sirve para mejorar la base de
//   conocimiento con dudas reales.
// ------------------------------------------------------------
db.createCollection("conversaciones_chatbot", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sesion_id", "iniciada_en", "mensajes"],
      properties: {
        sesion_id:   { bsonType: "string" },
        iniciada_en: { bsonType: "date" },
        origen:      { bsonType: "string" },
        mensajes: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["quien", "texto"],
            properties: {
              quien: { enum: ["usuario", "bot"] },
              texto: { bsonType: "string" },
              en:    { bsonType: "date" },
              intencion_detectada: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});
db.conversaciones_chatbot.createIndex({ sesion_id: 1 });
db.conversaciones_chatbot.createIndex({ iniciada_en: -1 });

// ------------------------------------------------------------
// laboratorios_progreso
//   Qué laboratorios completó cada usuario y su resultado.
//   Documental porque cada laboratorio guarda datos distintos
//   (en phishing: si cayó; en clave: el puntaje; etc.).
// ------------------------------------------------------------
db.createCollection("laboratorios_progreso", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuario_id", "laboratorio"],
      properties: {
        usuario_id:  { bsonType: "int", description: "FK lógica a usuarios en SQL" },
        laboratorio: { enum: ["phishing", "clave", "plugin"] },
        completado:  { bsonType: "bool" },
        resultado:   { bsonType: "object", description: "datos propios de cada laboratorio" },
        fecha:       { bsonType: "date" }
      }
    }
  }
});
db.laboratorios_progreso.createIndex({ usuario_id: 1, laboratorio: 1 });

print("Colecciones GARMR creadas: catalogo_hallazgos, informes, conversaciones_chatbot, laboratorios_progreso");
