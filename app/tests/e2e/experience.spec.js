import { test, expect } from '@playwright/test';

test('onboarding keeps its SVG animation and reaches the health dashboard', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Connect Apple Health', exact: true }).click();
  const gesture = page.getByRole('button', { name: 'Swipe up to connect Apple Health' });
  await expect(gesture).toHaveAttribute('aria-disabled', 'false');
  await expect(page.locator('.berry #pulse-body')).toHaveCSS('filter', 'none');
  await expect(page.locator('.berry #pulse-arrows path').first()).toHaveCSS(
    'animation-name',
    /arrow-light/,
  );
  await gesture.focus();
  await gesture.press('ArrowUp');
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Артериальное давление' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('sheet gestures and background dissolve preserve the first-entry chart state', async ({
  page,
}) => {
  await page.goto('/#home');
  const bars = page.locator('.pressure-bars i');
  await expect
    .poll(() => bars.first().evaluate((element) => element.getAnimations().length))
    .toBe(1);
  await expect
    .poll(() =>
      bars.evaluateAll((elements) =>
        elements.every((element) => element.getAnimations().length === 1),
      ),
    )
    .toBe(true);
  const started = await bars.first().evaluate((element) => element.getAnimations()[0].startTime);
  const handle = page.getByRole('button', { name: 'Открыть ИИ-помощника — свернуть показатели' });
  await page.waitForTimeout(1100);
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 55, { steps: 15 });
  await page.waitForTimeout(300);
  await page.mouse.up();
  await expect(page.locator('.ui-bottom-sheet')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.mouse.move(box.x + box.width / 2, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 180, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByRole('region', { name: 'ИИ-помощник', exact: true })).toBeVisible();
  await expect(page.locator('.home-page__background')).toHaveCSS('filter', 'blur(150px)');
  await expect(page.locator('.home-page__background')).toHaveCSS('opacity', '0');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
  expect(await bars.first().evaluate((element) => element.getAnimations()[0].startTime)).toBe(
    started,
  );
});

test('assistant content is static and does not follow the pointer', async ({ page }) => {
  await page.goto('/#assistant');
  await page.waitForTimeout(1900);
  const composer = page.locator('.assistant-composer');
  await expect(composer).toContainText('Введите сообщение');
  await expect(composer.locator('input, button, form, textarea')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'История сообщений' })).toHaveCount(0);
  await expect(page.locator('.assistant-scene button')).toHaveCount(0);
  let fileChooser = false;
  page.on('filechooser', () => {
    fileChooser = true;
  });
  await composer.locator('.assistant-composer__attachment').click();
  expect(fileChooser).toBe(false);

  const positions = () =>
    page.locator('.scene-entry').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      }),
    );
  const before = await positions();
  await page.mouse.move(10, 10);
  await page.mouse.move(700, 700, { steps: 15 });
  await page.waitForTimeout(250);
  expect(await positions()).toEqual(before);

  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  await expect(page.locator('.assistant-composer__field')).toHaveCSS(
    'background-color',
    'rgb(27, 36, 48)',
  );
  await expect(page.locator('.assistant-composer__field')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await page.getByRole('button', { name: 'Здоровье', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
});

test('mobile layout and local assets work with reduced motion and no external services', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const failed = [];
  page.on('requestfailed', (request) => failed.push(request.url()));
  await page.route('**/*', (route) =>
    route.request().url().startsWith('http://localhost:4173') ? route.continue() : route.abort(),
  );
  await page.goto('/#home');
  await expect(page.locator('.pressure-bars i').first()).toHaveCSS('transform', 'none');
  const phone = await page.locator('.phone').boundingBox();
  expect(phone.width).toBeGreaterThan(0);
  expect(phone.x + phone.width).toBeLessThanOrEqual(360);
  await page.getByRole('button', { name: 'Помощник', exact: true }).click();
  await expect(page.locator('.scene-entry').first()).toHaveCSS('transform', 'none');
  await expect(page.locator('.home-page__background')).toHaveCSS('opacity', '0');
  const urls = await page
    .locator('.ui-icon:not(.ui-icon--image)')
    .evaluateAll((elements) => [
      ...new Set(elements.map((element) => getComputedStyle(element).maskImage.slice(5, -2))),
    ]);
  for (const url of urls) {
    const response = await page.request.get(url);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
  }
  expect(
    await page
      .locator('.screen img')
      .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
  ).toBe(true);
  expect(failed).toEqual([]);
});
