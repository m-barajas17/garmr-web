# Arquitectura del prototipo GARMR

Este documento explica cómo encajan las piezas del proyecto, para presentarlo con una visión de conjunto.

## Las tres capas

```
┌─────────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN  (lo que ve el usuario)            │
│  frontend/ — HTML + CSS + JavaScript                     │
│                                                          │
│  index.html         landing (problema, servicios…)       │
│  login / register   entrada a la plataforma              │
│  dashboard.html     panel del cliente (diagnóstico)      │
│  laboratorios.html  los 3 laboratorios educativos        │
│  chatbot.js         Garmr, el asistente guardián         │
└───────────────────────────┬─────────────────────────────┘
                            │  (en una fase futura)
                            │   una API conectaría el
                            │   front con los datos
                            ▼
┌─────────────────────────────────────────────────────────┐
│  CAPA DE DATOS  (lo que se guarda)                        │
│                                                          │
│  PostgreSQL              MongoDB                          │
│  datos del negocio       contenido flexible              │
│  (relaciones estrictas)  (documentos anidados)           │
└─────────────────────────────────────────────────────────┘
```

## Identidad visual — "Vigilia"

Todo el sitio comparte un sistema de diseño centralizado en `frontend/css/tokens.css`:

- **Concepto:** el guardián en la oscuridad (Garmr, el sabueso nórdico que vigila la puerta).
- **Color:** base azul-negra fría, luz del vigía en índigo (`#6E86FF`), y **rojo sangre reservado solo para el peligro** (severidad crítica).
- **Forma:** esquinas biseladas (piedra tallada), divisores rúnicos, textura de grano.
- **Tipografía:** Chakra Petch (títulos), IBM Plex Sans (texto), IBM Plex Mono (datos y códigos).

## Estado y alcance del prototipo

| Pieza | Estado |
|---|---|
| Front-end navegable (landing, login, registro, panel) | ✅ Funcional |
| Garmr, el chatbot con personaje | ✅ Funcional (base de conocimiento local, memoria de contexto) |
| 3 laboratorios interactivos (phishing, clave, plugin) | ✅ Funcionales |
| Validación de formularios | ✅ Funcional (lado del cliente) |
| Diseño de base de datos SQL | ✅ Esquema + datos + consultas |
| Diseño de base de datos Mongo | ✅ Esquema + datos |
| Conexión front ↔ bases de datos | ⏳ Fase futura (requiere un backend/API) |

Las bases de datos **no están conectadas** al front-end a propósito: en esta etapa el objetivo es demostrar el **diseño** de cada capa por separado. La flecha punteada del diagrama es el trabajo de integración que vendría después (un backend en, por ejemplo, Node.js o Python que exponga una API).

## Recorrido de un dato (ejemplo)

Para ilustrar cómo trabajarían juntas las capas en la versión completa:

1. Una pyme se **registra** (`register.html`) → se crearía un `usuario` y un `cliente` en **PostgreSQL**.
2. Se ejecuta un **diagnóstico** sobre su sitio → un `diagnostico` con sus `hallazgos` en **PostgreSQL**.
3. Se **genera el informe** ejecutivo y técnico → documentos en **MongoDB** (`informes`), enlazados por `diagnostico_id`.
4. El cliente entra a su **panel** (`dashboard.html`) → se leería el diagnóstico de SQL y el informe de Mongo.
5. El visitante usa a **Garmr** o hace un **laboratorio** → la conversación y el progreso se guardan en **MongoDB**.

## Decisiones de diseño y su porqué

- **HTML/CSS/JS puro, sin frameworks.** Para un prototipo que corre en cualquier navegador sin instalar nada y es fácil de leer y defender. Menos dependencias, menos cosas que fallen en la presentación.
- **Chatbot y laboratorios sin API.** Funcionan con lógica local para que la demo no dependa de internet ni de una clave. El código deja documentado cómo conectar un modelo real después.
- **Dos bases de datos.** Cada tipo de dato en la herramienta que mejor lo maneja (ver `database/README.md`).
- **Sistema de diseño con tokens.** Todos los colores y tipografías salen de `tokens.css`; el sitio es coherente y fácil de ajustar.
- **Aprender probando.** Los laboratorios no explican el ataque: lo hacen *vivir* de forma segura. Se recuerda mejor lo que se experimenta que lo que se lee.

## Estructura de carpetas

```
garmr-web/
├── frontend/
│   ├── index.html · login.html · register.html
│   ├── dashboard.html · laboratorios.html
│   ├── css/    (tokens, base, components, pages, laboratorios, chatbot)
│   ├── js/     (main, auth, chatbot, laboratorios, lab-phishing, lab-clave, lab-plugin)
│   └── assets/ (sigilo, favicon)
├── database/
│   ├── sql/    (schema, seed, consultas)
│   ├── mongo/  (schema, seed)
│   └── README.md
└── docs/
    └── ARQUITECTURA.md   ← este documento
```

## Marco legal

- **Ley 1273 de 2009** (delitos informáticos): el diagnóstico Nivel 0 solo consulta información pública; los niveles superiores requieren autorización escrita.
- **Ley 1581 de 2012** (protección de datos): el registro advierte el tratamiento de datos; el diseño separa datos personales (SQL) de contenido (Mongo).
