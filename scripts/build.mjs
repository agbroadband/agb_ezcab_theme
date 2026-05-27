// Compiles icons/{outline,filled}/{category}/{name}.svg into a tree-shakeable
// ESM module of Vue components, mdi-js style.
//
// Each SVG becomes one named export:
//   home.svg in outline/navigation -> agbHomeOutline
//   home.svg in filled/navigation  -> agbHomeFilled
//
// Per-class CSS rules from the source <style> are inlined as attributes so the
// emitted SVGs are self-contained (no global style leak when many icons render
// on the same page).

import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const iconsDir = join(root, 'icons')
const distDir = join(root, 'dist')

const VARIANTS = ['outline', 'filled']

function toCamel(s) {
  return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}
function toPascal(s) {
  const c = toCamel(s)
  return c.charAt(0).toUpperCase() + c.slice(1)
}

async function listIconFiles(variant) {
  const base = join(iconsDir, variant)
  let categories
  try {
    categories = await readdir(base, { withFileTypes: true })
  } catch {
    return []
  }
  const out = []
  for (const cat of categories) {
    if (!cat.isDirectory()) continue
    const catDir = join(base, cat.name)
    const files = await readdir(catDir, { withFileTypes: true })
    for (const f of files) {
      if (!f.isFile() || !f.name.endsWith('.svg')) continue
      out.push({
        variant,
        category: cat.name,
        name: f.name.slice(0, -4),
        path: join(catDir, f.name),
      })
    }
  }
  return out
}

function parseAttrs(s) {
  const attrs = {}
  for (const m of s.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
    attrs[m[1]] = m[2]
  }
  return attrs
}

function parseStyleBlock(css) {
  const rules = {}
  for (const m of css.matchAll(/\.([\w-]+)\s*\{([^}]+)\}/g)) {
    const decls = {}
    for (const d of m[2].split(';')) {
      const idx = d.indexOf(':')
      if (idx < 0) continue
      const k = d.slice(0, idx).trim()
      const v = d.slice(idx + 1).trim()
      if (k) decls[k] = v
    }
    rules[m[1]] = decls
  }
  return rules
}

function serializeAttrs(attrs) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${v.replace(/"/g, '&quot;')}"`)
    .join(' ')
}

// Strip <style> from defs, parse class rules, inline them as attributes on the
// elements that reference those classes, then strip the now-empty <defs>.
function processSvg(svg, iconName) {
  const openMatch = svg.match(/<svg([^>]*)>/)
  if (!openMatch) throw new Error(`No <svg> open tag in ${iconName}`)
  const closeIdx = svg.lastIndexOf('</svg>')
  if (closeIdx < 0) throw new Error(`No </svg> close tag in ${iconName}`)
  const inner = svg.slice(openMatch.index + openMatch[0].length, closeIdx)

  let rest = inner
  let defsBody = ''
  const defsMatch = rest.match(/<defs>([\s\S]*?)<\/defs>/)
  if (defsMatch) {
    defsBody = defsMatch[1]
    rest = rest.slice(0, defsMatch.index) + rest.slice(defsMatch.index + defsMatch[0].length)
  }

  let classRules = {}
  const styleMatch = defsBody.match(/<style[^>]*>([\s\S]*?)<\/style>/)
  if (styleMatch) {
    classRules = parseStyleBlock(styleMatch[1])
    defsBody = defsBody.slice(0, styleMatch.index) + defsBody.slice(styleMatch.index + styleMatch[0].length)
  }

  const inlineClass = (segment) =>
    segment.replace(/<(\w+)([^>]*?)(\/?)>/g, (full, tag, attrsStr, selfClose) => {
      const attrs = parseAttrs(attrsStr)
      if (attrs.class && classRules[attrs.class]) {
        const rules = classRules[attrs.class]
        const cls = attrs.class
        delete attrs.class
        // Source attrs win over CSS rules (rare but safer).
        const merged = { ...rules, ...attrs }
        const ordered = {}
        // Stable attribute order: d first if present, then everything else.
        if ('d' in merged) ordered.d = merged.d
        for (const [k, v] of Object.entries(merged)) {
          if (k !== 'd') ordered[k] = v
        }
        void cls
        return `<${tag} ${serializeAttrs(ordered)}${selfClose ? '/' : ''}>`
      }
      return full
    })

  defsBody = inlineClass(defsBody).trim()
  rest = inlineClass(rest).trim()

  const finalDefs = defsBody ? `<defs>${defsBody}</defs>` : ''
  return (finalDefs + rest).replace(/\s+</g, '<').trim()
}

async function build() {
  const all = []
  for (const v of VARIANTS) {
    all.push(...(await listIconFiles(v)))
  }
  if (all.length === 0) {
    throw new Error(`No SVG icons found under ${iconsDir}`)
  }

  await rm(distDir, { recursive: true, force: true })
  await mkdir(distDir, { recursive: true })

  const exports = []
  for (const icon of all) {
    const raw = await readFile(icon.path, 'utf8')
    const inner = processSvg(raw, `${icon.variant}/${icon.category}/${icon.name}`)
    const exportName = `agb${toPascal(icon.name)}${toPascal(icon.variant)}`
    const componentName = `Agb${toPascal(icon.name)}${toPascal(icon.variant)}`
    exports.push({ ...icon, exportName, componentName, inner })
  }

  // Collision check.
  const seen = new Map()
  for (const e of exports) {
    const dupe = seen.get(e.exportName)
    if (dupe) {
      throw new Error(
        `Name collision on "${e.exportName}":\n  ${dupe.path}\n  ${e.path}`
      )
    }
    seen.set(e.exportName, e)
  }
  exports.sort((a, b) => a.exportName.localeCompare(b.exportName))

  // index.mjs — Vue functional components, one named export per icon.
  const mjsLines = [
    '// Generated by scripts/build.mjs — do not edit by hand.',
    "import { h, defineComponent } from 'vue'",
    '',
    'const make = (name, inner) =>',
    '  defineComponent({',
    '    name,',
    '    inheritAttrs: false,',
    '    setup(_, { attrs }) {',
    "      return () => h('svg', {",
    "        xmlns: 'http://www.w3.org/2000/svg',",
    "        viewBox: '0 0 24 24',",
    "        width: '1em',",
    "        height: '1em',",
    '        ...attrs,',
    '        innerHTML: inner,',
    '      })',
    '    },',
    '  })',
    '',
  ]
  for (const e of exports) {
    mjsLines.push(
      `export const ${e.exportName} = /*#__PURE__*/ make(${JSON.stringify(
        e.componentName
      )}, ${JSON.stringify(e.inner)})`
    )
  }
  mjsLines.push('')
  await writeFile(join(distDir, 'index.mjs'), mjsLines.join('\n'))

  // index.d.ts — minimal Vue component typing.
  const dtsLines = [
    '// Generated by scripts/build.mjs — do not edit by hand.',
    "import type { DefineComponent } from 'vue'",
    '',
    'export type AgbIcon = DefineComponent<{}, {}, any>',
    '',
  ]
  for (const e of exports) {
    dtsLines.push(`export declare const ${e.exportName}: AgbIcon`)
  }
  dtsLines.push('')
  await writeFile(join(distDir, 'index.d.ts'), dtsLines.join('\n'))

  // Summary.
  const byVariant = exports.reduce((acc, e) => {
    acc[e.variant] = (acc[e.variant] || 0) + 1
    return acc
  }, {})
  const summary = Object.entries(byVariant)
    .map(([v, n]) => `${n} ${v}`)
    .join(', ')
  console.log(`Built ${exports.length} icons (${summary}) → dist/`)
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
