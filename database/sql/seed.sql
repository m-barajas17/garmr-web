-- ============================================================
-- GARMR · Datos de ejemplo (PostgreSQL)
-- ------------------------------------------------------------
-- Uso (después de schema.sql):
--   psql -U postgres -d garmr -f seed.sql
-- ============================================================

-- --- Usuarios (equipo GARMR + clientes) ---
-- password_hash es un valor de ejemplo; en producción sería un
-- hash real (bcrypt/argon2), nunca la contraseña en texto.
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Miguel (Analista)',    'miguel@garmr.dev',      '$2b$10$ejemploHashAnalista', 'analista'),
  ('Admin GARMR',          'admin@garmr.dev',       '$2b$10$ejemploHashAdmin',    'admin'),
  ('María — La Espiga',    'maria@laespiga.com.co', '$2b$10$ejemploHashCliente1', 'cliente'),
  ('Carlos — TecnoRepara', 'carlos@tecnorepara.co', '$2b$10$ejemploHashCliente2', 'cliente');

-- --- Clientes (pymes) ---
INSERT INTO clientes (razon_social, nit, sector, ciudad, contacto_nombre, contacto_email, usuario_id) VALUES
  ('Panadería La Espiga S.A.S.', '900123456', 'Alimentos', 'Bogotá',   'María Gómez', 'maria@laespiga.com.co', 3),
  ('TecnoRepara Ltda.',          '900987654', 'Servicios', 'Medellín', 'Carlos Ruiz', 'carlos@tecnorepara.co', 4);

-- --- Sitios ---
INSERT INTO sitios (cliente_id, url, cms, tiene_woocommerce, hosting) VALUES
  (1, 'https://laespiga.com.co', 'WordPress', true,  'Hosting compartido'),
  (2, 'https://tecnorepara.co',  'WordPress', false, 'VPS');

-- --- Planes (la escalera de servicios) ---
INSERT INTO planes (nombre, nivel, descripcion, precio_cop, es_recurrente) VALUES
  ('Diagnóstico externo',   '0_diagnostico', 'Revisión pasiva desde afuera. Puntaje y hallazgos.',      0,      false),
  ('Auditoría completa',    '1_auditoria',   'Revisión interna con autorización. Verificación manual.', 700000, false),
  ('Corrección y blindaje', '2_correccion',  'Ejecución del plan de corrección con respaldo previo.',   900000, false),
  ('Monitoreo mensual',     '3_monitoreo',   'Vigilancia continua, actualizaciones y reporte mensual.', 180000, true);

-- --- Diagnóstico de ejemplo (el del dashboard) ---
INSERT INTO diagnosticos (sitio_id, analista_id, nivel, fecha, puntaje, estado) VALUES
  (1, 1, '0_diagnostico', DATE '2026-08-06', 64, 'entregado');

-- --- Hallazgos del diagnóstico 1 ---
INSERT INTO hallazgos (diagnostico_id, codigo_catalogo, revision, titulo, severidad, observacion) VALUES
  (1, 'GARMR-A01-05', 'R12', 'Información interna del proyecto expuesta',   'critica',      'Archivo de configuración accesible desde el navegador.'),
  (1, 'GARMR-A02-03', 'R01', 'Faltan protecciones estándar del navegador', 'media',        'No se envían cabeceras de seguridad recomendadas.'),
  (1, 'GARMR-A02-08', 'R05', 'Se revelan las versiones de la tecnología',  'baja',         'El sitio expone versiones exactas de sus componentes.'),
  (1, NULL,           'R02', 'Cifrado en tránsito correcto',               'sin_hallazgo', 'HTTPS bien configurado.'),
  (1, NULL,           'R03', 'Sitio disponible y sin listas negras',       'sin_hallazgo', 'No aparece en Google Safe Browsing.');

-- --- Suscripción de ejemplo ---
INSERT INTO suscripciones (cliente_id, plan_id, estado, precio_mensual, inicio, proximo_cobro) VALUES
  (1, 4, 'activa', 180000, DATE '2026-08-07', DATE '2026-09-07');
