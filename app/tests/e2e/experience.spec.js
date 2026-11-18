import { test, expect, expectNoHorizontalOverflow } from './fixtures';

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

for (const viewport of [
  { width: 360, height: 740 },
  { width: 375, height: 812 },
]) {
  test(`mobile ${viewport.width}×${viewport.height}: layout and assets work with reduced motion and no external services`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const failed = [];
    page.on('requestfailed', (request) => failed.push(request.url()));
    await page.route('**/*', (route) =>
      route.request().url().startsWith('http://localhost:4173') ? route.continue() : route.abort(),
    );
    await page.goto('/#home');
    await expectNoHorizontalOverflow(page);
    await expect(page.locator('.pressure-bars i').first()).toHaveCSS('transform', 'none');
    const phone = await page.locator('.phone').boundingBox();
    expect(phone.width).toBeGreaterThan(0);
    expect(phone.x + phone.width).toBeLessThanOrEqual(viewport.width);
    await page.getByRole('button', { name: 'Помощник', exact: true }).click();
    await expect(page.locator('.scene-entry').first()).toHaveCSS('transform', 'none');
    await expect(page.locator('.home-page__background')).toHaveCSS('opacity', '0');
    await expectNoHorizontalOverflow(page);
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
}

test('375×812: BerryPulse follows live reduced-motion changes and onboarding completes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Connect Apple Health', exact: true }).click();
  const berry = page.locator('.berry');
  const arrows = berry.locator('#pulse-arrows path').first();
  await expect(berry).toHaveAttribute('data-reduced-motion', 'true');
  await expect(berry).toHaveAttribute('data-phase', 'pull');
  await expect(arrows).toHaveCSS('animation-name', 'none');
  await expect(berry.locator('.pulse-light').first()).toHaveCSS('animation-name', 'none');
  await expectNoHorizontalOverflow(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(berry).toHaveAttribute('data-reduced-motion', 'false');
  await expect(arrows).toHaveCSS('animation-name', /arrow-light/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(arrows).toHaveCSS('animation-name', 'none');
  const gesture = page.getByRole('button', { name: 'Swipe up to connect Apple Health' });
  await expect(gesture).toHaveAttribute('aria-disabled', 'false');
  await gesture.focus();
  await gesture.press('ArrowUp');
  await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
});

for (const symptom of ['головокружение', 'дискомфорт']) {
  test(`375×812: HC-001 escalates high pulse and ${symptom} without a diagnosis`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#assistant');
    await page.getByRole('button', { name: `Высокий пульс и ${symptom}`, exact: true }).click();
    const warning = page.getByRole('alert');
    await expect(warning).toHaveAttribute('data-rule', 'HC-001');
    await expect(warning.getByRole('heading', { name: 'Нужна оценка врача' })).toBeFocused();
    await expect(warning).toContainText('Это не диагноз. Ассистент не заменяет врача');
    await expect(warning).toContainText('103 или 112');
    await expect(warning).not.toContainText(/у вас тахикардия|примите|назначаю|диагноз:/i);
    await expect(
      warning.getByRole('link', { name: 'Обратиться к врачу', exact: true }),
    ).toBeVisible();
    await expect(
      warning.getByRole('link', { name: 'Обратиться к врачу', exact: true }),
    ).toHaveAttribute('href', 'tel:103');
    await expect(warning).toContainText('Кнопка откроет звонок в скорую медицинскую помощь');
    await expect(page.locator('.assistant-composer input')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    // Экстренный номер не набираем: проверяем адрес, доступность и возврат.
    await warning.getByRole('button', { name: 'Вернуться к выбору симптомов' }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: `Высокий пульс и ${symptom}`, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Высокий пульс и головокружение', exact: true }),
    ).toBeFocused();
    await page.getByRole('button', { name: `Высокий пульс и ${symptom}`, exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('region', { name: 'Главная — показатели здоровья' })).toBeVisible();
    await expect(page.locator('.home-page')).toBeFocused();
  });
}
