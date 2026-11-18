import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseJavaScript, parseExpression } from '@babel/parser';
import { parse as parseVue } from '@vue/compiler-sfc';
import scss from 'postcss-scss';
import valueParser from 'postcss-value-parser';

export const sourceRoot = fileURLToPath(new URL('../../src/', import.meta.url));
const sourceExtensions = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.jsx',
  '.tsx',
  '.vue',
  '.scss',
  '.css',
]);
const colorPattern = /#[\da-f]{3,8}\b|\brgba?\s*\(/gi;
const spacingProperty =
  /^(?:margin|padding)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?$|^(?:(?:row|column)-)?gap$/;

/** Собирает исходники в стабильном порядке, без node_modules и перехода по симлинкам. */
export function sourceFiles(directory, extensions = sourceExtensions) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path, extensions);
      return entry.isFile() && extensions.has(extname(path)) ? [path] : [];
    })
    .sort();
}

/** Обходит AST; комментарии и строки с похожим текстом не становятся импортами. */
function visit(root, callback) {
  const queue = [{ node: root, parent: null }];
  while (queue.length) {
    const { node, parent } = queue.pop();
    if (!node || typeof node !== 'object') continue;
    if (node.type !== undefined) callback(node, parent);
    for (const [key, child] of Object.entries(node)) {
      if (['loc', 'comments', 'tokens', 'extra'].includes(key)) continue;
      if (Array.isArray(child))
        queue.push(...child.map((nodeChild) => ({ node: nodeChild, parent: node })));
      else if (child && typeof child === 'object') queue.push({ node: child, parent: node });
    }
  }
}

/** Читает Vue как SFC, остальные файлы — как отдельный script или stylesheet. */
function blocks(source, file) {
  if (extname(file) === '.vue') {
    const { descriptor, errors } = parseVue(source, { filename: file });
    if (errors.length) throw new Error(`${file}: ${errors.join('\n')}`);
    return {
      scripts: [descriptor.script, descriptor.scriptSetup].filter(Boolean),
      styles: descriptor.styles,
      template: descriptor.template,
    };
  }
  const block = { content: source, loc: { start: { line: 1 } } };
  return ['.scss', '.css'].includes(extname(file))
    ? { scripts: [], styles: [block] }
    : { scripts: [block], styles: [] };
}

