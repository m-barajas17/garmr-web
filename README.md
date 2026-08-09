# GARMR — Plataforma de seguridad web para pymes colombianas

> *En la mitología nórdica, **Garmr** es el perro que vigila la puerta. Este proyecto es eso: un guardián que ve lo que el dueño de un negocio no ve en su propio sitio.*

Proyecto académico · Prototipo de front-end + laboratorios educativos + modelo de datos.

GARMR revisa sitios en **WordPress**, encuentra lo que quedó expuesto y lo explica en lenguaje de negocio. Además **enseña**: el usuario aprende probando, en laboratorios seguros, cómo ocurren los ataques y cómo evitarlos.

## Qué incluye

| Parte | Qué es |
|---|---|
| **Landing** | El problema (analogía del local), la escalera de 4 servicios, el informe dual y la comparación |
| **Login / Registro / Panel** | Entrada a la plataforma y panel del cliente con puntaje, hallazgos y plan de acción |
| **Garmr** | Chatbot con personaje: memoria de contexto y preguntas de seguimiento. Funciona sin conexión |
| **Laboratorios** | 3 experiencias "cae y aprende": el correo trampa, la clave débil y el plugin abandonado |
| **Bases de datos** | Modelo relacional (PostgreSQL) + documental (MongoDB) |

## Identidad visual — "Vigilia"

El guardián en la oscuridad. Azul-negro frío, luz del vigía en índigo, **rojo sangre solo para el peligro**. Esquinas biseladas, divisores rúnicos, textura de grano y tipografía Chakra Petch. Todo sale de `frontend/css/tokens.css`.

## Estructura

```
garmr-web/
├── frontend/          Sitio navegable (HTML + CSS + JS)
│   ├── css/           Sistema de diseño y estilos
│   ├── js/            Interacciones, chatbot y laboratorios
│   └── assets/        Sigilo y favicon
├── database/          Modelo de datos (SQL + MongoDB) — ver database/README.md
└── docs/              Documentación de arquitectura — ver docs/ARQUITECTURA.md
```

## Cómo verlo

El front-end no necesita instalar nada: abre `frontend/index.html` en el navegador, o usa la extensión **Live Server** de VS Code (clic derecho -> "Open with Live Server").

## Estado

Es un **prototipo**: el front-end, el chatbot y los laboratorios son funcionales; las bases de datos son el diseño de la capa de datos, listo para integrarse con un backend en una fase futura. Detalles en `docs/ARQUITECTURA.md`.

## Marco legal

- **Ley 1273 de 2009** (delitos informáticos): el diagnóstico Nivel 0 solo consulta información pública.
- **Ley 1581 de 2012** (protección de datos personales).

---

Construido por partes, con un commit por cada avance. `git log --oneline` muestra el recorrido.
