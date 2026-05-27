# Build & uso en Vuetify

Compila los SVGs de `icons/` a `dist/index.mjs` — un export por ícono (estilo `@mdi/js`), consumible desde Vuetify 4 (Vue 3.5+).

Las convenciones de estilo, theming via CSS custom properties y guía visual de los íconos están en [README.md](README.md).

---

## Comandos

```bash
bun run optimize   # SVGO sobre icons/ (in-place)
bun run build      # genera dist/ + corre `bun link` automáticamente
```

`build` ejecuta `scripts/build.mjs` y produce `dist/index.mjs` + `dist/index.d.ts`. El `postbuild` registra `@agb/ezcab-theme` como paquete global de Bun para que cualquier proyecto local pueda linkearlo.

---

## Naming

`{nombre-kebab}.svg` en `{outline|filled}/{categoría}/` → `agb{NombrePascal}{Variant}`:

| Archivo | Export |
| --- | --- |
| `outline/navigation/home.svg` | `agbHomeOutline` |
| `filled/navigation/home.svg`  | `agbHomeFilled`  |

El build aborta si detecta colisión de nombres.

---

## Linkear en un proyecto Vuetify

```bash
cd /ruta/al/proyecto-vuetify
bun add link:@agb/ezcab-theme
```

Resultado en `package.json` del proyecto consumidor:

```jsonc
{
  "dependencies": {
    "@agb/ezcab-theme": "link:@agb/ezcab-theme"
  }
}
```

---

## Uso

```vue
<script setup>
import { agbHomeOutline, agbHomeFilled } from '@agb/ezcab-theme'
</script>

<template>
  <v-icon :icon="agbHomeOutline" size="32" />
  <v-icon :icon="agbHomeFilled" size="32" />
</template>
```

Cada export es un componente Vue funcional. Tree-shaking automático: solo entra al bundle lo que importes.

---

## Flujo al agregar íconos

```bash
# 1. Guardar SVG en icons/{outline|filled}/{categoría}/{nombre}.svg
bun run optimize   # 2. optimizar
bun run build      # 3. regenerar dist/
# 4. commitear cambios en icons/ y dist/
```

---

## Publicación

```bash
bun publish        # `prepack` corre el build automáticamente
```
