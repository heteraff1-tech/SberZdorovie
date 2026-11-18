import { test as base, expect } from '@playwright/test';

/** Проверяет ширину документа, не маскируя переполнение через overflow-x: hidden. */
export async function expectNoHorizontalOverflow(page) {
  const geometry = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(
    geometry.document,
    `Горизонтальное переполнение: ${JSON.stringify(geometry)}`,
  ).toBeLessThanOrEqual(geometry.viewport);
}

/** Собирает ошибки конкретной страницы и возвращает явную очистку подписок. */
export function observeBrowserErrors(page) {
  const errors = [];
  const onPageError = (error) => errors.push(`pageerror: ${error.stack ?? error.message}`);
  const onConsole = (message) => {
    if (message.type() === 'error')
      errors.push(`console.error: ${message.text()} (${JSON.stringify(message.location())})`);
  };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  return {
    errors,
    dispose() {
      page.off('pageerror', onPageError);
      page.off('console', onConsole);
    },
  };
}

// Auto-fixture подключает датчики до первого перехода и проверяет каждый сценарий.
export const test = base.extend({
  runtimeGuard: [
    async ({ page }, use) => {
      const monitor = observeBrowserErrors(page);
      try {
        await use();
        if (page.url().startsWith('http://localhost:4173')) await expectNoHorizontalOverflow(page);
        expect(
          monitor.errors,
          'В браузере возникла ошибка; исправь причину, не подавляй console.error.',
        ).toEqual([]);
      } finally {
        monitor.dispose();
      }
    },
    { auto: true },
  ],
});

export { expect };
