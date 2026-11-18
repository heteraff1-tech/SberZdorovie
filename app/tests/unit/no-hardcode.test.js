import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sourceRoot, sourceFiles, styleViolations, tokenNames } from '../lib/source-inspection.js';

test('features and pages use shared color and spacing tokens', () => {
  const names = tokenNames();
  const errors = ['features', 'pages'].flatMap((layer) =>
    sourceFiles(resolve(sourceRoot, layer), new Set(['.vue', '.scss'])).flatMap((file) =>
      styleViolations(readFileSync(file, 'utf8'), file, names),
    ),
  );
  assert.deepEqual(errors, [], `Найдены стили вне дизайн-системы:\n${errors.join('\n')}`);
});

test('style sensor reports file and line, checks Vue inline styles, ignores comments and SVG IDs', () => {
  const file = resolve(sourceRoot, 'features/example/ui/Example.vue');
  const source =
    '<template><div :style="{ color: \'#ff0\', paddingTop: \'7px\' }" /></template>\n<style lang="scss">\n.x { color: RGB(1 2 3); gap: var(--local-space); }\n</style>';
  const errors = styleViolations(source, file);
  assert.equal(errors.length, 4);
  assert(errors.every((error) => error.includes(file)));
  assert(errors.some((error) => error.includes(':3:') && error.includes('color.scss')));
  const valid =
    '<template><svg><path fill="url(#face)" /></svg></template>\n<style lang="scss">/* color: #fff; */ .x { margin: 0 auto; gap: var(--spacing-2); padding: calc(var(--spacing-1) / 2); mask: url(#face); }</style>';
  assert.deepEqual(styleViolations(valid, file), []);
  const multiline =
    '<script setup>const color = "#aBcD";</script>\n<style>\n.x { background: linear-gradient(\n#12345678,\nrgba(1, 2, 3, .5)); mask: url("#face"); }\n</style>';
  const reported = styleViolations(multiline, file);
  assert.equal(reported.length, 3);
  assert(reported.some((error) => error.includes(':4:') && error.includes('#12345678')));
  assert(reported.some((error) => error.includes(':5:') && error.includes('rgba(')));
});
