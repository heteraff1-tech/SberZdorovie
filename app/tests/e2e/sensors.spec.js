import { test, expect, observeBrowserErrors, expectNoHorizontalOverflow } from './fixtures';

test('QA sensors detect console errors, uncaught JS and horizontal overflow', async ({
  browser,
}) => {
  // Ошибки намеренно создаются только в изолированной диагностической странице.
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const probe = await context.newPage();
  const monitor = observeBrowserErrors(probe);
  try {
    await probe.setContent('<main style="width: 900px">Diagnostic fixture</main>');
    await probe.evaluate(() => {
      console.error('qa-console-probe');
      setTimeout(() => {
        throw new Error('qa-runtime-probe');
      }, 0);
    });
    await expect.poll(() => monitor.errors.length).toBe(2);
    expect(monitor.errors.some((error) => error.includes('console.error: qa-console-probe'))).toBe(
      true,
    );
    expect(
      monitor.errors.some((error) => error.includes('pageerror: Error: qa-runtime-probe')),
    ).toBe(true);
    await expect(expectNoHorizontalOverflow(probe)).rejects.toThrow('Горизонтальное переполнение');
  } finally {
    monitor.dispose();
    await context.close();
  }
});
