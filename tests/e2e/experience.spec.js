import { test, expect } from '@playwright/test';

test('onboarding completes and its injected SVG keeps its scoped animation styles', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'More than aworkout log.' })).toHaveCSS(
    'color',
    'rgba(255, 255, 255, 0.9)',
  );
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

test('sheet gestures, background dissolve, assistant and first-entry chart state survive the refactor', async ({
  page,
}) => {
  await page.goto('/#home');
  const bars = page.locator('.pressure-bars i');
  await expect
    .poll(() => bars.first().evaluate((element) => element.getAnimations().length))
    .toBe(1);
  const animation = await bars.first().evaluate((element) => element.getAnimations()[0].startTime);
  const handle = page.getByRole('button', { name: 'Открыть ИИ-помощника — свернуть показатели' });
  await page.waitForTimeout(1100);
  const box = await handle.boundingBox();

  await page.mouse.move(box.x + box.width / 2, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 55, { steps: 15 });
  await page.waitForTimeout(300);
  await page.mouse.up();
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
  await expect(page.locator('.ui-bottom-sheet')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  await page.mouse.move(box.x + box.width / 2, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 180, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByRole('region', { name: 'ИИ-помощник', exact: true })).toBeVisible();
  await expect(page.locator('.home-page__background')).toHaveCSS('filter', 'blur(150px)');
  await expect(page.locator('.home-page__background')).toHaveCSS('opacity', '0');
  const maskUrls = await page
    .locator('.ui-icon:not(.ui-icon--image)')
    .evaluateAll((elements) => [
      ...new Set(elements.map((element) => getComputedStyle(element).maskImage.slice(5, -2))),
    ]);
  for (const url of maskUrls) {
    const response = await page.request.get(url);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
  }
  await page.getByRole('button', { name: 'Помоги расшифровать анализы' }).click();
  const input = page.getByRole('textbox', { name: 'Сообщение ИИ-помощнику' });
  await expect(input).toHaveValue('Помоги расшифровать анализы');
  await expect(input).toBeFocused();
  await input.press('Enter');
  await page.getByRole('button', { name: 'История сообщений' }).click();
  await expect(page.getByRole('region', { name: 'История сообщений' })).toContainText(
    'Помоги расшифровать анализы',
  );
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
  expect(await bars.first().evaluate((element) => element.getAnimations()[0].startTime)).toBe(
    animation,
  );
});

test('shared controls work outside the product screen in Light and Dark', async ({ page }) => {
  await page.goto('/#design-system');
  const light = page.getByRole('region', { name: 'light компоненты' });
  const dark = page.getByRole('region', { name: 'dark компоненты' });
  await expect(light).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(dark).toHaveCSS('color', 'rgb(255, 255, 255)');
  for (const section of [light, dark]) {
    await section.getByRole('textbox', { name: 'Сообщение', exact: true }).fill('Проверка');
    await expect(section.getByRole('textbox', { name: 'Сообщение', exact: true })).toHaveValue(
      'Проверка',
    );
    await expect(section.getByRole('textbox', { name: 'Ошибка' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(section.getByRole('button', { name: 'Недоступна' })).toBeDisabled();
    await expect(section.getByRole('button', { name: 'Загрузка…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(section.getByRole('article', { name: 'Показатель' })).toBeVisible();
    const iconButton = section.getByRole('button', { name: 'Пример иконки' });
    const foreground = await iconButton.evaluate((element) => getComputedStyle(element).color);
    await expect(iconButton.locator('.ui-icon')).toHaveCSS('background-color', foreground);
  }
  await page.getByRole('link', { name: 'Открыть главную' }).click();
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
});

test('mobile layout, reduced motion and local assets work without external services', async ({
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
  await page.getByRole('button', { name: 'ИИ помощник', exact: true }).click();
  await expect(page.locator('.scene-depth').first()).toHaveCSS('transform', 'none');
  await expect(page.locator('.home-page__background')).toHaveCSS('opacity', '0');
  expect(
    await page
      .locator('.screen img')
      .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
  ).toBe(true);
  expect(failed).toEqual([]);
});