/** Извлекает статические, динамические, CommonJS и стилевые зависимости. */
export function importsIn(source, file) {
  const { scripts, styles } = blocks(source, file);
  const imports = [];
  const add = (value, line) => imports.push({ value, line });
  for (const script of scripts) {
    if (script.src) add(script.src, script.loc.start.line);
    const ast = parseJavaScript(script.content, {
      sourceType: 'unambiguous',
      createImportExpressions: true,
      plugins: ['typescript', 'jsx'],
    });
    visit(ast, (node) => {
      const line = script.loc.start.line + (node.loc?.start.line ?? 1) - 1;
      if (
        ['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type)
      ) {
        if (node.source) add(node.source.value, line);
      }
      if (node.type === 'TSImportEqualsDeclaration' && node.moduleReference.expression) {
        add(node.moduleReference.expression.value, line);
      }
      if (
        node.type === 'ImportExpression' ||
        (node.type === 'CallExpression' && node.callee.name === 'require')
      ) {
        const target = node.source ?? node.arguments[0];
        const literal =
          target?.type === 'StringLiteral'
            ? target.value
            : target?.type === 'TemplateLiteral' && target.expressions.length === 0
              ? target.quasis[0].value.cooked
              : null;
        add(literal, line);
      }
    });
  }
  for (const style of styles) {
    if (style.src) add(style.src, style.loc.start.line);
    scss.parse(style.content).walkAtRules(/^(?:use|forward|import)$/, (rule) => {
      const target = valueParser(rule.params).nodes.find(
        (node) => node.type === 'string' || (node.type === 'function' && node.value === 'url'),
      );
      const value =
        target?.type === 'function'
          ? target.nodes.find((node) => ['string', 'word'].includes(node.type))?.value
          : target?.value;
      if (value) add(value, style.loc.start.line + rule.source.start.line - 1);
    });
  }
  return imports;
}

/** Разрешает Vite alias и относительные пути до проверки слоя. */
function importPath(value, importer) {
  const path = value.replaceAll('\\', '/').split(/[?#]/)[0];
  if (path.startsWith('@/')) return resolve(sourceRoot, path.slice(2));
  if (path.startsWith('/src/') || path.startsWith('src/'))
    return resolve(sourceRoot, path.replace(/^\/?src\//, ''));
  if (/^(features|pages|shared)\//.test(path)) return resolve(sourceRoot, path);
  return path.startsWith('.') ? resolve(dirname(importer), path) : null;
}

/** Проверяет направление зависимостей и публичную точку входа feature. */
export function architectureViolations(source, file) {
  const [layer, feature] = relative(sourceRoot, file).replaceAll('\\', '/').split('/');
  return importsIn(source, file).flatMap(({ value, line }) => {
    if (value === null)
      return [
        `${file}:${line}: вычисляемый import/require нельзя проверить; укажи статический путь.`,
      ];
    const path = importPath(value, file);
    if (!path) return [];
    const target = relative(sourceRoot, path).replaceAll('\\', '/');
    const [targetLayer, targetFeature, ...inside] = target.split('/');
    const forbidden =
      (layer === 'shared' && ['features', 'pages'].includes(targetLayer)) ||
      (layer === 'features' && targetLayer === 'pages') ||
      (layer === 'features' && targetLayer === 'features' && feature !== targetFeature);
    if (forbidden)
      return [
        `${file}:${line}: импорт «${value}» нарушает FSD. Перенеси общий контракт в shared, а связь сценариев — в pages (pages → features → shared).`,
      ];
    if (
      layer === 'pages' &&
      targetLayer === 'features' &&
      inside.length &&
      !/^index(?:\.[cm]?[jt]s)?$/.test(inside.join('/'))
    ) {
      return [
        `${file}:${line}: импортируй «${targetFeature}» через features/${targetFeature}/index.js.`,
      ];
    }
    return [];
  });
}

/** Возвращает имена общих переменных; локальные aliases не обходят spacing guardrail. */
export function tokenNames() {
  const names = new Set();
  for (const file of sourceFiles(resolve(sourceRoot, 'assets/styles/tokens'), new Set(['.scss']))) {
    scss.parse(readFileSync(file, 'utf8')).walkDecls(/^--/, (decl) => names.add(decl.prop));
  }
  return names;
}

/** Находит цвета в значениях, сохраняя допустимые ссылки на SVG-маски url(#id). */
function rawColors(value) {
  let searchable = value;
  const parsed = valueParser(value);
  parsed.walk((node) => {
    if (
      node.type === 'function' &&
      node.value === 'url' &&
      node.nodes.find((child) => ['word', 'string'].includes(child.type))?.value.startsWith('#')
    )
      searchable =
        searchable.slice(0, node.sourceIndex) +
        value.slice(node.sourceIndex, node.sourceEndIndex).replace(/[^\n]/g, ' ') +
        searchable.slice(node.sourceEndIndex);
  });
  return [...searchable.matchAll(colorPattern)].map((match) => ({
    color: match[0],
    lines: value.slice(0, match.index).split('\n').length - 1,
  }));
}

/** Проверяет CSS-декларации и inline-стили Vue с привязкой к строке файла. */
export function styleViolations(source, file, names = tokenNames()) {
  const { scripts, styles, template } = blocks(source, file);
  const violations = [];
  const check = (property, value, line) => {
    for (const { color, lines } of rawColors(value))
      violations.push(
        `${file}:${line + lines}: сырой цвет «${color}»; замени на токен из app/src/assets/styles/tokens/color.scss.`,
      );
    if (!spacingProperty.test(property)) return;
    let invalid = false;
    valueParser(value).walk((node) => {
      if (node.type === 'function' && node.value === 'var') {
        const name = node.nodes[0]?.value;
        if (!names.has(name)) invalid = true;
      }
      if (
        node.type === 'word' &&
        /^-?(?:\d*\.)?\d+(?:px|r?em|[ds]?v[wh]|vmin|vmax|ch|%)$/.test(node.value) &&
        parseFloat(node.value) !== 0
      )
        invalid = true;
      if (
        node.type === 'word' &&
        /^-?(?:\d*\.)?\d+$/.test(node.value) &&
        Number(node.value) !== 0 &&
        !/(?:calc|min|max|clamp)\(/.test(value)
      )
        invalid = true;
    });
    if (invalid)
      violations.push(
        `${file}:${line}: ${property}: ${value} — используй общую шкалу app/src/assets/styles/tokens/markup.scss (ноль и auto допустимы).`,
      );
  };
  for (const style of styles)
    scss
      .parse(style.content)
      .walkDecls((decl) =>
        check(
          decl.prop,
          decl.value,
          style.loc.start.line +
            decl.source.start.line -
            1 +
            decl.raws.between.split('\n').length -
            1,
        ),
      );
  for (const script of scripts) {
    const ast = parseJavaScript(script.content, {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx'],
    });
    visit(ast, (node, parent) => {
      if (!['StringLiteral', 'TemplateElement', 'NumericLiteral'].includes(node.type)) return;
      if (
        parent?.type === 'CallExpression' &&
        ['querySelector', 'querySelectorAll'].includes(parent.callee.property?.name)
      )
        return;
      const property =
        parent?.type === 'ObjectProperty' ? (parent.key.name ?? parent.key.value) : '';
      const value = node.type === 'TemplateElement' ? node.value.raw : String(node.value);
      check(property, value, script.loc.start.line + node.loc.start.line - 1);
    });
  }
  if (template?.ast)
    visit(template.ast, (node) => {
      for (const prop of node.props ?? []) {
        const line = prop.loc.start.line + template.loc.start.line - 1;
        if (prop.type === 6 && prop.value) {
          if (prop.name === 'style')
            scss
              .parse(`x {${prop.value.content}}`)
              .walkDecls((decl) => check(decl.prop, decl.value, line));
          if (['fill', 'stroke', 'color', 'bgcolor'].includes(prop.name))
            check(prop.name, prop.value.content, line);
        }
        if (prop.type === 7 && prop.name === 'bind' && prop.arg?.content === 'style' && prop.exp) {
          const ast = parseExpression(prop.exp.content);
          visit(ast, (item) => {
            if (item.type === 'ObjectProperty' && item.value.type === 'StringLiteral') {
              const key = (item.key.name ?? item.key.value).replace(
                /[A-Z]/g,
                (letter) => `-${letter.toLowerCase()}`,
              );
              check(key, item.value.value, line + item.loc.start.line - 1);
            }
          });
        }
        if (
          prop.type === 7 &&
          prop.name === 'bind' &&
          ['fill', 'stroke', 'color'].includes(prop.arg?.content) &&
          prop.exp
        )
          check(prop.arg.content, prop.exp.content, line);
      }
    });
  return violations;
}
