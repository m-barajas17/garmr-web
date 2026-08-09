-- ============================================================
-- GARMR · Base de datos relacional (PostgreSQL)
-- ------------------------------------------------------------
-- Guarda los datos con relaciones estrictas y transacciones:
-- usuarios, clientes, sitios, diagnósticos, hallazgos, planes
-- y suscripciones.
--
-- Uso:
--   psql -U postgres -f schema.sql
-- ============================================================

DROP DATABASE IF EXISTS garmr;
CREATE DATABASE garmr;
\connect garmr

-- ------------------------------------------------------------
-- Tipos enumerados: valores cerrados del dominio GARMR
-- ------------------------------------------------------------
CREATE TYPE rol_usuario    AS ENUM ('admin', 'analista', 'cliente');
CREATE TYPE severidad      AS ENUM ('critica', 'alta', 'media', 'baja', 'sin_hallazgo', 'no_aplica');
CREATE TYPE estado_diag    AS ENUM ('en_proceso', 'completado', 'entregado');
CREATE TYPE nivel_servicio AS ENUM ('0_diagnostico', '1_auditoria', '2_correccion', '3_monitoreo');
CREATE TYPE estado_susc    AS ENUM ('activa', 'pausada', 'cancelada');

-- ------------------------------------------------------------
-- usuarios: quien entra a la plataforma (equipo GARMR o cliente)
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(120) NOT NULL,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,   -- nunca se guarda la clave en texto plano
    rol           rol_usuario  NOT NULL DEFAULT 'cliente',
    creado_en     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- clientes: la pyme (el negocio)
-- ------------------------------------------------------------
CREATE TABLE clientes (
    id              SERIAL PRIMARY KEY,
    razon_social    VARCHAR(160) NOT NULL,
    nit             VARCHAR(20) UNIQUE,
    sector          VARCHAR(80),
    ciudad          VARCHAR(80),
    contacto_nombre VARCHAR(120),
    contacto_email  VARCHAR(160),
    usuario_id      INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- sitios: los sitios web de cada cliente
-- ------------------------------------------------------------
CREATE TABLE sitios (
    id                SERIAL PRIMARY KEY,
    cliente_id        INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    url               VARCHAR(255) NOT NULL,
    cms               VARCHAR(60) DEFAULT 'WordPress',
    tiene_woocommerce BOOLEAN DEFAULT false,
    hosting           VARCHAR(120),
    creado_en         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- planes: la escalera de servicios (catálogo)
-- ------------------------------------------------------------
CREATE TABLE planes (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(80) NOT NULL,
    nivel         nivel_servicio NOT NULL,
    descripcion   TEXT,
    precio_cop    NUMERIC(12,2) NOT NULL DEFAULT 0,
    es_recurrente BOOLEAN NOT NULL DEFAULT false
);

-- ------------------------------------------------------------
-- diagnosticos: cada revisión ejecutada sobre un sitio
-- ------------------------------------------------------------
CREATE TABLE diagnosticos (
    id          SERIAL PRIMARY KEY,
    sitio_id    INTEGER NOT NULL REFERENCES sitios(id) ON DELETE CASCADE,
    analista_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    nivel       nivel_servicio NOT NULL DEFAULT '0_diagnostico',
    fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
    puntaje     INTEGER CHECK (puntaje BETWEEN 0 AND 100),
    estado      estado_diag NOT NULL DEFAULT 'en_proceso',
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- hallazgos: cada resultado de una revisión del diagnóstico
--   codigo_catalogo enlaza con el catálogo de 55 hallazgos
--   (que vive en MongoDB: catalogo_hallazgos)
-- ------------------------------------------------------------
CREATE TABLE hallazgos (
    id              SERIAL PRIMARY KEY,
    diagnostico_id  INTEGER NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
    codigo_catalogo VARCHAR(20),     -- p.ej. 'GARMR-A01-05'
    revision        VARCHAR(10),     -- p.ej. 'R12'
    titulo          VARCHAR(160) NOT NULL,
    severidad       severidad NOT NULL,
    observacion     TEXT,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- suscripciones: monitoreo mensual (Nivel 3)
-- ------------------------------------------------------------
CREATE TABLE suscripciones (
    id             SERIAL PRIMARY KEY,
    cliente_id     INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    plan_id        INTEGER NOT NULL REFERENCES planes(id),
    estado         estado_susc NOT NULL DEFAULT 'activa',
    precio_mensual NUMERIC(12,2) NOT NULL,
    inicio         DATE NOT NULL DEFAULT CURRENT_DATE,
    proximo_cobro  DATE
);

-- ------------------------------------------------------------
-- Índices para las consultas más frecuentes
-- ------------------------------------------------------------
CREATE INDEX idx_sitios_cliente      ON sitios(cliente_id);
CREATE INDEX idx_diag_sitio          ON diagnosticos(sitio_id);
CREATE INDEX idx_hallazgos_diag      ON hallazgos(diagnostico_id);
CREATE INDEX idx_hallazgos_severidad ON hallazgos(severidad);
CREATE INDEX idx_susc_cliente        ON suscripciones(cliente_id);

-- ------------------------------------------------------------
-- Vista: resumen de cada diagnóstico con su cliente y sitio
-- ------------------------------------------------------------
CREATE VIEW v_resumen_diagnosticos AS
SELECT  d.id AS diagnostico_id,
        c.razon_social,
        s.url,
        d.fecha,
        d.puntaje,
        d.estado,
        COUNT(h.id) FILTER (WHERE h.severidad = 'critica') AS criticos,
        COUNT(h.id) FILTER (WHERE h.severidad = 'media')   AS medios,
        COUNT(h.id) FILTER (WHERE h.severidad = 'baja')    AS bajos
FROM        diagnosticos d
JOIN        sitios       s ON s.id = d.sitio_id
JOIN        clientes     c ON c.id = s.cliente_id
LEFT JOIN   hallazgos    h ON h.diagnostico_id = d.id
GROUP BY    d.id, c.razon_social, s.url, d.fecha, d.puntaje, d.estado;
