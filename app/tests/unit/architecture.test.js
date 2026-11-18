import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sourceRoot, sourceFiles, architectureViolations } from '../lib/source-inspection.js';

test('FSD imports follow pages → features → shared, including every shared source', () => {
  const errors = ['shared', 'features', 'pages'].flatMap((layer) =>
    sourceFiles(resolve(sourceRoot, layer)).flatMap((file) =>
      architectureViolations(readFileSync(file, 'utf8'), file),
    ),
  );
  assert.deepEqual(errors, [], `Нарушены границы слоёв:\n${errors.join('\n')}`);
});

test('architecture sensor catches aliases, relative paths, exports and dynamic imports', () => {
  const file = resolve(sourceRoot, 'shared/lib/example.js');
  for (const source of [
    "import x from '@/features/health';",
    "export { x } from '../../pages/home/example.js';",
    "import('/src/features/health/index.js?raw');",
    "require('features/assistant/index.js');",
    'import(`@/pages/home/example.js`);',
    'import(variablePath);',
  ])
    assert.equal(architectureViolations(source, file).length, 1, source);
  assert.deepEqual(
    architectureViolations(
      "// import x from '@/features/x';\nconst text = 'import features/x';\nimport { ref } from 'vue';",
      file,
    ),
    [],
  );
  assert.equal(
    architectureViolations(
      '<script setup>import x from "@/pages/home/x";</script>',
      resolve(sourceRoot, 'shared/ui/Example.vue'),
    ).length,
    1,
  );
  assert.equal(
    architectureViolations(
      '@use "../../features/health/style";',
      resolve(sourceRoot, 'shared/ui/example.scss'),
    ).length,
    1,
  );
  assert.equal(
    architectureViolations(
      '@import url("../../features/health/style.css");',
      resolve(sourceRoot, 'shared/ui/example.scss'),
    ).length,
    1,
  );
  assert.equal(
    architectureViolations(
      "import x from '@/features/assistant/ui/X.vue';",
      resolve(sourceRoot, 'pages/home/Example.vue.js'),
    ).length,
    1,
  );
});
