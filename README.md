# AGB EzCabl Theme

Sistema de diseño para la plataforma **EzCabl** — iconos SVG y tokens de color para una app de gestión de servicios broadband/cable, distribuidos como librería CDN-first.

Estilo: **Clean Corporate** — iconos de trazo fino, trazos en azul marino oscuro, acentos en azul.

---

## Tabla de contenidos

1. [Estructura del repositorio](#estructura-del-repositorio)
2. [Categorías de iconos](#categorías-de-iconos)
3. [Guía de estilo visual](#guía-de-estilo-visual)
4. [Flujo de trabajo del diseñador](#flujo-de-trabajo-del-diseñador)
5. [Referencia de scripts](#referencia-de-scripts)
6. [Design Tokens](#design-tokens)
7. [Uso por CDN](#uso-por-cdn)
8. [Catálogo icons.json](#catálogo-iconsjson)
9. [Contribuir](#contribuir)

---

## Estructura del repositorio

```
agb_ezcab_theme/
├── icons/
│   ├── outline/           # Iconos de trazo (estilo principal)
│   │   ├── network/       # Cable, fibra, conexión, señal
│   │   ├── navigation/    # Mapa, pin, ruta, ubicación
│   │   ├── projects/      # Carpeta, tarea, orden de trabajo
│   │   ├── user/          # Perfil, avatar, equipo, cuenta
│   │   ├── reports/       # Gráfico, documento, analítica
│   │   ├── payment/       # Tarjeta, billetera, recibo
│   │   ├── communication/ # Notificación, campana, chat, email
│   │   ├── actions/       # Ajustes, búsqueda, subir, editar
│   │   ├── status/        # Online, offline, verificado, alerta
│   │   └── ui/            # Flechas, cerrar, menú, chevron, home
│   └── filled/            # Variantes rellenas (mismas categorías)
├── tokens/
│   ├── core/              # Valores primitivos — paleta de color, espaciado, tipografía
│   ├── semantic/          # Aliases semánticos (background, text, border)
│   ├── component/         # Overrides por componente
│   └── themes/            # Overrides de tema claro / oscuro
├── scripts/
│   └── validate.mjs       # Valida icons.json contra el schema
├── dist/                  # Salida generada — NO editar manualmente
├── icons.json             # Catálogo maestro de iconos con metadata
├── icon.schema.json       # JSON Schema que valida icons.json
├── svgo.config.mjs        # Configuración del optimizador SVGO
└── package.json
```

> **`dist/` se commitea al repo** para que los SVGs optimizados sean accesibles directamente via CDN (jsDelivr). Siempre correr `npm run build` antes de commitear para regenerarlo.

---

## Categorías de iconos

| Categoría | Descripción | Ejemplos |
|---|---|---|
| `network` | Cable, fibra, coaxial, señal, router | `cable-fiber`, `router`, `signal-bars` |
| `navigation` | Mapa, pin, ruta, brújula, ubicación | `map-pin`, `route`, `compass` |
| `projects` | Carpeta, orden de trabajo, tarea | `folder`, `work-order`, `add-job` |
| `user` | Perfil, avatar, equipo, cuenta | `profile`, `team`, `account` |
| `reports` | Gráfico, analítica, documento, exportar | `bar-chart`, `report-doc`, `export` |
| `payment` | Tarjeta, efectivo, billetera, recibo | `credit-card`, `wallet`, `receipt` |
| `communication` | Notificación, campana, chat, email | `bell`, `chat-bubble`, `phone` |
| `actions` | Ajustes, buscar, subir, editar, filtrar | `settings`, `upload-photo`, `search` |
| `status` | Online, offline, verificado, advertencia | `verified`, `warning`, `offline` |
| `ui` | Flechas, cerrar, menú, chevron, home | `home`, `menu`, `close`, `chevron-right` |

---

## Guía de estilo visual

| Propiedad | Valor |
|---|---|
| Estilo | Clean Corporate |
| Color de trazo principal | Azul marino oscuro `#1a2744` — via `currentColor` |
| Color de acento / marca | Azul `#2563eb` — via `currentColor` |
| Ancho de trazo | `1.5` |
| Terminación de trazo | `round` |
| Unión de trazo | `round` |
| Fill (iconos outline) | `none` |
| Fill (iconos filled) | `currentColor` |
| Grilla | 24×24 px |
| Zona segura | 2 px en todos los lados (dibujar dentro del rango 2–22) |
| Estilo de esquinas | Redondeadas — evitar ángulos de 90° exactos |

### Tamaños de exportación

| Tamaño | Uso |
|---|---|
| 1024×1024 | Ícono de app store, splash screen |
| 512×512 | Ícono PWA, favicon grande |
| 180×180 | Ícono de pantalla de inicio iOS |
| 32×32 | Favicon |
| 16×16 | Favicon de pestaña del navegador |

> Los SVGs se diseñan en **24×24** y escalan a cualquier tamaño via CSS. Los tamaños de arriba aplican solo para exportaciones rasterizadas (PNG).

### Plantillas SVG

**Icono outline:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- paths aquí -->
</svg>
```

**Icono filled:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <!-- paths aquí -->
</svg>
```

---

## Flujo de trabajo del diseñador

### Configuración inicial

```bash
npm install
```

### Agregar un nuevo icono — paso a paso

**1. Diseñar en Figma / Illustrator**
- Usar un frame de 24×24 con 2 px de padding en todos los lados
- Nunca usar colores hardcodeados — configurar trazos y rellenos en `currentColor` antes de exportar
- Usar `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round` en iconos outline

**2. Exportar el SVG**
- Exportar como SVG plano (no SVG 1.1, no el "optimizado" de Figma — eso lo hace SVGO)
- Colocar el archivo en la carpeta correcta:
  ```
  icons/outline/{categoría}/{nombre-icono}.svg
  icons/filled/{categoría}/{nombre-icono}.svg   ← si existe la variante filled
  ```
- Nombre del archivo: kebab-case en minúsculas, que describa el objeto (`cable-fiber.svg`, no `CableFiber_v2_FINAL.svg`)

**3. Correr el optimizador**
```bash
npm run optimize
```
Esto corre SVGO y elimina todos los artefactos del editor de diseño del SVG. Siempre correrlo después de exportar — nunca commitear la exportación cruda de Figma/AI. Ver [Referencia de scripts](#referencia-de-scripts) para más detalle.

**4. Verificar que el resultado se ve bien**
Abrir el archivo optimizado desde `dist/svg/outline/{categoría}/{nombre}.svg` en un navegador y confirmar que se renderiza correctamente, o usar la URL CDN directamente:
```
https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/outline/{categoría}/{nombre}.svg
```

**5. Registrar el icono en `icons.json`**
Agregar una entrada al array `icons`:
```json
{
  "name": "cable-fiber",
  "category": "network",
  "variants": ["outline", "filled"],
  "tags": ["cable", "coaxial", "fibra", "internet", "broadband"]
}
```
Reglas:
- `name` debe coincidir exactamente con el nombre del archivo (sin `.svg`)
- `variants` lista solo las variantes que realmente se crearon
- `tags` son palabras clave para búsqueda — ser generoso, incluir sinónimos

**6. Validar**
```bash
npm run validate
```
Verifica que cada entrada en `icons.json` tiene formato de nombre válido, categoría conocida y variantes válidas. Corregir cualquier error antes de commitear.

**7. Commitear**
```bash
git add icons/outline/network/cable-fiber.svg icons/filled/network/cable-fiber.svg icons.json
git commit -m "chore(icons): add cable-fiber to network"
```

---

## Referencia de scripts

### `npm run optimize`

**Qué hace:** Corre [SVGO](https://github.com/svg/svgo) sobre todos los SVGs fuente en `icons/outline/` e `icons/filled/`, y escribe la salida limpia en `dist/svg/`.

**Qué elimina / corrige:**

| Qué | Por qué |
|---|---|
| Declaración XML, `<!DOCTYPE>` | No se necesitan en contexto HTML/CDN |
| Comentarios del editor (`<!-- Generator: Figma -->`) | Basura que infla el archivo |
| Tags `<title>`, `<desc>` | Se agregan programáticamente por quien consume el icono |
| Bloques `<style>` inline | Causa conflictos de color — se debe usar `currentColor` |
| Atributos `id` auto-generados | Causa conflictos cuando hay múltiples iconos en la misma página |
| Grupos vacíos `<g></g>` | Markup muerto |
| Transformaciones redundantes (`translate(0,0)`) | Sin efecto visual |
| Precisión decimal excesiva (`23.99998` → `24`) | Tamaño del archivo |
| Formas convertibles (`<rect>` → `<path>` cuando es más corto) | Consistencia |

**Ejemplo antes / después:**
```
Antes (exportación cruda de Figma): 847 bytes
Después (optimizado con SVGO)     : 112 bytes   → 87% más liviano
```

**Cuándo correrlo:** Siempre después de exportar desde cualquier herramienta de diseño. El fuente en `icons/` es la copia de trabajo; `dist/` es lo que se sirve por CDN y **debe commitearse junto con los fuentes**.

---

### `npm run validate`

**Qué hace:** Lee `icons.json` y verifica cada entrada contra `icon.schema.json`.

**Verificaciones que realiza:**
- `name` es kebab-case en minúsculas (ej. `cable-fiber`, no `CableFiber`)
- `category` es una de las 10 categorías permitidas
- `variants` solo contiene `outline` o `filled`
- Los campos requeridos (`name`, `category`, `variants`, `tags`) están presentes

**Salida:**
```bash
# Todo bien:
icons.json OK — 42 icons validated.

# Con errores:
[ERROR] Invalid name format: "CableFiber"
[ERROR] Unknown category "transport" in icon "truck"
2 validation error(s) found.
```

**Cuándo correrlo:** Antes de cada commit. El CI lo corre automáticamente en pull requests.

---

### `npm run build`

**Qué hace:** Corre `optimize` y luego `validate` en secuencia. Usarlo como verificación final antes de abrir un PR.

```bash
npm run build
# equivalente a: npm run optimize && npm run validate
```

---

## Design Tokens

Los tokens siguen una **arquitectura de tres capas** — los cambios fluyen de core hacia afuera:

```
core  →  semantic  →  component
```

| Capa | Carpeta | Propósito | Ejemplo |
|---|---|---|---|
| Core | `tokens/core/` | Valores primitivos crudos — nunca referencian otros tokens | `core.color.blue.600 = #2563eb` |
| Semantic | `tokens/semantic/` | Aliases por intención — siempre referencian tokens core | `color.background.brand → {core.color.blue.600}` |
| Component | `tokens/component/` | Overrides por componente — referencian tokens semánticos | `button.background.primary → {color.background.brand}` |
| Themes | `tokens/themes/` | Overrides claro/oscuro — solo overrides de tokens semánticos | Dark: `color.background.primary → {core.color.gray.900}` |

### Reglas
- Los **tokens core** solo guardan valores crudos — sin referencias
- Los **tokens semánticos** nunca guardan valores crudos — siempre referencian core
- Los **themes** solo overridean tokens semánticos, nunca core
- Sintaxis de referencia: `{ "value": "{core.color.blue.600}" }`

### Agregar un nuevo color al core

Editar `tokens/core/color.json`:
```json
"brand": {
  "navy": { "value": "#1a2744" },
  "blue": { "value": "#2563eb" }
}
```

### Agregar un alias semántico

Editar el archivo correspondiente en `tokens/semantic/color/`:
```json
{
  "color": {
    "background": {
      "brand": { "value": "{core.color.brand.blue}" }
    }
  }
}
```

---

## Uso por CDN

Los iconos se sirven via **jsDelivr** directamente desde este repositorio. No requiere instalación ni descarga.

**Patrón de URL:**
```
https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/{filled|outline}/{categoría}/{nombre}.svg
```

**Ejemplos:**
```
https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/outline/navigation/home.svg
https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/filled/navigation/home.svg
```

### En HTML — como etiqueta de imagen
```html
<img
  src="https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/outline/navigation/home.svg"
  width="24"
  height="24"
  alt="Inicio"
/>
```

### Inline via CSS mask (el color es controlable)
```css
.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: currentColor;
  mask-image: url('https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/outline/navigation/home.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
}
```
Con `mask-image` el color del icono se controla con `color: navy` en el padre — el icono lo hereda automáticamente.

### Como background CSS (decorativo, sin control de color)
```css
.icon-home {
  background-image: url('https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@main/dist/svg/outline/navigation/home.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
}
```

### Versión fija (recomendado para producción)
Para evitar cambios inesperados, apuntar a un tag específico en lugar de `@main`:
```
https://cdn.jsdelivr.net/gh/agbroadband/agb_ezcab_theme@v0.1.0/dist/svg/outline/navigation/home.svg
```

---

## Catálogo `icons.json`

Este archivo es la **fuente de verdad** de qué iconos existen en la librería. Los archivos SVG son los assets; `icons.json` es el índice que los hace buscables y validables.

### Ejemplo de entrada completa
```json
{
  "name": "cable-fiber",
  "category": "network",
  "variants": ["outline", "filled"],
  "tags": ["cable", "coaxial", "fibra", "internet", "broadband", "conexión"],
  "aliases": ["fiber-optic", "coaxial-cable"]
}
```

| Campo | Requerido | Descripción |
|---|---|---|
| `name` | Sí | kebab-case, coincide con el nombre del archivo SVG |
| `category` | Sí | Una de las 10 categorías permitidas |
| `variants` | Sí | Qué variantes existen realmente (`outline`, `filled`, o ambas) |
| `tags` | Sí | Palabras clave de búsqueda — incluir sinónimos |
| `aliases` | No | Nombres alternativos para este icono |

### Categorías permitidas
`network` · `navigation` · `projects` · `user` · `reports` · `payment` · `communication` · `actions` · `status` · `ui`

---

## Contribuir

### Checklist antes de abrir un PR

- [ ] El SVG sigue la guía de estilo (`viewBox="0 0 24 24"`, `currentColor`, sin estilos inline)
- [ ] El archivo está en la carpeta de categoría correcta
- [ ] Se corrió `npm run build` — se commitea tanto `icons/` (fuente) como `dist/` (optimizado para CDN)
- [ ] Se agregó la entrada en `icons.json` con tags
- [ ] `npm run validate` pasa sin errores
- [ ] El mensaje de commit sigue el formato: `chore(icons): add {nombre} to {categoría}`

### Un icono por PR
Mantener los PRs pequeños y enfocados. Si se agrega el par relacionado (`outline` + `filled`), está bien en un solo PR. No agrupar iconos no relacionados.

### Formato del título del PR
```
chore(icons): add cable-fiber and map-pin to network/navigation
```
