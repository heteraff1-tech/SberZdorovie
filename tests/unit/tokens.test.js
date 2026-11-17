import test from 'node:test';
import assert from 'node:assert/strict';
import { compile } from 'sass';

test('SCSS emits both themes and every semantic alias resolves to a defined token', () => {
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
  for (const name of [
    'foreground-default',
    'background-surface2',
    'control-primary-bg-hover',
    'input-border-error',
    'chart-weight',
  ]) {
    assert.equal(
      declarations.filter((declaration) => declaration === name).length,
      2,
      `${name} must exist in Light and Dark`,
    );
  }
});
