# Bases de datos de GARMR

GARMR usa **dos** bases de datos, cada una para lo que hace mejor. No es por moda: los datos del proyecto tienen dos naturalezas distintas.

## Por qué dos, y no una

| | **PostgreSQL** (relacional) | **MongoDB** (documental) |
|---|---|---|
| **Guarda** | Datos con relaciones estrictas | Contenido flexible y anidado |
| **En GARMR** | usuarios, clientes, sitios, diagnósticos, hallazgos, planes, suscripciones | catálogo de hallazgos, informes generados, conversaciones del chatbot, progreso en laboratorios |
| **Por qué ahí** | Un cliente *tiene* sitios, un sitio *tiene* diagnósticos, un diagnóstico *tiene* hallazgos. Relaciones claras que conviene garantizar con llaves foráneas y transacciones. | Un informe tiene secciones anidadas y evidencias de largo variable. Un hallazgo del catálogo tiene campos que evolucionan. Forzar eso en tablas sería incómodo. |

La regla mental: **si los datos se parecen a una factura con líneas y relaciones, van a SQL. Si se parecen a un documento con secciones que varían, van a Mongo.**

## Cómo se conectan las dos

No están mezcladas: se enlazan por un identificador.

- En PostgreSQL, la tabla `diagnosticos` tiene un `id`.
- En MongoDB, cada documento de `informes` guarda ese número en `diagnostico_id`.
- Los hallazgos: la columna `codigo_catalogo` (p.ej. `GARMR-A01-05`) en SQL apunta al documento con ese `codigo` en `catalogo_hallazgos` de Mongo.

Así, los datos del negocio viven en SQL (donde importa la integridad) y el contenido rico vive en Mongo (donde importa la flexibilidad), unidos por una referencia.

## Estructura

```
database/
├── sql/
│   ├── schema.sql      Tablas, tipos, índices y una vista de resumen
│   ├── seed.sql        Datos de ejemplo (2 clientes, 1 diagnóstico completo)
│   └── consultas.sql   5 consultas reales comentadas
└── mongo/
    ├── schema.js       4 colecciones con validación de esquema
    └── seed.js         Muestra del catálogo, un informe, una conversación y progreso
```

## Cómo levantarlas

**PostgreSQL:**
```bash
psql -U postgres -f sql/schema.sql
psql -U postgres -d garmr -f sql/seed.sql
psql -U postgres -d garmr -f sql/consultas.sql   # para ver las consultas en acción
```

**MongoDB:**
```bash
mongosh garmr mongo/schema.js
mongosh garmr mongo/seed.js
```

## Modelo relacional (resumen)

```
usuarios ─┐
          └──< clientes ──< sitios ──< diagnosticos ──< hallazgos
                    │                        │
                    └──< suscripciones >── planes
```

(`──<` se lee "tiene muchos". Un cliente tiene muchos sitios; un sitio, muchos diagnósticos; un diagnóstico, muchos hallazgos.)
