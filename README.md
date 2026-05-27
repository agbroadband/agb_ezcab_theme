# AGB EzCabl Theme — Icon Library

Librería de íconos SVG para la plataforma **EzCabl**. Sin dist/, sin catálogo — solo SVGs organizados por categoría, optimizados in-place con SVGO.

---

## Estructura

```
icons/
├── outline/          # Trazo fino navy
│   ├── network/
│   ├── navigation/
│   ├── projects/
│   ├── user/
│   ├── reports/
│   ├── payment/
│   ├── communication/
│   ├── actions/
│   ├── status/
│   └── ui/
└── filled/           # Dual-tone: cuerpo navy + acento gradiente azul
    └── (mismas categorías)
```

---

## Agregar un ícono

1. Crear el SVG en `icons/{outline|filled}/{categoría}/{nombre}.svg`  
   — nombre: kebab-case minúsculas (`cable-fiber.svg`, no `CableFiber_v2.svg`)
2. Correr el optimizador:
   ```bash
   npm run optimize
   ```
3. Verificar visualmente que el ícono se ve correcto
4. Commitear: `chore(icons): add {nombre} to {categoría}`

---

## Guía de estilo

| Propiedad | Valor |
|---|---|
| `viewBox` | `0 0 24 24` |
| Grilla | 24×24 px — zona segura: 2 px de margen |
| Esquinas | Redondeadas — sin ángulos de 90° exactos |

### Outline
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <defs>
    <style>
      .agb-outline {
        fill: none;
        stroke: var(--agb-stroke, #0D2340);
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    </style>
  </defs>
  <path class="agb-outline" d="..."/>
</svg>
```

### Filled (dual-tone)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <defs>
    <style>
      .agb-primary { fill: var(--agb-primary, #0d2c57); }
      .agb-accent  { fill: url(#agb-grad-{nombre}); }
    </style>
    <linearGradient id="agb-grad-{nombre}" x1="..." y1="..." x2="..." y2="..." gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="var(--agb-accent-start, #0393f1)"/>
      <stop offset="1" stop-color="var(--agb-accent-end, #0479d0)"/>
    </linearGradient>
  </defs>
  <path class="agb-accent"  d="..."/> <!-- acento: techo, flecha, badge -->
  <path class="agb-primary" d="..."/> <!-- cuerpo / estructura -->
</svg>
```

| Propiedad | Valor |
|---|---|
| Cuerpo | `class="agb-primary"` → `var(--agb-primary, #0d2c57)` |
| Acento | `class="agb-accent"` → gradiente `var(--agb-accent-start, #0393f1)` → `var(--agb-accent-end, #0479d0)` |
| ID gradiente | `agb-grad-{nombre}` — evita colisiones al embeber inline |

> Los colores son anulables via CSS custom properties: `--agb-primary`, `--agb-stroke`, `--agb-accent-start`, `--agb-accent-end`.

---

## Categorías

| Categoría | Descripción |
|---|---|
| `network` | Cable, fibra, router, señal |
| `navigation` | Mapa, pin, ruta, ubicación |
| `projects` | Carpeta, orden de trabajo, tarea |
| `user` | Perfil, avatar, equipo, cuenta |
| `reports` | Gráfico, documento, analítica |
| `payment` | Tarjeta, billetera, recibo |
| `communication` | Notificación, chat, email, teléfono |
| `actions` | Ajustes, búsqueda, subir, editar |
| `status` | Online, offline, verificado, alerta |
| `ui` | Flechas, cerrar, menú, chevron |
