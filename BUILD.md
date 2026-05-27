# Build & uso en Vuetify

Compila los SVGs de `icons/` a un módulo ESM tree-shakeable de componentes Vue, estilo `@mdi/js`, para consumirse desde un proyecto Vuetify 4 (Vue 3.5+).

---

## Build + link local

```bash
bun run build
```

Hace dos cosas en cadena:

1. **`build`** — corre `scripts/build.mjs` y genera:
   - `dist/index.mjs` — un export por ícono.
   - `dist/index.d.ts` — tipos.
2. **`postbuild`** — corre `bun link` automáticamente, registrando `@agb/ezcab-theme` como paquete global de Bun. Desde ese momento, cualquier proyecto en la máquina puede consumirlo (ver sección siguiente).

El script (`scripts/build.mjs`) no tiene deps de build; corre solo con built-ins de Node/Bun. Inline-a las reglas CSS por clase como atributos en los `<path>` para que cada SVG sea autosuficiente (no hay leak global de `<style>` cuando se renderizan varios íconos en la misma página).

---

## Naming

`{nombre-kebab}.svg` en `{outline|filled}/{categoría}/` → `agb{NombrePascal}{Variant}`:

| Archivo | Export |
| --- | --- |
| `outline/navigation/home.svg` | `agbHomeOutline` |
| `filled/navigation/home.svg` | `agbHomeFilled` |

El script aborta si detecta colisiones de nombre.

---

## Consumo desde Vuetify 4

Tras `bun run build` el paquete queda registrado globalmente con `bun link`. Desde tu proyecto Vuetify usa `bun add` con el protocolo `link:` — esto crea el symlink **y** persiste la entrada en `package.json` de forma fiable (a diferencia de `bun link @agb/ezcab-theme` que en versiones recientes de Bun no siempre escribe el `package.json` con paquetes scoped):

```bash
cd /ruta/al/proyecto-vuetify
bun add link:@agb/ezcab-theme
```

Resultado en el `package.json` del proyecto Vuetify:

```jsonc
{
  "dependencies": {
    "@agb/ezcab-theme": "link:@agb/ezcab-theme"
  }
}
```

Así queda persistido — cualquiera que clone el proyecto y corra `bun install` reusa el link (si está registrado en su máquina) o falla explícitamente si falta. Luego:

```vue
<script setup>
import { agbHomeOutline, agbHomeFilled } from '@agb/ezcab-theme'
</script>

<template>
  <v-icon :icon="agbHomeOutline" size="32" />
  <v-icon :icon="agbHomeFilled" size="32" />
</template>
```

Cada export es un componente Vue funcional. Importar solo lo que cada página necesite: Vite/Rollup hacen tree-shake del resto gracias a `"sideEffects": false` en el `package.json`. El resultado: cada página termina con su propio chunk mínimo de íconos.

> Al agregar íconos nuevos basta con volver a correr `bun run build` aquí — el symlink ya apunta a `dist/`, así que el proyecto Vuetify ve los nuevos exports tras un reinicio del dev server.

---

## Theming en runtime

Los íconos preservan las CSS custom properties del diseño — anulables globalmente:

```css
:root {
  --agb-stroke: #0D2340;       /* outline: color del trazo */
  --agb-primary: #0d2c57;      /* filled: cuerpo navy */
  --agb-accent-start: #0393f1; /* filled: inicio del gradiente */
  --agb-accent-end: #0479d0;   /* filled: fin del gradiente */
}
```

Para que el color de `<v-icon>` de Vuetify tinte los íconos outline, basta con:

```css
:root { --agb-stroke: currentColor; }
```

---

## Flujo al agregar íconos

1. Guardar el SVG en `icons/{outline|filled}/{categoría}/{nombre}.svg`.
2. `bun run optimize` — pasa SVGO sobre `icons/`.
3. `bun run build` — regenera `dist/`.
4. Commitear cambios en `icons/` (el `dist/` está en `.gitignore`).

---

## Publicación

`prepack` corre el build automáticamente, por lo que `bun publish` (o `npm publish`) deja `dist/` listo en el tarball. El `package.json` ya tiene configurados `exports`, `main`, `module`, `types` y `files: [dist, icons, README.md]`.
