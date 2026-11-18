import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compile } from 'sass';

const snapshot = JSON.parse(readFileSync('docs/figma-tokens.json', 'utf8'));

test('color names and values match the current Figma snapshot in both themes', () => {
  const { css } = compile('src/assets/styles/tokens/color.scss');
  const blocks = [...css.matchAll(/\{([^}]+)\}/g)].map((match) =>
    Object.fromEntries(
      [...match[1].matchAll(/(--[\w-]+):\s*(#[\da-f]+);/gi)].map((item) => [
        item[1],
        item[2].toLowerCase(),
      ]),
    ),
  );
  assert.equal(blocks.length, 2);
  for (const [index, theme] of ['light', 'dark'].entries()) {
    const expected = Object.fromEntries(snapshot.colors.map((color) => [color.css, color[theme]]));
    assert.deepEqual(blocks[index], expected);
  }
});

test('global styles resolve their references and keep feature animation settings local', () => {
  const { css } = compile('src/assets/styles/main.scss');
  const declared = new Set([...css.matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]));
  const references = new Set([...css.matchAll(/var\(--([\w-]+)/g)].map((match) => match[1]));
  assert.deepEqual(
    [...references].filter((name) => !declared.has(name)),
    [],
  );
  for (const dimension of snapshot.dimensions.filter((item) => typeof item.value === 'number')) {
    assert(declared.has(dimension.css.slice(2)), dimension.name);
    assert(css.includes(`${dimension.css}: ${dimension.value}px;`), dimension.name);
  }
  assert(!/--(?:preview-|onboarding-|motion-(?:portrait|doctor|intro))/.test(css));
  assert(!/--(?:heading|text|display)-[\w-]*-weight/.test(css));
  const markup = compile('src/assets/styles/tokens/markup.scss').css;
  const spacing = [...markup.matchAll(/--spacing-\d+:\s*(\d+)px/g)].map((match) =>
    Number(match[1]),
  );
  assert.deepEqual(spacing, [4, 8, 12, 16, 20, 24, 32, 40, 48, 56]);
});
