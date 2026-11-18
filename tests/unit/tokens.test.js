import test from 'node:test';
import assert from 'node:assert/strict';
import { compile } from 'sass';
import { existsSync, readFileSync } from 'node:fs';

test('both themes expose ten base colors with no palette, state colors or font-weight tokens', () => {
  const { css } = compile('src/assets/styles/main.scss');
  const declarations = [...css.matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]);
  const defined = new Set(declarations);
  const references = [...css.matchAll(/var\(--([\w-]+)/g)].map((match) => match[1]);

  assert(css.includes('[data-theme=dark]') || css.includes('[data-theme="dark"]'));
  assert(css.includes('[data-theme=light]') || css.includes('[data-theme="light"]'));
  assert.deepEqual(
    [...new Set(references)].filter((name) => !defined.has(name)),
    [],
  );
  const roles = [
    'fg',
    'bg',
    'bg-elevated',
    'border',
    'accent',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
  ];
  const colors = compile('src/assets/styles/tokens/_color.scss').css;
  assert.deepEqual(
    [...new Set([...colors.matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]))].sort(),
    [...roles].sort(),
  );
  assert.equal(existsSync('src/assets/styles/tokens/_palette.scss'), false);
  assert(!/--(?:control-|input-|chart-|palette-|status-)/.test(css));
  assert(!/--(?:heading|text|display)-[\w-]*-weight/.test(css));
  for (const name of roles) {
    assert.equal(
      declarations.filter((declaration) => declaration === name).length,
      2,
      `${name} must exist in Light and Dark`,
    );
  }
});

test('layout tokens are limited to the common spacing, radius and control scales', () => {
  const { css } = compile('src/assets/styles/tokens/_markup.scss');
  const names = [...css.matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]);
  assert.deepEqual(
    names.filter((n) => n.startsWith('space-')),
    [0, 4, 8, 12, 16, 24, 32, 48].map((n) => `space-${n}`),
  );
  assert.deepEqual(
    names.filter((n) => n.startsWith('radius-')),
    [4, 8, 12, 16, 24, 32, 'full'].map((n) => `radius-${n}`),
  );
  assert.deepEqual(
    names.filter((n) => n.startsWith('size-')),
    [24, 32, 44, 56].map((n) => `size-${n}`),
  );
  assert(!readFileSync('src/assets/styles/tokens/_text-style.scss', 'utf8').includes('-weight'));
});
