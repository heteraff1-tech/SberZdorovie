import { test, expect, expectNoHorizontalOverflow } from './fixtures';

// Мобильный viewport и сенсорные нажатия Android Chromium.
test.use({ isMobile: true, hasTouch: true });

/** Проверяет фактическую область экрана вместо аппаратного разрешения конкретного телефона. */
async function expectViewportFilled(page) {
  await expect
    .poll(() =>
      page.locator('.mobile-preview__surface').evaluate((el) => {
        const box = el.getBoundingClientRect();
        return Math.abs(box.width - innerWidth) < 1 && Math.abs(box.height - innerHeight) < 1;
      }),
    )
    .toBe(true);
  await expectNoHorizontalOverflow(page);
}

for (const viewport of [
  { width: 393, height: 873 },
  { width: 412, height: 915 },
]) {
  test(`temporary mobile ${viewport.width}×${viewport.height}: fills viewport and preserves navigation`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?mobile=1#home');
    await expectViewportFilled(page);
    await expect(page.locator('.case, .island, .status')).toHaveCount(0);
    await expect(page.locator('.home-page__indicator')).toBeHidden();
    await page.getByRole('button', { name: 'Открыть пульс', exact: true }).tap();
    await expect(page.getByRole('region', { name: 'Пульс — обзор' })).toBeVisible();
    await expect
      .poll(() =>
        page.locator('.ui-bottom-sheet').evaluate((el) => {
          const canvas = el.closest('.screen').getBoundingClientRect();
          const sheet = el.getBoundingClientRect();
          return Math.abs(sheet.height - canvas.height) < 1;
        }),
      )
      .toBe(true);
    await page.getByRole('button', { name: 'Вернуться к показателям здоровья', exact: true }).tap();
    await page.getByRole('button', { name: 'Помощник', exact: true }).tap();
    await expect(page.getByRole('region', { name: 'ИИ-помощник', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть помощника', exact: true }).tap();
    // Имитируем изменение доступной высоты из-за адресной строки Android Chrome.
    await page.setViewportSize({ width: viewport.width, height: 700 });
    await expectViewportFilled(page);
    await expect(page.locator('.ui-bottom-sheet')).toHaveCSS(
      'transform',
      'matrix(1, 0, 0, 1, 0, 0)',
    );
    const sheet = await page.locator('.ui-bottom-sheet').boundingBox();
    const heading = await page.locator('.assistant-header__greeting').boundingBox();
    expect(sheet.y).toBeGreaterThan(heading.y + heading.height);
    // ResizeObserver и touch-переход заканчиваются на соседних кадрах: ждём достижимую геометрию.
    await expect
      .poll(() =>
        page.locator('.ui-bottom-sheet__content').evaluate((el) => {
          el.scrollTop = el.scrollHeight;
          const weight = el.querySelector('[aria-label="Вес"]').getBoundingClientRect();
          const nav = el
            .closest('.home-page')
            .querySelector('.home-page__navigation')
            .getBoundingClientRect();
          return weight.bottom <= nav.top;
        }),
      )
      .toBe(true);
  });
}

test('temporary mobile supports fullscreen before reaching home', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 873 });
  await page.goto('/?mobile=1');
  await expect(page.getByRole('region', { name: 'Daybeat', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toHaveCount(0);
  await expectViewportFilled(page);
  await page.getByRole('button', { name: 'На весь экран', exact: true }).tap();
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await expect(page.getByRole('button', { name: 'На весь экран', exact: true })).toHaveCount(0);
  await expectViewportFilled(page);
  await page.evaluate(() => document.exitFullscreen());
  await expect(page.getByRole('button', { name: 'На весь экран', exact: true })).toBeVisible();
  await expectViewportFilled(page);
});

test('temporary mobile onboarding keeps its action reachable and reaches home', async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 700 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?mobile=1');
  await expectViewportFilled(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).tap();
  await page.getByRole('button', { name: 'Connect Apple Health', exact: true }).tap();
  const gesture = page.getByRole('button', { name: 'Swipe up to connect Apple Health' });
  await expect(gesture).toHaveAttribute('aria-disabled', 'false');
  await gesture.focus();
  await gesture.press('ArrowUp');
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
  await expectViewportFilled(page);
});
