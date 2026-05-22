import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const catalog = JSON.parse(readFileSync(resolve(root, 'icons.json'), 'utf8'));
const schema = JSON.parse(readFileSync(resolve(root, 'icon.schema.json'), 'utf8'));

const validCategories = schema.properties.icons.items.properties.category.enum;
const validVariants = schema.properties.icons.items.properties.variants.items.enum;
const kebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let errors = 0;

for (const icon of catalog.icons) {
  if (!kebabCase.test(icon.name)) {
    console.error(`[ERROR] Invalid name format: "${icon.name}"`);
    errors++;
  }
  if (!validCategories.includes(icon.category)) {
    console.error(`[ERROR] Unknown category "${icon.category}" in icon "${icon.name}"`);
    errors++;
  }
  for (const v of icon.variants) {
    if (!validVariants.includes(v)) {
      console.error(`[ERROR] Unknown variant "${v}" in icon "${icon.name}"`);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log(`icons.json OK — ${catalog.icons.length} icons validated.`);
} else {
  console.error(`\n${errors} validation error(s) found.`);
  process.exit(1);
}
