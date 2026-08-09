# GARMR — Plataforma de seguridad web para pymes colombianas

> *En la mitología nórdica, **Garmr** es el perro que vigila la puerta. Este proyecto es eso: un guardián que ve lo que el dueño de un negocio no ve en su propio sitio.*

Proyecto académico · Prototipo de front-end + laboratorios educativos + modelo de datos.

GARMR revisa sitios en **WordPress**, encuentra lo que quedó expuesto y lo explica en lenguaje de negocio. Además, enseña: el usuario **aprende probando** en laboratorios seguros cómo ocurren los ataques y cómo se evitan.

## Identidad visual — "Vigilia"

El guardián en la oscuridad. Azul-negro frío, luz del vigía en índigo, **rojo sangre reservado solo para el peligro**. Detalles con carácter: esquinas biseladas (piedra tallada), divisores rúnicos, textura de grano y tipografía Chakra Petch.

## Estructura

```
garmr-web/
├── frontend/          Sitio navegable (HTML + CSS + JS)
│   ├── css/           Sistema de diseño y estilos
│   ├── js/            Interacciones, chatbot y laboratorios
│   └── assets/        Sigilo y favicon
├── database/          Modelo de datos (SQL + MongoDB)
└── docs/              Documentación de arquitectura
```

## Cómo verlo

```bash
cd frontend
python3 -m http.server 8000   # abre http://localhost:8000
```

## Historial

El proyecto se construye por partes, con un commit por avance lógico. `git log --oneline` muestra el orden.
