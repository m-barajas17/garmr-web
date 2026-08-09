-- ============================================================
-- GARMR · Consultas de ejemplo (PostgreSQL)
-- ------------------------------------------------------------
-- Consultas que la plataforma usaría en el día a día.
-- Ejecutar sobre la base 'garmr' ya poblada con seed.sql.
-- ============================================================

-- 1) Resumen de todos los diagnósticos (usa la vista)
--    Para el panel de administración.
SELECT * FROM v_resumen_diagnosticos ORDER BY fecha DESC;

-- 2) Hallazgos de un cliente ordenados por urgencia
--    Para armar el plan de acción priorizado.
SELECT  h.codigo_catalogo, h.revision, h.titulo, h.severidad
FROM        hallazgos    h
JOIN        diagnosticos d ON d.id = h.diagnostico_id
JOIN        sitios       s ON s.id = d.sitio_id
JOIN        clientes     c ON c.id = s.cliente_id
WHERE       c.razon_social = 'Panadería La Espiga S.A.S.'
  AND       h.severidad IN ('critica', 'media', 'baja')
ORDER BY    CASE h.severidad
              WHEN 'critica' THEN 1
              WHEN 'media'   THEN 2
              WHEN 'baja'    THEN 3
            END;

-- 3) Puntaje promedio por sector
--    Para identificar hallazgos estructurales del nicho.
SELECT  c.sector,
        ROUND(AVG(d.puntaje), 1) AS puntaje_promedio,
        COUNT(*)                 AS diagnosticos
FROM        diagnosticos d
JOIN        sitios       s ON s.id = d.sitio_id
JOIN        clientes     c ON c.id = s.cliente_id
GROUP BY    c.sector
ORDER BY    puntaje_promedio ASC;

-- 4) Clientes con monitoreo activo y su próximo cobro
--    Para la facturación recurrente.
SELECT  c.razon_social, p.nombre AS plan, s.precio_mensual, s.proximo_cobro
FROM        suscripciones s
JOIN        clientes      c ON c.id = s.cliente_id
JOIN        planes        p ON p.id = s.plan_id
WHERE       s.estado = 'activa'
ORDER BY    s.proximo_cobro;

-- 5) ¿Qué hallazgo se repite más entre todos los sitios?
--    La pregunta comercial clave: el problema más común del nicho.
SELECT  titulo, severidad, COUNT(*) AS veces_encontrado
FROM        hallazgos
WHERE       severidad NOT IN ('sin_hallazgo', 'no_aplica')
GROUP BY    titulo, severidad
ORDER BY    veces_encontrado DESC;
